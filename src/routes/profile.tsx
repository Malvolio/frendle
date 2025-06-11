import { AuthLayout } from "@/components/layout/auth-layout";
import AvailabilityPage from "@/components/profile/availability";
import { CharitySelection } from "@/components/profile/charity-selection";
import Inventory from "@/components/profile/inventory";
import { MembershipSection } from "@/components/profile/membership-section";
import { ProfileForm } from "@/components/profile/profile-form";
import TabSet from "@/components/TabSet";
import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  Calendar1,
  HeartHandshake,
  ListChecks,
  User,
} from "lucide-react";
const ProfileTabs = [
  { id: "profile", name: "About you", icon: User, body: ProfileForm },

  {
    id: "membership",
    name: "Membership",
    icon: BadgeCheck,
    body: MembershipSection,
  },
  {
    id: "inventory",
    name: "Personality",
    icon: ListChecks,
    body: Inventory,
  },
  {
    id: "availability",
    name: "Availability",
    icon: Calendar1,
    body: AvailabilityPage,
  },
  {
    id: "charity",
    name: "Charity",
    icon: HeartHandshake,
    body: CharitySelection,
  },
];

export const Route = createFileRoute("/profile")({
  component: () => (
    <AuthLayout title="My Profile">
      <TabSet tabs={ProfileTabs} />
    </AuthLayout>
  ),
});
