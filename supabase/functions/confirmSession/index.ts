// functions/confirmSession/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  createErrorResponse,
  createSuccessResponse,
  createSupabaseClient,
  formatDateForEmail,
  sendEmail,
  validateUser,
} from "../shared/utils.ts";

const confirmSession = async (sessionId: string): Promise<Response> => {
  const supabase = createSupabaseClient();

  try {
    // Get authenticated user ID
    const userId = await validateUser(supabase);

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
    if (session.session_status !== "scheduled") {
      return createErrorResponse("Session is not in scheduled status");
    }

    if (new Date(session.scheduled_for) <= new Date()) {
      return createErrorResponse("Cannot confirm past sessions");
    }

    if (session.host_id !== userId && session.guest_id !== userId) {
      return createErrorResponse("User is not a participant in this session");
    }

    const isHost = session.host_id === userId;
    const confirmationField = isHost ? "host_confirmed" : "guest_confirmed";
    const existingConfirmation = isHost
      ? session.host_confirmed
      : session.guest_confirmed;

    if (existingConfirmation) {
      return createErrorResponse("User has already confirmed this session");
    }

    // Update confirmation timestamp
    const { error: updateError } = await supabase
      .from("sessions")
      .update({ [confirmationField]: new Date().toISOString() })
      .eq("id", sessionId);

    if (updateError) {
      throw new Error("Failed to update session confirmation");
    }

    // Send notification email to other participant
    try {
      const otherParticipant = isHost ? session.guest : session.host;
      const confirmerName = isHost ? session.host.name : session.guest.name;

      // Get other participant's timezone for proper date formatting
      const { data: otherProfile } = await supabase
        .from("private_profiles")
        .select("timezone")
        .eq("id", otherParticipant.id)
        .single();

      const timezone = otherProfile?.timezone || "UTC";

      const emailText = `Good news! ${confirmerName} has confirmed your upcoming Frendle session.

Session Details:
Date: ${formatDateForEmail(new Date(session.scheduled_for), timezone)}
Partner: ${confirmerName}

Your session is now confirmed. We look forward to your language exchange!`;

      await sendEmail(
        `${otherParticipant.id}@example.com`, // TODO: Get actual email from profile
        "Session Confirmed - Frendle",
        emailText
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return createSuccessResponse({
      message: "Session confirmed successfully",
      sessionId: sessionId,
      confirmedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in confirmSession:", error);
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

    return await confirmSession(sessionId);
  } catch (error) {
    return createErrorResponse("Invalid request body");
  }
});
