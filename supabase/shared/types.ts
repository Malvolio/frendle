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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
