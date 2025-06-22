//
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MAX_SESSIONS } from "./constants.ts";
import { Database } from "./supabase.ts";
import type { MatchCandidate, Session, TimeSlot } from "./types.ts";
import {
  createErrorResponse,
  createSuccessResponse,
  findOverlappingSlots,
  formatDateForEmail,
  generateICSInvite,
  generateSessionLink,
  getPrivateProfile,
  getUserProfile,
  sendEmail,
} from "./utils.ts";

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
    const { data: futureSessions, error: sessionError } = await supabase
      .from("sessions")
      .select("id")
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .eq("session_status", "scheduled")
      .gte("scheduled_for", new Date().toISOString());

    if (sessionError) {
      throw new Error("Failed to count existing sessions");
    }

    if (futureSessions.length >= MAX_SESSIONS) {
      return createErrorResponse(
        `Maximum of ${MAX_SESSIONS} future sessions allowed`
      );
    }

    // Get user's private profile and availability
    const userPrivateProfile = await getPrivateProfile(supabase, userId);

    const { data: userAvailability, error: availError } = await supabase
      .from("availabilities")
      .select("hour_of_week")
      .eq("user_id", userId);

    if (availError || !userAvailability?.length) {
      return createErrorResponse("User availability not found");
    }

    // 4. Query potential matches using coarse filtering
    const { data: candidates, error: candidateError } = await supabase
      .from("system_profiles")
      .select(
        `
        id,
        name,
        private_profiles!inner(timezone),
        timezones!inner(offset_hours),
        availabilities(hour_of_week)
      `
      )
      .eq("membership_status", "good")
      .neq("id", userId)
      .overlaps(
        "availabilities.hour_of_week",
        userAvailability.map((a) => a.hour_of_week)
      );

    if (candidateError) {
      throw new Error("Failed to query potential matches");
    }

    if (!candidates?.length) {
      return createErrorResponse("No potential matches found");
    }

    // Filter out users with active pauses and existing relationships
    const { data: relationships, error: relError } = await supabase
      .from("relationships")
      .select("host_id, guest_id, paused")
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .or("paused.is.null,paused.lt." + new Date().toISOString());

    if (relError) {
      throw new Error("Failed to check relationships");
    }

    const pausedUserIds = new Set(
      relationships
        ?.filter((r) => r.paused && new Date(r.paused) > new Date())
        ?.map((r) => (r.host_id === userId ? r.guest_id : r.host_id)) || []
    );

    // 5. Apply fine filtering with proper timezone conversion
    const validMatches: Array<{
      candidate: MatchCandidate;
      slots: TimeSlot[];
    }> = [];

    for (const candidate of candidates) {
      if (pausedUserIds.has(candidate.id)) continue;

      // Check if candidate has too many sessions
      const { data: candidateSessions } = await supabase
        .from("sessions")
        .select("id")
        .or(`host_id.eq.${candidate.id},guest_id.eq.${candidate.id}`)
        .eq("session_status", "scheduled")
        .gte("scheduled_for", new Date().toISOString());

      if (candidateSessions && candidateSessions.length >= MAX_SESSIONS)
        continue;

      const candidateAvailability =
        candidate.availabilities?.map((a) => a.hour_of_week) || [];
      const userAvailabilityHours = userAvailability.map((a) => a.hour_of_week);

      const overlappingSlots = findOverlappingSlots(
        userAvailabilityHours,
        candidateAvailability,
        userPrivateProfile.timezone ?? "UTC",
        candidate.private_profiles.timezone ?? "UTC"
      );

      if (overlappingSlots.length > 0) {
        validMatches.push({
          candidate: {
            id: candidate.id,
            name: candidate.name ?? "[unknown]",
            timezone: candidate.private_profiles.timezone ?? "UTC",
            offset_hours: candidate.timezones[0].offset_hours || 0,
            availabilities: candidateAvailability,
          },
          slots: overlappingSlots,
        });
      }
    }

    if (validMatches.length === 0) {
      return createErrorResponse("No compatible matches found");
    }

    // 6. Create new sessions and relationship records
    const createdSessions: Session[] = [];

    for (const match of validMatches.slice(
      0,
      MAX_SESSIONS - futureSessions.length
    )) {
      const selectedSlot = match.slots[0]; // Take the first available slot

      const { data: session, error: sessionCreateError } = await supabase
        .from("sessions")
        .insert({
          scheduled_for: selectedSlot.timestamp.toISOString(),
          host_id: userId,
          guest_id: match.candidate.id,
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
          guest_id: match.candidate.id,
        });

      if (relationshipError) {
        console.error("Failed to create relationship:", relationshipError);
      }

      createdSessions.push(session);

      // 7. Send notification emails
      try {
        const hostLink = generateSessionLink(session.id, true);
        const guestLink = generateSessionLink(session.id, false);

        const hostEmailText = `You have a new Frendle session scheduled!

Session Details:
Date: ${formatDateForEmail(
          new Date(session.scheduled_for),
          userPrivateProfile.timezone ?? "UTC"
        )}
Partner: ${match.candidate.name}

Your session link: ${hostLink}

Please confirm your attendance by clicking the link above.`;

        const guestEmailText = `You have a new Frendle session scheduled!

Session Details:  
Date: ${formatDateForEmail(
          new Date(session.scheduled_for),
          match.candidate.timezone
        )}
Partner: ${userProfile.name}

Your session link: ${guestLink}

Please confirm your attendance by clicking the link above.`;

        const hostICS = generateICSInvite(
          session.id,
          new Date(session.scheduled_for),
          userProfile.name || "[unknown]",
          match.candidate.name,
          true
        );

        const guestICS = generateICSInvite(
          session.id,
          new Date(session.scheduled_for),
          userProfile.name || "[unknown]",
          match.candidate.name,
          false
        );

        await sendEmail(
          `${userId}@example.com`, // TODO: Get actual email from profile
          "New Frendle Session Scheduled",
          hostEmailText,
          hostICS
        );

        await sendEmail(
          `${match.candidate.id}@example.com`, // TODO: Get actual email from profile
          "New Frendle Session Scheduled",
          guestEmailText,
          guestICS
        );
      } catch (emailError) {
        console.error("Failed to send emails:", emailError);
      }
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
