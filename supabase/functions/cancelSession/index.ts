//
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  createErrorResponse,
  createSuccessResponse,
  createSupabaseClient,
  formatDateForEmail,
  generateICSInvite,
  sendEmail,
  validateUser,
} from "../shared/utils.ts";

const cancelSession = async (sessionId: string): Promise<Response> => {
  const supabase = createSupabaseClient();

  try {
    // Get authenticated user ID
    const userId = await validateUser(supabase);

    // Get session details with participant information
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
    if (session.session_status !== "scheduled") {
      return createErrorResponse("Session is not in scheduled status");
    }

    if (new Date(session.scheduled_for) <= new Date()) {
      return createErrorResponse("Cannot cancel past sessions");
    }

    if (session.host_id !== userId && session.guest_id !== userId) {
      return createErrorResponse("User is not a participant in this session");
    }

    const isHost = session.host_id === userId;
    const newStatus = isHost ? "cancelled_by_host" : "cancelled_by_guest";

    // Update session status to cancelled
    const { error: updateError } = await supabase
      .from("sessions")
      .update({ session_status: newStatus })
      .eq("id", sessionId);

    if (updateError) {
      throw new Error("Failed to update session status");
    }

    // Reset last_matched to NULL for both users to enable re-matching
    const { error: resetHostError } = await supabase
      .from("system_profiles")
      .update({ last_matched: null })
      .eq("id", session.host_id);

    const { error: resetGuestError } = await supabase
      .from("system_profiles")
      .update({ last_matched: null })
      .eq("id", session.guest_id);

    if (resetHostError || resetGuestError) {
      console.error("Failed to reset last_matched timestamps");
    }

    // Send notification emails to both participants
    try {
      const cancellerName = isHost ? session.host.name : session.guest.name;
      const otherParticipant = isHost ? session.guest : session.host;

      // Get timezone information for both participants
      const { data: profiles } = await supabase
        .from("private_profiles")
        .select("id, timezone")
        .in("id", [session.host_id, session.guest_id]);

      const hostTimezone =
        profiles?.find((p) => p.id === session.host_id)?.timezone || "UTC";
      const guestTimezone =
        profiles?.find((p) => p.id === session.guest_id)?.timezone || "UTC";

      // Generate ICS cancellation
      const icsCancellation = generateICSInvite(
        session.id,
        new Date(session.scheduled_for),
        session.host.name,
        session.guest.name,
        isHost
      ).replace("STATUS:CONFIRMED", "STATUS:CANCELLED\nMETHOD:CANCEL");

      // Email to the person who cancelled
      const cancellerEmailText = `You have successfully cancelled your Frendle session.

Cancelled Session Details:
Date: ${formatDateForEmail(
        new Date(session.scheduled_for),
        isHost ? hostTimezone : guestTimezone
      )}
Partner: ${otherParticipant.name}

Don't worry - we'll help you find another session soon!`;

      // Email to the other participant
      const otherParticipantEmailText = `Your Frendle session has been cancelled by ${cancellerName}.

Cancelled Session Details:
Date: ${formatDateForEmail(
        new Date(session.scheduled_for),
        isHost ? guestTimezone : hostTimezone
      )}
Partner: ${cancellerName}

Don't worry - we'll help you find another session soon!`;

      await Promise.all([
        sendEmail(
          `${userId}@example.com`, // TODO: Get actual email from profile
          "Session Cancelled - Frendle",
          cancellerEmailText,
          icsCancellation
        ),
        sendEmail(
          `${otherParticipant.id}@example.com`, // TODO: Get actual email from profile
          "Session Cancelled - Frendle",
          otherParticipantEmailText,
          icsCancellation
        ),
      ]);
    } catch (emailError) {
      console.error("Failed to send cancellation emails:", emailError);
    }

    // Trigger re-matching for both participants
    try {
      const matchFunction = await import("./matchCurrentUser.ts");

      // Note: In a real implementation, you might want to queue these or call them asynchronously
      // For now, we'll just reset the last_matched timestamp which allows them to be matched again
      console.log("Both users are now eligible for re-matching");
    } catch (matchError) {
      console.error("Failed to trigger re-matching:", matchError);
    }

    return createSuccessResponse({
      message: "Session cancelled successfully",
      sessionId: sessionId,
      cancelledBy: isHost ? "host" : "guest",
      cancelledAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in cancelSession:", error);
    return createErrorResponse(error.message || "Internal server error", 500);
  }
};

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", 405);
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return createErrorResponse("Session ID is required");
    }

    return await cancelSession(sessionId);
  } catch (error) {
    return createErrorResponse("Invalid request body");
  }
});
