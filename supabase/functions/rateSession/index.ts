// functions/rateSession/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { addDays } from "https://esm.sh/date-fns@2";
import {
  createErrorResponse,
  createSuccessResponse,
  createSupabaseClient,
  validateUser,
} from "../../shared/utils";

const rateSession = async (
  sessionId: string,
  rating: number,
  pauseUntil?: Date
): Promise<Response> => {
  const supabase = createSupabaseClient();

  try {
    // Get authenticated user ID
    const userId = await validateUser(supabase);

    // Validate rating
    if (![0, 1, 2].includes(rating)) {
      return createErrorResponse("Rating must be 0, 1, or 2");
    }

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select(
        `
        *,
        host:system_profiles!host_id(id, name),
        guest:system_profiles!guest_id(id, name)
      `
      )
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return createErrorResponse("Session not found");
    }

    // Validation checks
    if (
      session.session_status === "cancelled_by_host" ||
      session.session_status === "cancelled_by_guest"
    ) {
      return createErrorResponse("Cannot rate cancelled sessions");
    }

    if (session.host_id !== userId && session.guest_id !== userId) {
      return createErrorResponse("User is not a participant in this session");
    }

    if (new Date(session.scheduled_for) >= new Date()) {
      return createErrorResponse("Cannot rate future sessions");
    }

    const isHost = session.host_id === userId;
    const otherUserId = isHost ? session.guest_id : session.host_id;

    // Get or create relationship record
    let { data: relationship, error: relationshipError } = await supabase
      .from("relationships")
      .select("*")
      .or(
        `and(host_id.eq.${session.host_id},guest_id.eq.${session.guest_id}),and(host_id.eq.${session.guest_id},guest_id.eq.${session.host_id})`
      )
      .single();

    if (relationshipError && relationshipError.code !== "PGRST116") {
      throw new Error("Failed to fetch relationship");
    }

    if (!relationship) {
      // Create new relationship if it doesn't exist
      const { data: newRelationship, error: createError } = await supabase
        .from("relationships")
        .insert({
          host_id: session.host_id,
          guest_id: session.guest_id,
        })
        .select()
        .single();

      if (createError) {
        throw new Error("Failed to create relationship");
      }

      relationship = newRelationship;
    }

    // Determine which rating field to update based on relationship structure
    const isRelationshipHost = relationship.host_id === userId;
    const userRatingField = isRelationshipHost ? "host_rating" : "guest_rating";
    const userPauseField = isRelationshipHost ? "host_paused" : "guest_paused";
    const otherRatingField = isRelationshipHost
      ? "guest_rating"
      : "host_rating";
    const otherPauseField = isRelationshipHost ? "guest_paused" : "host_paused";

    // Check if user has already rated this session
    if (relationship[userRatingField] !== null) {
      return createErrorResponse("User has already rated this session");
    }

    // Calculate pause date
    let pauseDate = pauseUntil ? pauseUntil.toISOString() : null;

    // Get all future sessions between these users to determine minimum pause date
    const { data: futureSessions } = await supabase
      .from("sessions")
      .select("scheduled_for")
      .or(
        `and(host_id.eq.${session.host_id},guest_id.eq.${session.guest_id}),and(host_id.eq.${session.guest_id},guest_id.eq.${session.host_id})`
      )
      .eq("session_status", "scheduled")
      .gt("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: false });

    const latestFutureSession = futureSessions?.[0];
    let minPauseDate = null;

    if (latestFutureSession) {
      minPauseDate = addDays(
        new Date(latestFutureSession.scheduled_for),
        1
      ).toISOString();
    }

    // Use the later of the user's pause date or the minimum pause date
    if (minPauseDate && (!pauseDate || minPauseDate > pauseDate)) {
      pauseDate = minPauseDate;
    }

    // Prepare update data
    const updateData: any = {
      [userRatingField]: rating,
    };

    if (pauseDate) {
      updateData[userPauseField] = pauseDate;
    }

    // Calculate overall relationship rating if both users have now rated
    const otherRating = relationship[otherRatingField];
    if (otherRating !== null) {
      // Both users have rated - calculate overall rating (product of ratings, treating null as 1)
      updateData.rating = rating * otherRating;
    }

    // Calculate relationship-level pause (maximum of both users' pause dates)
    const otherPauseDate = relationship[otherPauseField];
    let relationshipPauseDate = pauseDate;

    if (otherPauseDate) {
      if (!relationshipPauseDate || otherPauseDate > relationshipPauseDate) {
        relationshipPauseDate = otherPauseDate;
      }
    }

    if (relationshipPauseDate) {
      updateData.paused = relationshipPauseDate;
    }

    // Update relationship with rating and pause information
    const { error: updateError } = await supabase
      .from("relationships")
      .update(updateData)
      .eq("id", relationship.id);

    if (updateError) {
      throw new Error("Failed to update relationship rating");
    }

    // Update session status to 'rated' if both users have now rated
    if (otherRating !== null) {
      const { error: sessionUpdateError } = await supabase
        .from("sessions")
        .update({ session_status: "rated" })
        .eq("id", sessionId);

      if (sessionUpdateError) {
        console.error("Failed to update session status to rated");
      }
    }

    return createSuccessResponse({
      message: "Session rated successfully",
      sessionId: sessionId,
      rating: rating,
      pauseUntil: pauseDate,
      overallRating: updateData.rating || null,
      ratedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in rateSession:", error);
    return createErrorResponse(error.message || "Internal server error", 500);
  }
};

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", 405);
  }

  try {
    const { sessionId, rating, pauseUntil } = await req.json();

    if (!sessionId) {
      return createErrorResponse("Session ID is required");
    }

    if (rating === undefined || rating === null) {
      return createErrorResponse("Rating is required");
    }

    const pauseDate = pauseUntil ? new Date(pauseUntil) : undefined;

    return await rateSession(sessionId, rating, pauseDate);
  } catch (error) {
    return createErrorResponse("Invalid request body");
  }
});
