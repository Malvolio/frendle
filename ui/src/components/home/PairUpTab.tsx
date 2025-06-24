import { useAuth } from "@/providers/auth-provider";
import GoodHome from "./GoodHome";
import { ThickBorderShadowDiv } from "./ThickBorderShadowDiv";
import UnpaidHome from "./UnpaidHome";

const PairUpTab = () => {
  const { user } = useAuth();
  const membership_status = user?.system_profile.membership_status;
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
          {(membership_status === "good" || membership_status === "paused") && (
            <GoodHome />
          )}
          {membership_status === "unpaid" && <UnpaidHome />}
        </ThickBorderShadowDiv>
      </div>
    </div>
  );
};

export default PairUpTab;
