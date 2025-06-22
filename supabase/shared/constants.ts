export const MAX_SESSIONS = parseInt(Deno.env.get("MAX_SESSIONS") || "3");
export const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
export const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
export const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

export const SESSION_LINK_BASE = "https://demo.frendle.space/session";
export const HOURS_PER_WEEK = 168;
export const MIN_FUTURE_HOURS = 24;
