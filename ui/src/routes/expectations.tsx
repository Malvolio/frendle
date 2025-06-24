import PageTitle from "@/components/layout/PageTitle";
import { PublicLayout } from "@/components/layout/public-layout";
import TextBlock from "@/components/layout/text-block";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle, Heart } from "lucide-react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

export const Route = createFileRoute("/expectations")({
  component: () => (
    <PublicLayout>
      {/* <PageTitle title="House Rules"> */}
      {/* Welcome to Frendle! Our community thrives when everyone feels valued,
        respected, and safe to be themselves. Read this to learn what we, all of
        us, Frendle team and your fellow Frendle members expect of you. */}
      {/* </PageTitle> */}

      <TextBlock>
        {/* Introduction */}
        <div className="mb-10 leading-relaxed text-[#37251e] ">


          <h1 className="md:text-6xl font-peachy mb-4">
            <RoughNotationGroup show={true}>
              Frendle's &nbsp;
              <RoughNotation
                type="box"
                show={true}
                order={2}
                iterations={2}
                animate={true}
                strokeWidth={6}
                animationDelay={200}
                color="black"
              >House
                <RoughNotation
                  type="highlight"
                  show={true}
                  order={3}
                  iterations={3}
                  strokeWidth={10}
                  animate={true}
                  animationDelay={700}
                  color="#CAD8CE"
                >Rules</RoughNotation>
              </RoughNotation>
            </RoughNotationGroup>
          </h1>


          <p className="leading-relaxed mb-4">
            Welcome to Frendle! Our community thrives when everyone feels valued,
            respected, and safe to be themselves. We believe that the best friendships emerge when people
            feel free to share authentically while treating others with care and
            consideration.


          </p>
          <p className="leading-relaxed">
            We also understand that some folks may need reminding, especially online, on how to interact with others. So we've put these house rules together to keep all of us accountable to each other and make sure that Frendle stays a welcoming space.
          </p>
        </div>

        {/* Core Expectations */}
        <div className="space-y-8">
          {/* Open-Mindedness */}
          <div className="border-l-4 l-6">
            <RoughNotation
              type="highlight"
              show={true}
              iterations={3}
              animate={false}
              color="#CAD8CE"
            >
              <h3 className="text-[#37251e] text-4xl font-semibold font-peachy mb-3 flex items-center">
                Embrace Open-Mindedness
              </h3></RoughNotation>
            <p className="leading-relaxed mb-4">
              Every person you meet on Frendle brings unique experiences,
              perspectives, and stories. Approach conversations with genuine
              curiosity rather than judgment. You might discover that someone
              who seems different from you shares unexpected common ground, or
              that their different viewpoint enriches your own understanding.
            </p>

          </div>

          {/* Kindness and Decency */}
          <div >
            <RoughNotation
              type="highlight"
              show={true}
              iterations={3}
              animate={false}
              color="#CAD8CE"
            >
              <h3 className="text-[#37251e] text-4xl font-semibold font-peachy mb-3 flex items-center">

                Treat Everyone with Decency and Kindness
              </h3></RoughNotation>
            <p className="leading-relaxed mb-4">
              Kindness is the foundation of every meaningful connection. Even
              when you don't click with someone or find yourself in
              disagreement, you can still interact with respect and
              consideration. Remember that behind every profile is a real person
              with feelings, hopes, and perhaps some vulnerability in reaching
              out for friendship.
            </p>
            {/* <div className="bg-blue-50 p-4 rounded-lg">
              <p className="leading-relaxed mb-4">
                <strong>This includes:</strong> Using respectful language, being
                patient with miscommunications, honoring boundaries when someone
                isn't interested in connecting further, and remembering that
                rejection isn't personal—it's just about compatibility.
              </p>
            </div> */}
          </div>

          {/* Honest Reporting */}
          <div className="">
            <RoughNotation
              type="highlight"
              show={true}
              iterations={3}
              animate={false}
              color="#CAD8CE"
            >
              <h3 className="text-[#37251e] text-4xl font-semibold font-peachy mb-3 flex items-center">

                Honestly Report Problem Behavior
              </h3></RoughNotation>
            <p className="frendlerleading-relaxed mb-6">
              We rely on our community to help maintain a safe and welcoming
              environment for everyone. If someone makes you uncomfortable,
              violates these expectations, or behaves inappropriately, please
              report it promptly. Your honesty in reporting helps protect not
              just you, but other community members who might encounter similar
              issues.
            </p>
            <RoughNotation
              type="box"
              show={true}
              iterations={3}
              animate={false}
              color="black"
            >

              <p className="leading-relaxed mb-4 p-2 ml-6">
                <strong className="font-peachy">Please report:</strong> Harassment, inappropriate
                messages, discriminatory language, spam, fake profiles, or any
                behavior that makes you feel unsafe or unwelcome. You're not
                overreacting by reporting something that doesn't feel right.
              </p>

            </RoughNotation>
          </div>
        </div>

        {/* What We Don't Tolerate */}
        <RoughNotation
          type="box"
          show={true}
          iterations={3}
          animate={false}
          color="red"
        >
          <div className="mt-10 p-6 bg-red-50 rounded-lg border ">
            <h3 className="text-[#37251e] text-4xl font-semibold font-peachy mb-3 flex items-center">
              Behavior We Cannot Accept
            </h3>
            <p className="leading-relaxed mb-4 ">
              While we approach moderation with understanding and context, some
              behaviors are incompatible with our community values: harassment,
              hate speech, discrimination, threats, sharing inappropriate content,
              or persistent disrespect after being asked to stop. These actions
              may result in account suspension or removal.
            </p>
          </div>
        </RoughNotation>
      </TextBlock>

      <div>
        <div className="container mx-auto px-4 py-8 max-w-4xl border-t-2 border-t-black/30">
          <div className=" rounded-2xl p-8 text-center">
            <h2 className="text-4xl font-peachy mb-4 text-[#37251e]">
              <RoughNotation
                type="underline"
                show={true}
                iterations={8}
                strokeWidth={4}
                animate={true}
                color="black"
              >Thank You</RoughNotation> for Being Part of Frendle
            </h2>
            <p className="leading-relaxed mb-6">
              By following these expectations, you're helping create a space
              where authentic friendships can flourish. Every positive
              interaction you have makes Frendle a better place for everyone.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white px-6 py-2 rounded-sm font-semibold hover:bg-indigo-50 transition duration-200">
                Start Connecting
              </button>
              <button className="border-2 border-black px-6 py-2 rounded-sm font-semibold hover:bg-white hover:[#58B4AE]] transition duration-200">
                Report an Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout >
  ),
});
