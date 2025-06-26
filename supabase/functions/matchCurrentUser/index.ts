import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { matchUser } from "../../shared/match.ts";
import {
  createErrorResponse,
  createSupabaseClient,
  validateUser,
} from "../../shared/utils.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", 405);
  }

  return await matchCurrentUser(req);
});

const matchCurrentUser = async (req: Request): Promise<Response> => {
  const supabase = createSupabaseClient();
  const userId = await validateUser(supabase, req);
  return matchUser(supabase, userId);
};
