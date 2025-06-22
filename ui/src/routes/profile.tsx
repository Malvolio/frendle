import { AuthLayout } from "@/components/layout/auth-layout";
import AvailabilityPage from "@/components/profile/availability";
import Inventory from "@/components/profile/inventory";
import { ProfileForm } from "@/components/profile/profile-form";
import TabSet from "@/components/TabSet";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar1, ListChecks, User } from "lucide-react";
const ProfileTabs = [
  { id: "profile", name: "About you", icon: User, body: ProfileForm },
  {
    id: "inventory",
    name: "Interests",
    icon: ListChecks,
    body: Inventory,
  },
  {
    id: "availability",
    name: "Availability",
    icon: Calendar1,
    body: AvailabilityPage,
  },
];

export const Route = createFileRoute("/profile")({
  component: () => (
    <AuthLayout title="My Profile">
      <TabSet tabs={ProfileTabs} />
    </AuthLayout>
  ),
});
