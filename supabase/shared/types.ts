// shared/types.ts
export interface SystemProfile {
  id: string;
  name: string;
  membership_status: "unpaid" | "good" | "suspended" | "banned" | "paused";
  last_matched: string | null;
}

export interface PrivateProfile {
  id: string;
  timezone: string;
}

export interface Availability {
  user_id: string;
  hour_of_week: number;
}

export interface Session {
  id: string;
  scheduled_for: string;
  host_id: string;
  guest_id: string;
  host_confirmed: string | null;
  guest_confirmed: string | null;
  session_status:
    | "scheduled"
    | "cancelled_by_host"
    | "cancelled_by_guest"
    | "rated";
}

export interface Relationship {
  id: string;
  host_id: string;
  guest_id: string;
  rating: number | null;
  host_rating: number | null;
  guest_rating: number | null;
  paused: string | null;
  host_paused: string | null;
  guest_paused: string | null;
}

export interface Timezone {
  zone_name: string;
  offset_hours: number;
}

export interface MatchCandidate {
  id: string;
  name: string;
  timezone: string;
  offset_hours: number;
  availability: number[];
}

export interface TimeSlot {
  timestamp: Date;
  hour_of_week: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
