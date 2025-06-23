import { useAuth } from "@/providers/auth-provider";
import { FC, PropsWithChildren } from "react";
import GoodHome from "./GoodHome";
import UnpaidHome from "./UnpaidHome";

const ThickBorderShadowDiv: FC<PropsWithChildren> = ({ children }) => (
  <div
    className="border-4 border-black rounded-lg p-6 bg-white"
    style={{ boxShadow: "8px 8px 0px 0px black" }}
  >
    {children}
  </div>
);

const PairUpTab = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="w-3/4 mx-auto font-bold text-3xl font-peachy my-10">
        Hey, {user?.public_profile.name}!
      </h1>
      <div className="flex flex-col items-center justify-center">
        <ThickBorderShadowDiv>
          <h1 className="text-3xl font-bold text-gray-900 font-peachy">
            Pair-ups
          </h1>
          {user?.system_profile.membership_status === "good" ? (
            <GoodHome />
          ) : (
            <UnpaidHome />
          )}
        </ThickBorderShadowDiv>
      </div>
    </div>
  );
};

export default PairUpTab;
