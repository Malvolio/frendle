import { useAuth } from "@/providers/auth-provider";
import { FC, PropsWithChildren } from "react";
import GoodHome from "./GoodHome";
import UnpaidHome from "./UnpaidHome";

const ThickBorderShadowDiv: FC<PropsWithChildren> = ({ children }) => (
  <div
    className="border-2 border-b-8 border-r-8 border-black/70 p-6 bg-[#fffdfa] rounded-2xl"

  >
    {children}
  </div>
);

const PairUpTab = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-peachy m-auto leading-none tracking-tight text-5xl text-[#373737]  mx-auto my-10">
        {/* Hey, {user?.public_profile.name}!  */}
        Your upcoming pair-ups

      </h1>
      <div className="flex flex-col items-center justify-center">
        <ThickBorderShadowDiv>
          <h1 className="text-3xl font-bold text-gray-900 font-peachy">
            Your pair-ups await
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
