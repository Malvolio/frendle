// shared/
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  format,
  utcToZonedTime,
  zonedTimeToUtc,
} from "https://esm.sh/date-fns-tz@2";
import { addDays, addHours } from "https://esm.sh/date-fns@2";
import {
  MIN_FUTURE_HOURS,
  RESEND_API_KEY,
  SESSION_LINK_BASE,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "./constants.ts";
import type { PrivateProfile, SystemProfile, TimeSlot } from "./types.ts";

export const createSupabaseClient = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase configuration");
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

export const createErrorResponse = (
  message: string,
  status = 400
): Response => {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const createSuccessResponse = <T>(data: T): Response => {
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const validateUser = async (supabase: any): Promise<string> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authentication required");
  }

  return user.id;
};

export const getUserProfile = async (
  supabase: any,
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
  supabase: any,
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

export const convertHourOfWeekToTimestamp = (
  hourOfWeek: number,
  timezone: string
): Date[] => {
  const now = new Date();
  const nextWeek = addDays(now, 7);
  const timestamps: Date[] = [];

  // Calculate the next occurrence of this hour in the week
  const dayOfWeek = Math.floor(hourOfWeek / 24);
  const hourOfDay = hourOfWeek % 24;

  // Check this week and next week for valid timestamps
  for (let week = 0; week < 2; week++) {
    const baseDate = week === 0 ? now : nextWeek;
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() - targetDate.getDay() + dayOfWeek);
    targetDate.setHours(hourOfDay, 0, 0, 0);

    // Convert from user's timezone to UTC
    const utcTimestamp = zonedTimeToUtc(targetDate, timezone);

    // Only include if it's at least 24 hours in the future
    if (utcTimestamp > addHours(now, MIN_FUTURE_HOURS)) {
      timestamps.push(utcTimestamp);
    }
  }

  return timestamps;
};

export const findOverlappingSlots = (
  hostAvailability: number[],
  guestAvailability: number[],
  hostTimezone: string,
  guestTimezone: string
): TimeSlot[] => {
  const overlaps = hostAvailability.filter((hour) =>
    guestAvailability.includes(hour)
  );
  const slots: TimeSlot[] = [];

  for (const hour of overlaps) {
    const hostTimestamps = convertHourOfWeekToTimestamp(hour, hostTimezone);
    const guestTimestamps = convertHourOfWeekToTimestamp(hour, guestTimezone);

    // Find matching timestamps (should be the same in UTC)
    for (const hostTime of hostTimestamps) {
      for (const guestTime of guestTimestamps) {
        if (Math.abs(hostTime.getTime() - guestTime.getTime()) < 60000) {
          // Within 1 minute
          slots.push({ timestamp: hostTime, hour_of_week: hour });
        }
      }
    }
  }

  return slots.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const generateSessionLink = (
  sessionId: string,
  isHost: boolean
): string => {
  return `${SESSION_LINK_BASE}?id=${sessionId}&host=${isHost}`;
};

export const formatDateForEmail = (date: Date, timezone: string): string => {
  const zonedDate = utcToZonedTime(date, timezone);
  return format(zonedDate, "EEEE, MMMM do, yyyy 'at' h:mm a zzz", {
    timeZone: timezone,
  });
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
  icsAttachment?: string
): Promise<void> => {
  if (!RESEND_API_KEY) {
    throw new Error("Resend API key not configured");
  }

  const emailData: any = {
    from: "noreply@frendle.space",
    to,
    subject,
    text,
  };

  if (icsAttachment) {
    emailData.attachments = [
      {
        filename: "session.ics",
        content: btoa(icsAttachment),
        content_type: "text/calendar",
      },
    ];
  }

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
