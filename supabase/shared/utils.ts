// shared/
import { TZDate } from "https://esm.sh/@date-fns/tz@1.2.0";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import { addHours, format } from "https://esm.sh/date-fns@4.1.0";
import { flatMap } from "https://esm.sh/lodash@4.17.21";
import {
  RESEND_API_KEY,
  SESSION_LINK_BASE,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "./constants.ts";
import { Database } from "./supabase.ts";
import type { PrivateProfile, PublicProfile, SystemProfile } from "./types.ts";

const CorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const StdHeaders = {
  "Content-Type": "application/json",
  ...CorsHeaders,
};

export const createCorsResponse = () =>
  new Response("ok", {
    headers: CorsHeaders,
  });

export const createSupabaseClient = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase configuration");
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const createErrorResponse = (
  message: string,
  status = 400
): Response => {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: StdHeaders,
  });
};

export const createSuccessResponse = <T>(data: T): Response => {
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: StdHeaders,
  });
};

export const validateUser = async (
  supabase: SupabaseClient<Database>,
  req: Request
): Promise<string> => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    console.error("User validation failed: No Authorization header");
    throw new Error("Authentication required");
  }
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

  if (error || !user) {
    console.error("User validation failed:", error);
    throw new Error("Authentication required");
  }

  return user.id;
};

export const getUserProfile = async (
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<SystemProfile> => {
  const { data, error } = await supabase
    .from("system_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("User profile not found");
  }

  return data;
};

export const getPrivateProfile = async (
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<PrivateProfile> => {
  const { data, error } = await supabase
    .from("private_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Private profile not found");
  }

  return data;
};

export const getPublicProfile = async (
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<PublicProfile> => {
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Public profile not found");
  }

  return data;
};

export const findOverlappingSlots = (
  hostAvailability: number[],
  guestAvailability: number[],
  hostTimezone: string,
  guestTimezone: string,
  now: Date
): Date[] => {
  // Convert availabilities to actual dates
  const hostDates = hostAvailability.map((hour) =>
    convertHourOfWeekToDate(hour, hostTimezone, now)
  );
  const guestDates = guestAvailability.map((hour) =>
    convertHourOfWeekToDate(hour, guestTimezone, now)
  );

  // Find overlapping times (within 30 minutes)
  return flatMap(hostDates, (hostTime) =>
    guestDates
      .map((guestTime) => {
        const timeDiff = Math.abs(hostTime.getTime() - guestTime.getTime());
        if (timeDiff <= 30 * 60 * 1000) {
          // 30 minutes in milliseconds
          // Use the later of the two times
          return hostTime.getTime() > guestTime.getTime()
            ? hostTime
            : guestTime;
        }
        return null;
      })
      .filter((slot) => slot !== null)
  );
};

const convertHourOfWeekToDate = (
  hourOfWeek: number,
  timezone: string,
  now: Date
): Date => {
  const dayOfWeek = Math.floor(hourOfWeek / 24); // 0 = Sunday, 1 = Monday, etc.
  const hourOfDay = hourOfWeek % 24;
  const nowInTimezone = new TZDate(now, timezone);
  const currentDay = nowInTimezone.getDay();

  const daysToAdd =
    dayOfWeek === currentDay
      ? 7
      : dayOfWeek > currentDay
      ? // Target day is later this week
        dayOfWeek - currentDay
      : 7 + dayOfWeek - currentDay;

  const targetDate = new Date(nowInTimezone);
  targetDate.setDate(targetDate.getDate() + daysToAdd);

  return new TZDate(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    hourOfDay,
    0, // minutes
    0, // seconds
    timezone
  );
};
export const generateSessionLink = (
  sessionId: string,
  isHost: boolean
): string => {
  return `${SESSION_LINK_BASE}?id=${sessionId}&host=${isHost}`;
};

export const formatDateForEmail = (date: Date, timezone: string): string => {
  const zonedDate = new TZDate(date, timezone);
  return format(zonedDate, "EEEE, MMMM do, yyyy 'at' h:mm a zzz");
};

export const generateICSInvite = (
  sessionId: string,
  startTime: Date,
  hostName: string,
  guestName: string,
  isHost: boolean
): string => {
  const endTime = addHours(startTime, 1);
  const formatICSDate = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Frendle//Session Scheduler//EN
BEGIN:VEVENT
UID:session-${sessionId}@frendle.space
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startTime)}
DTEND:${formatICSDate(endTime)}
SUMMARY:Frendle Session with ${isHost ? guestName : hostName}
DESCRIPTION:Your Frendle language exchange session
LOCATION:${generateSessionLink(sessionId, isHost)}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
};

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string = "",
  icsAttachment?: string
): Promise<void> => {
  if (!RESEND_API_KEY) {
    throw new Error("Resend API key not configured");
  }

  const emailData = {
    from: "noreply@frendle.space",
    to,
    subject,
    text,
    html,
    attachments: icsAttachment
      ? [
          {
            filename: "frendle-pairup.ics",
            content: btoa(icsAttachment),
            content_type: "text/calendar",
          },
        ]
      : undefined,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }
};
