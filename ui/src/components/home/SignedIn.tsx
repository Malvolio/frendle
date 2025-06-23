import { useAuth } from "@/providers/auth-provider";
import { SignedInUser } from "@/types";
import { FC, PropsWithChildren } from "react";
import { PublicLayout } from "../layout/public-layout";
import BannedHome from "./BannedHome";
import GoodHome from "./GoodHome";
import PausedHome from "./PausedHome";
import SuspendedHome from "./SuspendedHome";
import UnpaidHome from "./UnpaidHome";

const ThickBorderShadowDiv: FC<PropsWithChildren> = ({ children }) => (
  <div
    className="border-4 border-black rounded-lg p-6 bg-white"
    style={{ boxShadow: "8px 8px 0px 0px black" }}
  >
    {children}
  </div>
);

const Components: Record<
  NonNullable<SignedInUser["system_profile"]["membership_status"]>,
  FC
> = {
  unpaid: UnpaidHome,
  good: GoodHome,
  suspended: SuspendedHome,
  banned: BannedHome,
  paused: PausedHome,
};
const SignedIn = () => {
  const { user } = useAuth();
  const Component =
    Components[user?.system_profile.membership_status || "unpaid"] ||
    (() => <div>Unknown membership status</div>);

  return (
    <PublicLayout>
      <h1 className="w-3/4 mx-auto font-bold text-3xl font-peachy">
        Hey, {user?.public_profile.name}!
      </h1>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ThickBorderShadowDiv>
          <h1 className="text-3xl font-bold text-gray-900 font-peachy">
            Pair-ups
          </h1>
          <Component />
        </ThickBorderShadowDiv>
      </div>
    </PublicLayout>
  );
};

export default SignedIn;
