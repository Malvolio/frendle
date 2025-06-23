import AvailabilityPage from "@/components/home/availability";
import Inventory from "@/components/home/inventory";
import PairUpTab from "@/components/home/PairUpTab";
import { ProfileForm } from "@/components/home/profile-form";
import TabSet from "@/components/TabSet";
import { Calendar1, ListChecks, User, Users } from "lucide-react";
import { PublicLayout } from "../layout/public-layout";
const ProfileTabs = [
  { id: "pairups", name: "Pair-Ups", icon: Users, body: PairUpTab },
  { id: "profile", name: "About you", icon: User, body: ProfileForm },
  {
    id: "availability",
    name: "Availability",
    icon: Calendar1,
    body: AvailabilityPage,
  },
  {
    id: "inventory",
    name: "Interests",
    icon: ListChecks,
    body: Inventory,
  },
];
const SignedIn = () => {
  return (
    <PublicLayout>
      <TabSet tabs={ProfileTabs} />
    </PublicLayout>
  );
};

export default SignedIn;
