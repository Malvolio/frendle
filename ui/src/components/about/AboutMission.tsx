import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Globe, Handshake, Heart, Users } from "lucide-react";
import { RoughNotation } from "react-rough-notation";
import { PublicLayout } from "../layout/public-layout";
import TextBlock from "../layout/text-block";

const AboutMission = () => (
  <PublicLayout>
    <TextBlock>
      <h1 className="md:text-6xl font-peachy mb-4 text-[#37251e] ">We came together to build a space for connection</h1>
      <RoughNotation
        type="box"
        show={true}
        iterations={3}
        animate={false}
        color="black"
      >
        <div className="mt-10 p-6 rounded-lg border ">
          <h3 className="text-[#37251e] text-4xl font-semibold font-peachy mb-3 flex items-center">
            Hi, I'm Venessa
          </h3>
          <p className="my-0">Co-Founder of Frendle</p>
          <p className="leading-relaxed mb-4 ">
            When Michael suggested joining Bolt.New's hackathon and use the opportunity to work together and give people a space and tools to get closer together in a welcoming space, I was all in. First, when else would I get the chance to be part of a Guinness World Record? But more importantly, when else would there be an opportunity to create something meaningful in such a short amount of time, while learning new things and being surrounded by a community of people building their dreams? Needless to say, I was in.
          </p>
          <p className="leading-relaxed mb-4 ">I grew up in the age of dial-up modems. I can still close my eyes and hear the beeps, dings, and static that pierced my eardrums—but also filled me with wonder. To me, the internet was a portal to _the entire world_. Yes, it’s always had its dark corners, but it also had magic. From an old, rickety room, I could connect to people, ideas, and opportunities I never imagined. The internet helped me continue my education, led me to a career I still love, to finding my first home, and eventually to meeting my spouse. That sense of connection shaped my life. I still believe in its magic—and its potential to bring out the better parts of us.</p>
          <p className="leading-relaxed mb-4 ">With Frendle we aimed to create a space for people to connect with each other in a genuine, casual atmosphere. With a little help from prompts and shared experiences designed to bring people closer together. Frendle is not meant to be a social app that zaps your attention for hours. It's scheduled and time based purposely so it can be a tool to help cultivate that muscle that builds closer connections.</p>
          <p className="leading-relaxed mb-4 ">Frendle’s design is intentionally imperfect. We’re inspired by watercolors, and the doodles drawn on paper as our minds wander. Technology, especially AI, can feel cold and clinical. We wanted to create something that feels warm. Our colors are organic, our AI-generated doodles are intentionally wonky, and our animations are full of quiet nuance. We hope it all evokes a sense of approachability. To us, Frendle is about using technology to support, not replace, our human nature.</p>
        </div>
      </RoughNotation>
    </TextBlock>
  </PublicLayout>
);

export default AboutMission;
