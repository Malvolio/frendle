import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import {
  createCorsResponse,
  createErrorResponse,
  createSuccessResponse,
  createSupabaseClient,
  validateUser,
} from "../../shared/utils.ts";
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return createCorsResponse();
  }

  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", 405);
  }
  try {
    const supabase = createSupabaseClient();
    const userId = await validateUser(supabase, req);

    if (!userId) {
      return createErrorResponse("Not signed in", 401);
    }

    // Get current membership status
    const { data: profile, error: fetchError } = await supabase
      .from("system_profiles")
      .select("membership_status")
      .eq("id", userId)
      .single();

    if (fetchError) {
      return createErrorResponse("User profile not found", 404);
    }

    // Check if current status allows the transition
    if (profile.membership_status !== "unpaid") {
      return createErrorResponse(
        `Cannot start free trial: membership status is '${profile.membership_status}', expected 'unpaid'`,
        400
      );
    }

    const { error: updateError } = await supabase
      .from("system_profiles")
      .update({ membership_status: "good" })
      .eq("id", userId);
    if (updateError) {
      return createErrorResponse("Failed to update membership status", 500);
    }

    return createSuccessResponse({
      success: true,
      message: `free trial started successfully`,
      previousStatus: "unpaid",
      newStatus: "good",
    });
  } catch (error) {
    console.error(error);
    return createErrorResponse(`Error processing request: ${error}`, 500);
  }
});
