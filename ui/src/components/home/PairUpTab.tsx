import { useAuth } from "@/providers/auth-provider";
import GoodHome from "./GoodHome";
import { ThickBorderShadowDiv } from "./ThickBorderShadowDiv";
import UnpaidHome from "./UnpaidHome";

const PairUpTab = () => {
  const { user } = useAuth();
  const membership_status = user?.system_profile.membership_status;
  return (
    <div className="flex flex-col items-center justify-center  ">
      {(membership_status === "good" || membership_status === "paused") && (
        <>
          <h1 className="font-peachy m-auto leading-none tracking-tight text-5xl text-[#373737]  mx-auto my-10">
            Your upcoming pair-ups
          </h1>
          <div className="flex flex-col items-center justify-center ">
            <ThickBorderShadowDiv>
              <h1 className="text-3xl font-bold text-[#37251E] font-peachy px-6 pt-6">
                Pair-ups
              </h1>
              <GoodHome />
            </ThickBorderShadowDiv>
          </div>
        </>
      )}
      {membership_status === "unpaid" && (
        <>
          <h1 className="font-peachy m-auto leading-none tracking-tight text-5xl text-[#373737]  mx-auto my-10">
            Welcome to Frendle
          </h1>
          <div className="flex flex-col items-center justify-center ">
            <ThickBorderShadowDiv>
              <UnpaidHome />
            </ThickBorderShadowDiv>
          </div>
        </>
      )}
    </div>
  );
};

export default PairUpTab;
