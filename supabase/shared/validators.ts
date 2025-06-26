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
