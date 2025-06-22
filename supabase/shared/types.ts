import { Database } from "./supabase.ts";

export type SystemProfile =
  Database["public"]["Tables"]["system_profiles"]["Row"];

export type PrivateProfile =
  Database["public"]["Tables"]["private_profiles"]["Row"];

export type Session = Database["public"]["Tables"]["sessions"]["Row"];

export type Relationship = Database["public"]["Tables"]["relationships"]["Row"];

export type Timezone = Database["public"]["Tables"]["timezones"]["Row"];

export interface MatchCandidate {
  id: string;
  name: string;
  timezone: string;
  offset_hours: number;
  availabilities: number[];
}

export interface TimeSlot {
  timestamp: Date;
  hour_of_week: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
