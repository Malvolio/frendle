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

    const { shouldPause } = await req.json();

    if (typeof shouldPause !== "boolean") {
      return createErrorResponse("shouldPause must be a boolean", 401);
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

    const newStatus = shouldPause ? "paused" : "good";
    const validCurrentStatus = !shouldPause ? "paused" : "good";

    // Check if current status allows the transition
    if (profile.membership_status !== validCurrentStatus) {
      const action = shouldPause ? "pause" : "unpause";

      return createErrorResponse(
        `Cannot ${action}: membership status is '${profile.membership_status}', expected '${validCurrentStatus}'`,
        400
      );
    }

    const rv = await supabase
      .from("system_profiles")
      .update({ membership_status: newStatus })
      .eq("id", userId);
    console.log("Membership update result:", JSON.stringify(rv, null, 2));
    const { error: updateError } = rv;
    if (updateError) {
      return createErrorResponse("Failed to update membership status", 500);
    }

    return createSuccessResponse({
      success: true,
      message: `Membership ${shouldPause ? "paused" : "unpaused"} successfully`,
      previousStatus: validCurrentStatus,
      newStatus: newStatus,
    });
  } catch (error) {
    console.error(error);
    return createErrorResponse(`Error processing request: ${error}`, 500);
  }
});
