import { User } from "@supabase/supabase-js";
import { Database } from "./supabase";

export type SystemProfile =
  Database["public"]["Tables"]["system_profiles"]["Row"];
export type PrivateProfile =
  Database["public"]["Tables"]["private_profiles"]["Row"];
export type PublicProfile =
  Database["public"]["Tables"]["public_profiles"]["Row"];

export type SignedInUser = {
  auth: User;
  system_profile: SystemProfile;
  private_profile: PrivateProfile;
  public_profile: PublicProfile;
};

export interface Charity {
  id: string;
  name: string;
  description: string;
  website: string;
  logoUrl?: string;
  category: string;
}

export interface Subscription {
  id: string;
  status: "active" | "canceled" | "incomplete" | "past_due" | "trialing";
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface NavItem {
  title: string;
  href: string;
  requiresAuth?: boolean;
}
