import AvailabilityPage from "@/components/home/availability";
import Inventory from "@/components/home/inventory";
import PairUpTab from "@/components/home/PairUpTab";
import { ProfileForm } from "@/components/home/profile-form";
import TabSet from "@/components/TabSet";
import { useAuth } from "@/providers/auth-provider";
import { SignedInUser } from "@/types";
import { Calendar1, ListChecks, User, Users } from "lucide-react";
import { FC } from "react";
import { PublicLayout } from "../layout/public-layout";
import Spinner from "../Spinner";
import BannedHome from "./BannedHome";
import SuspendedHome from "./SuspendedHome";

const Profile = () => <TabSet tabs={ProfileTabs} />;

const Components: Record<
  NonNullable<SignedInUser["system_profile"]["membership_status"]> | "unready",
  FC
> = {
  unpaid: Profile,
  good: Profile,
  suspended: SuspendedHome,
  banned: BannedHome,
  paused: Profile,
  unready: Spinner,
};

const ProfileTabs = [
  { id: "pairups", name: "Pair-ups", icon: Users, body: PairUpTab },
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
  const { user } = useAuth();
  const Component =
    Components[user?.system_profile.membership_status || "unpaid"] || Spinner;
  return (
    <PublicLayout>
      <Component />
    </PublicLayout>
  );
};

export default SignedIn;
