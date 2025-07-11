import { ThickBorderShadowDiv } from "./ThickBorderShadowDiv";

const BannedHome = () => (
  <ThickBorderShadowDiv className="w-1/2 mx-auto my-20">
    <div>
      Your account has been <span className="font-bold">banned</span>.
    </div>
    <div>
      Your interactions have been deemed as disruptive. In order to provide a
      safe and welcoming environment we have banned your account. Your account
      has been closed and if you’re paying for a subscription, that has been
      cancelled.
    </div>
  </ThickBorderShadowDiv>
);
export default BannedHome;
