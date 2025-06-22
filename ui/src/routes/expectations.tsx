import PageTitle from "@/components/layout/PageTitle";
import { PublicLayout } from "@/components/layout/public-layout";
import TextBlock from "@/components/layout/text-block";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle, Heart } from "lucide-react";

export const Route = createFileRoute("/expectations")({
  component: () => (
    <PublicLayout>
      <PageTitle title="Community Expectations">
        Welcome to Frendle! Our community thrives when everyone feels valued,
        respected, and safe to be themselves. Read this to learn what we, all of
        us, Frendle staff and your fellow Frendle members expect of you.
      </PageTitle>

      <TextBlock>
        {/* Introduction */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
            Building Connections Together
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Frendle is more than just an app—it's a community where meaningful
            connections are born from mutual respect and genuine curiosity about
            one another. We believe that the best friendships emerge when people
            feel free to share authentically while treating others with care and
            consideration.
          </p>
          <p className="text-gray-700 leading-relaxed">
            These expectations aren't rules to restrict you, but rather a
            foundation that helps everyone feel comfortable being their true
            selves while exploring new friendships.
          </p>
        </div>

        {/* Core Expectations */}
        <div className="space-y-8">
          {/* Open-Mindedness */}
          <div className="border-l-4 border-green-400 pl-6">
            <h3 className="text-xl font-semibold text-green-800 mb-3 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              Embrace Open-Mindedness
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Every person you meet on Frendle brings unique experiences,
              perspectives, and stories. Approach conversations with genuine
              curiosity rather than judgment. You might discover that someone
              who seems different from you shares unexpected common ground, or
              that their different viewpoint enriches your own understanding.
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>This means:</strong> Listening to understand rather than
                to respond, asking thoughtful questions about experiences
                different from your own, and being willing to reconsider your
                assumptions when presented with new information.
              </p>
            </div>
          </div>

          {/* Kindness and Decency */}
          <div className="border-l-4 border-blue-400 pl-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <Heart className="w-6 h-6 mr-2" />
              Treat Everyone with Decency and Kindness
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Kindness is the foundation of every meaningful connection. Even
              when you don't click with someone or find yourself in
              disagreement, you can still interact with respect and
              consideration. Remember that behind every profile is a real person
              with feelings, hopes, and perhaps some vulnerability in reaching
              out for friendship.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>This includes:</strong> Using respectful language, being
                patient with miscommunications, honoring boundaries when someone
                isn't interested in connecting further, and remembering that
                rejection isn't personal—it's just about compatibility.
              </p>
            </div>
          </div>

          {/* Honest Reporting */}
          <div className="border-l-4 border-amber-400 pl-6">
            <h3 className="text-xl font-semibold text-amber-800 mb-3 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Honestly Report Problem Behavior
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We rely on our community to help maintain a safe and welcoming
              environment for everyone. If someone makes you uncomfortable,
              violates these expectations, or behaves inappropriately, please
              report it promptly. Your honesty in reporting helps protect not
              just you, but other community members who might encounter similar
              issues.
            </p>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>Please report:</strong> Harassment, inappropriate
                messages, discriminatory language, spam, fake profiles, or any
                behavior that makes you feel unsafe or unwelcome. You're not
                overreacting by reporting something that doesn't feel right.
              </p>
            </div>
          </div>
        </div>

        {/* What We Don't Tolerate */}
        <div className="mt-10 p-6 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-3">
            Behavior We Cannot Accept
          </h3>
          <p className="text-red-700 text-sm leading-relaxed">
            While we approach moderation with understanding and context, some
            behaviors are incompatible with our community values: harassment,
            hate speech, discrimination, threats, sharing inappropriate content,
            or persistent disrespect after being asked to stop. These actions
            may result in account suspension or removal.
          </p>
        </div>
      </TextBlock>

      <div>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-indigo-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Thank You for Being Part of Frendle
            </h2>
            <p className="text-indigo-100 leading-relaxed mb-6">
              By following these expectations, you're helping create a space
              where authentic friendships can flourish. Every positive
              interaction you have makes Frendle a better place for everyone.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-indigo-50 transition duration-200">
                Start Connecting
              </button>
              <button className="border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition duration-200">
                Report an Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  ),
});
