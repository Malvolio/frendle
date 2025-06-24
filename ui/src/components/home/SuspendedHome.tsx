import { ThickBorderShadowDiv } from "./ThickBorderShadowDiv";

const SuspendedHome = () => (
  <ThickBorderShadowDiv className="w-1/2 mx-auto my-20">
    <div>
      Your account has been <span className="font-bold">suspended</span>.
    </div>
    <div>
      It’s important for us to keep a safe and welcoming environment. If your
      interactions are deemed as rude or unsafe you may get suspended.
    </div>
    <div>Your suspension may get lifted after further review.</div>
  </ThickBorderShadowDiv>
);
export default SuspendedHome;
