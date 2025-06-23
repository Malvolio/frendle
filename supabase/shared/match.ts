//
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fromPairs, groupBy, mapValues } from "https://esm.sh/lodash@4.17.21";
import { MAX_SESSIONS } from "./constants.ts";
import { Database } from "./supabase.ts";
import type { Session } from "./types.ts";
import {
  createErrorResponse,
  createSuccessResponse,
  findOverlappingSlots,
  formatDateForEmail,
  generateICSInvite,
  generateSessionLink,
  getPrivateProfile,
  getPublicProfile,
  getUserProfile,
  sendEmail,
} from "./utils.ts";

type MatchingPartner =
  Database["public"]["Functions"]["get_matching_partners"]["Returns"][number];

const getMatchingPartnersRPC = async (
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<MatchingPartner[]> => {
  const { data, error } = await supabase.rpc("get_matching_partners", {
    arg_id: userId,
  });

  if (error) {
    throw new Error(`RPC call failed: ${error.message}`);
  }

  return data;
};

const haveReachedMaxSessions = async (
  supabase: SupabaseClient<Database>,
  userIds: string[]
): Promise<Record<string, boolean>> => {
  if (userIds.length === 0) {
    return {};
  }

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("host_id, guest_id")
    .or(userIds.map((id) => `host_id.eq.${id},guest_id.eq.${id}`).join(","))
    .eq("session_status", "scheduled")
    .gte("scheduled_for", new Date().toISOString());

  if (error) {
    console.error(`Failed to check users sessions`, error);
    return fromPairs(userIds.map((id) => [id, false]));
  }

  const sessionCounts = fromPairs(userIds.map((id) => [id, 0]));

  // Count sessions where user is either host or guest
  sessions?.forEach((session) => {
    if (userIds.includes(session.host_id)) {
      sessionCounts[session.host_id] =
        (sessionCounts[session.host_id] || 0) + 1;
    }
    if (userIds.includes(session.guest_id)) {
      sessionCounts[session.guest_id] =
        (sessionCounts[session.guest_id] || 0) + 1;
    }
  });

  return mapValues(sessionCounts, (count) => count >= MAX_SESSIONS);
};

const getUpcomingSessions = async (
  supabase: SupabaseClient,
  userId: string
): Promise<Date[]> => {
  // Calculate timestamp 2 hours ago
  const twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  const { data, error } = await supabase
    .from("sessions")
    .select("scheduled_for")
    .or(`guest_id.eq.${userId},host_id.eq.${userId}`)
    .in("session_status", ["scheduled", "rated"])
    .gt("scheduled_for", twoHoursAgo.toISOString());

  if (error) {
    console.error(`Failed to fetch sessions:`, error);
  }

  return data?.map(({ scheduled_for }) => new Date(scheduled_for)) || [];
};

const getUsersAvailability = async (
  supabase: SupabaseClient<Database>,
  userIds: string[]
): Promise<Record<string, number[]>> => {
  if (userIds.length === 0) {
    return {};
  }

  const { data: usersAvailability, error } = await supabase
    .from("availabilities")
    .select("user_id, hour_of_week")
    .in("user_id", userIds);

  if (error) {
    console.error(`Failed to fetch users availability`, error);
    return {};
  }

  // Group by user_id and map to hour_of_week values
  const groupedByUserId = groupBy(usersAvailability, "user_id");

  return mapValues(groupedByUserId, (availabilities) =>
    availabilities.map(({ hour_of_week }) => hour_of_week)
  );
};

const sendNotificationEmail = async (
  session: Session,
  name: string,
  email: string,
  timezone: string,
  isHost: boolean,
  partnerName: string
) => {
  try {
    const link = generateSessionLink(session.id, isHost);

    const text = `You have a new Frendle session scheduled!

Session Details:
Date: ${formatDateForEmail(new Date(session.scheduled_for), timezone)}
Partner: ${partnerName}

Your session link: ${link}

Please confirm your attendance by clicking the link above.`;

    const hostICS = generateICSInvite(
      session.id,
      new Date(session.scheduled_for),
      name,
      partnerName,
      true
    );

    await sendEmail(email, "New Frendle Session Scheduled", text, hostICS);
  } catch (emailError) {
    console.error("Failed to send emails:", emailError);
  }
};

const getUserAvailability = async (
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<number[]> => {
  const usersAvailability = await getUsersAvailability(supabase, [userId]);
  return usersAvailability[userId] || [];
};

const hasOverlap = (times: Date[], time: Date): boolean =>
  times.find((t) => {
    const diff = Math.abs(t.getTime() - time.getTime());
    return diff <= 90 * 60 * 1000; // 90 minutes in milliseconds
  }) !== undefined;

export const matchUser = async (
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Response> => {
  try {
    // 2. Verify user has good membership status
    const userProfile = await getUserProfile(supabase, userId);
    if (userProfile.membership_status !== "good") {
      return createErrorResponse(
        "User must have good membership status to match"
      );
    }

    // 3. Count user's existing future sessions
    const futureSessions = await getUpcomingSessions(supabase, userId);

    if (futureSessions.length >= MAX_SESSIONS) {
      return createErrorResponse(
        `Maximum of ${MAX_SESSIONS} future sessions allowed`
      );
    }

    const acandidates = await getMatchingPartnersRPC(supabase, userId);

    if (!acandidates.length) {
      return createErrorResponse("No potential matches found");
    }
    const maxedOut = await haveReachedMaxSessions(
      supabase,
      acandidates.map((c) => c.partner_id)
    );
    const candidates = acandidates.filter((c) => !maxedOut[c.partner_id]);

    // Get user's private profile and availability
    const {
      data: { user: userAuthProfile },
      error: authError,
    } = await supabase.auth.getUser();
    if (!userAuthProfile || !userAuthProfile.email) {
      console.error("Failed to create relationship:", authError);
      return createErrorResponse("User authentication failed");
    }
    const userPrivateProfile = await getPrivateProfile(supabase, userId);
    const userPublicProfile = await getPublicProfile(supabase, userId);
    const userAvailabilityHours = await getUserAvailability(supabase, userId);
    const candidateAvailabilities = await getUsersAvailability(
      supabase,
      candidates.map((c) => c.partner_id)
    );

    const times = candidates.map((candidate) => {
      const candidateAvailabilityHours =
        candidateAvailabilities[candidate.partner_id] || [];

      const overlappingSlots = findOverlappingSlots(
        userAvailabilityHours,
        candidateAvailabilityHours,
        userPrivateProfile.timezone,
        candidate.partner_timezone,
        new Date()
      );

      return [candidate, overlappingSlots] as const;
    });

    const maxNewMatches = MAX_SESSIONS - futureSessions.length;
    type Match = {
      guest: MatchingPartner;
      time: Date;
    };

    type SoFar = {
      matches: Match[];
      usedTimes: Date[];
    };

    const { matches } = times.reduce(
      (soFar: SoFar, [candidate, times]) => {
        if (soFar.matches.length >= maxNewMatches) {
          return soFar; // Stop if we reached max matches
        }
        for (const time of times) {
          if (!hasOverlap(soFar.usedTimes, time)) {
            return {
              matches: [...soFar.matches, { guest: candidate, time }],
              usedTimes: [...soFar.usedTimes, time],
            };
          }
        }
        return soFar;
      },
      { matches: [] as Match[], usedTimes: futureSessions }
    );

    if (matches.length === 0) {
      return createErrorResponse("No compatible matches found");
    }

    // 6. Create new sessions and relationship records
    const createdSessions: Session[] = [];

    for (const match of matches) {
      const { time, guest } = match;
      const { data: session, error: sessionCreateError } = await supabase
        .from("sessions")
        .insert({
          scheduled_for: time.toISOString(),
          host_id: userId,
          guest_id: guest.partner_id,
          session_status: "scheduled",
        })
        .select()
        .single();

      if (sessionCreateError) {
        console.error("Failed to create session:", sessionCreateError);
        continue;
      }

      // Create or update relationship
      const { error: relationshipError } = await supabase
        .from("relationships")
        .upsert({
          host_id: userId,
          guest_id: guest.partner_id,
        });

      if (relationshipError) {
        console.error("Failed to create relationship:", relationshipError);
      }

      createdSessions.push(session);

      await sendNotificationEmail(
        session,
        name,
        userAuthProfile.email,
        userPrivateProfile.timezone,
        true,
        guest.name
      );
      await sendNotificationEmail(
        session,
        guest.name,
        guest.email,
        guest.partner_timezone,
        false,
        userPublicProfile.name || userProfile.name || "Frendle User"
      );
    }

    // 8. Update user's last_matched timestamp
    await supabase
      .from("system_profiles")
      .update({ last_matched: new Date().toISOString() })
      .eq("id", userId);

    return createSuccessResponse({
      message: `Successfully created ${createdSessions.length} session(s)`,
      sessions: createdSessions,
    });
  } catch (error) {
    console.error("Error in matchCurrentUser:", error);
    return createErrorResponse(String(error), 500);
  }
};
