import { formatDateForEmail } from "./utils.ts";

export interface EmailTemplateData {
  sessionId: string;
  scheduledFor: Date;
  hostName: string;
  guestName: string;
  timezone: string;
  sessionLink: string;
}

export const createSessionScheduledEmail = (
  data: EmailTemplateData,
  isHost: boolean
): string => {
  const partnerName = isHost ? data.guestName : data.hostName;
  const role = isHost ? "host" : "participant";

  return `Hello!

You have a new Frendle language exchange session scheduled!

Session Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time: ${formatDateForEmail(data.scheduledFor, data.timezone)}
Your Partner: ${partnerName}
Your Role: Session ${role}

Session Link: ${data.sessionLink}

What's Next:
1. Click the session link above to confirm your attendance
2. Add this session to your calendar (see attached .ics file)
3. Prepare for your language exchange!

Tips for a Great Session:
• Test your audio/video setup beforehand
• Prepare some conversation topics
• Be patient and encouraging with your partner
• Have fun learning together!

Questions? Reply to this email or visit our help center.

Happy learning!
The Frendle Team

---
This email was sent because you have an active Frendle account. 
Manage your preferences: https://demo.frendle.space/preferences`;
};

export const createSessionConfirmedEmail = (
  data: EmailTemplateData,
  confirmerName: string
): string => {
  return `Great news!

${confirmerName} has confirmed your upcoming Frendle session.

Session Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time: ${formatDateForEmail(data.scheduledFor, data.timezone)}
Partner: ${confirmerName}
Status: ✅ CONFIRMED

Your session is all set! Both participants have now confirmed their attendance.

Session Link: ${data.sessionLink}

Before Your Session:
• Set a reminder 15 minutes before the session starts
• Test your internet connection and audio/video
• Think about what you'd like to practice or discuss
• Review any notes from previous sessions

We're excited for your language exchange!

Best regards,
The Frendle Team`;
};

export const createSessionCancelledEmail = (
  data: EmailTemplateData,
  cancellerName: string,
  isCanceller: boolean
): string => {
  if (isCanceller) {
    return `Session Cancellation Confirmed

You have successfully cancelled your Frendle session.

Cancelled Session Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time: ${formatDateForEmail(data.scheduledFor, data.timezone)}
Partner: ${data.guestName}
Status: ❌ CANCELLED

Don't worry! Here's what happens next:

✓ Your partner has been notified of the cancellation
✓ You're eligible for new session matching immediately
✓ No penalty applied to your account
✓ We'll help you find another great partner

Want to schedule a replacement session? Visit your dashboard or simply wait - our matching system will automatically find you compatible partners.

The Frendle Team`;
  } else {
    return `Session Cancelled by Partner

Your upcoming Frendle session has been cancelled by ${cancellerName}.

Cancelled Session Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time: ${formatDateForEmail(data.scheduledFor, data.timezone)}
Partner: ${cancellerName}
Status: ❌ CANCELLED

We understand this might be disappointing, but don't worry!

What's Next:
✓ You're immediately eligible for new session matching
✓ Our system will automatically find you new compatible partners
✓ No action needed on your part - just wait for your next match
✓ We'll prioritize finding you a replacement session

These things happen, and we're here to ensure you have great language exchange experiences.

The Frendle Team`;
  }
};

export const createRatingReminderEmail = (data: EmailTemplateData): string => {
  return `How was your session?

We hope you had a great Frendle language exchange session!

Session Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${formatDateForEmail(data.scheduledFor, data.timezone)}
Partner: ${data.hostName === data.guestName ? "Your partner" : data.hostName + " / " + data.guestName}

Please take a moment to rate your experience:

Rate Your Session: ${data.sessionLink}/rate

Your Rating Options:
• 2 stars - Great session! I'd love to meet this partner again
• 1 star - Good session, I'm open to meeting again
• 0 stars - Not a great fit, I'd prefer different partners

Your feedback helps us:
✓ Improve our matching algorithm
✓ Ensure quality experiences for all users
✓ Connect you with the best possible partners

Optional: Set a pause period if you need a break from matching with this partner.

Thank you for being part of the Frendle community!

The Frendle Team`;
};

// shared/validators.ts
export const validateSessionId = (sessionId: unknown): string => {
  if (typeof sessionId !== "string" || !sessionId.trim()) {
    throw new Error("Session ID must be a non-empty string");
  }

  // Basic UUID format validation
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(sessionId)) {
    throw new Error("Session ID must be a valid UUID");
  }

  return sessionId;
};

export const validateRating = (rating: unknown): number => {
  if (typeof rating !== "number" || !Number.isInteger(rating)) {
    throw new Error("Rating must be an integer");
  }

  if (![0, 1, 2].includes(rating)) {
    throw new Error("Rating must be 0, 1, or 2");
  }

  return rating;
};

export const validatePauseDate = (pauseUntil: unknown): Date => {
  if (!pauseUntil) {
    throw new Error("Pause date is required");
  }

  const date = new Date(pauseUntil as string);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid pause date format");
  }

  if (date <= new Date()) {
    throw new Error("Pause date must be in the future");
  }

  return date;
};

export const validateMembershipStatus = (status: string): boolean => {
  return status === "good";
};

export const validateTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};
