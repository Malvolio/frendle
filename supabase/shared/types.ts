import { Database } from "./supabase.ts";

export type SystemProfile =
  Database["public"]["Tables"]["system_profiles"]["Row"];

export type PublicProfile =
  Database["public"]["Tables"]["public_profiles"]["Row"];

export type PrivateProfile =
  Database["public"]["Tables"]["private_profiles"]["Row"];

export type Session = Database["public"]["Tables"]["sessions"]["Row"];

export type Relationship = Database["public"]["Tables"]["relationships"]["Row"];

export type Timezone = Database["public"]["Tables"]["timezones"]["Row"];

export type MemberStatus =
  Database["public"]["Enums"]["membership_status_enum"];

export type SessionStatus = Database["public"]["Enums"]["session_status_enum"];

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
