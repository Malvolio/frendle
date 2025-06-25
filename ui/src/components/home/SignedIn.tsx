import AvailabilityPage from "@/components/home/availability";
import Inventory from "@/components/home/inventory";
import PairUpTab from "@/components/home/PairUpTab";
import { ProfileForm } from "@/components/home/profile-form";
import TabSet, { TabDescription } from "@/components/TabSet";
import { useAuth } from "@/providers/auth-provider";
import { SignedInUser } from "@/types";
import { keys } from "lodash-es";
import { Calendar1, ListChecks, User, Users } from "lucide-react";
import { FC } from "react";
import { PublicLayout } from "../layout/public-layout";
import Unready from "../Unready";
import { AvailabilityProvider, useAvailability } from "./AvailabilityProvider";
import BannedHome from "./BannedHome";
import { InterestsProvider, useProfileInterests } from "./InterestsProvider";
import SuspendedHome from "./SuspendedHome";

const Profile = () => {
  const { data: availabilities } = useAvailability();
  const { data: interests } = useProfileInterests();
  const availabilityTodo = !availabilities?.size;
  const inventoryTodo = !keys(interests ?? {}).length;
  const ProfileTabs: TabDescription[] = [
    { id: "pairups", name: "Pair-ups", icon: Users, body: PairUpTab },
    { id: "profile", name: "About you", icon: User, body: ProfileForm },
    {
      id: "availability",
      name: "Availability",
      icon: Calendar1,
      body: AvailabilityPage,
      todo: availabilityTodo,
    },
    {
      id: "inventory",
      name: "Interests",
      icon: ListChecks,
      body: Inventory,
      todo: inventoryTodo,
    },
  ];
  return <TabSet tabs={ProfileTabs} />;
};
const Components: Record<
  NonNullable<SignedInUser["system_profile"]["membership_status"]> | "unready",
  FC
> = {
  unpaid: Profile,
  good: Profile,
  suspended: SuspendedHome,
  banned: BannedHome,
  paused: Profile,
  unready: Unready,
};

const SignedIn = () => {
  const { user } = useAuth();
  const userId = user?.auth.id || "";
  const Component =
    Components[user?.system_profile.membership_status || "unpaid"] || Unready;

  return (
    <PublicLayout>
      <AvailabilityProvider userId={userId}>
        <InterestsProvider userId={userId}>
          <Component />
        </InterestsProvider>
      </AvailabilityProvider>
    </PublicLayout>
  );
};

export default SignedIn;
