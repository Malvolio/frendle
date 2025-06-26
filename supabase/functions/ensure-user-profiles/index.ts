// supabase/functions/ensure-user-profiles/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import createWelcomeEmail from "../../shared/emailTemplates/welcome.ts";
import { sendEmail } from "../../shared/utils.ts";

// Type definitions
interface SystemProfile {
  id: string;
  name: string | null;
  membership_status: string | null;
  created_at: string;
}

interface PrivateProfile {
  id: string;
  timezone: string | null;
  created_at: string;
}

interface PublicProfile {
  id: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  selected_charity: string | null;
  created_at: string;
}

interface ProfilesResponse {
  system_profile: SystemProfile;
  private_profile: PrivateProfile;
  public_profile: PublicProfile;
}

// CORS configuration
const getAllowedOrigin = (origin: string | null): string => {
  if (origin?.startsWith("http://localhost:")) {
    return origin;
  }
  if (
    origin?.endsWith(".frendle.space") ||
    origin === "https://frendle.space"
  ) {
    return origin;
  }

  return "null";
};

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": getAllowedOrigin(origin),
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
});

// Generic function to ensure a profile exists
async function ensureProfile<T>(
  supabase: SupabaseClient,
  tableName: string,
  userId: string,
  defaultData: Record<string, unknown>
): Promise<T & { created?: boolean }> {
  // Try to get existing profile
  const { data: existingProfile, error: selectError } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", userId)
    .single();

  if (selectError && selectError.code === "PGRST116") {
    // Row doesn't exist, create it
    const { data: newProfile, error: insertError } = await supabase
      .from(tableName)
      .insert({ id: userId, ...defaultData })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create ${tableName}: ${insertError.message}`);
    }
    return { ...(newProfile as T), created: true };
  } else if (selectError) {
    throw new Error(`Failed to query ${tableName}: ${selectError.message}`);
  }
  return { ...(existingProfile as T), created: false };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create two clients: one for auth verification, one for database operations
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the authenticated user using the auth client
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId: string = user.id;

    // Default data for each profile type
    const systemDefaults = {
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || null,
      membership_status: "unpaid",
    };

    const privateDefaults = {
      timezone: "UTC",
    };

    const publicDefaults = {
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || null,
      bio: null,
      avatar_url: user.user_metadata?.avatar_url || null,
      selected_charity: null,
    };

    // Ensure profiles exist in the correct order due to foreign key constraints
    // system_profiles must be created first as it's referenced by the other two
    const { created, ...systemProfile } = await ensureProfile<SystemProfile>(
      serviceClient,
      "system_profiles",
      userId,
      systemDefaults
    );

    // private_profiles and public_profiles can be created concurrently since they both reference system_profiles
    const [
      { created: _, ...privateProfile },
      { created: __, ...publicProfile },
    ] = await Promise.all([
      ensureProfile<PrivateProfile>(
        serviceClient,
        "private_profiles",
        userId,
        privateDefaults
      ),
      ensureProfile<PublicProfile>(
        serviceClient,
        "public_profiles",
        userId,
        publicDefaults
      ),
    ]);

    // Return all three profiles
    const response: ProfilesResponse = {
      system_profile: systemProfile,
      private_profile: privateProfile,
      public_profile: publicProfile,
    };

    if (created && user.email) {
      const { subject, text, html } = createWelcomeEmail(systemProfile.name);
      await sendEmail(user.email, subject, text, html);
    }
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ensure-user-profiles function:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
