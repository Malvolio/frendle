
import { RoughNotation } from "react-rough-notation";
import TextBlock from "../layout/text-block";

const AboutMission = () => (
  <div className="min-h-screen max-w-6xl m-auto gap-6">
    {/* <div className="container mx-auto px-4 py-8 max-w-4xl"> */}
    {/* <div className="p-8 mb-8 text-2xl"> */}
    <h1 className="md:text-6xl max-w-4xl m-auto font-peachy my-4 text-[#37251e] ">We came together to build a space for connection</h1>
    <div className="flex flex-col md:flex-row gap-6 text-2xl mt-6">
      <RoughNotation
        type="box"
        show={true}
        iterations={3}
        animate={false}
        color="black"
      >
        <div className="p-6 rounded-lg text-xl border-[14px] border-[#82755514] h-auto">
          <h3 className="text-[#37251e] text-4xl font-semibold font-peachy mb-3 flex items-center">
            Hey, Michael here
          </h3>
          <p className="my-0">Co-Founder of Frendle</p>
          <p className="leading-relaxed mb-4 ">
            Like many other people in tech, I’ve been impressed by how much technology has advanced in the last few years — but also bitterly disappointed by how many social problems that technology not only did not solve but actually made worse.
          </p>
          <p className="leading-relaxed mb-4 ">And I kept hearing the phrase “loneliness epidemic”. It struck me as an oxymoron.  In a real epidemic, like the one we just survived, the problem, as Sartre might say, is other people.  Only other people can transmit the illness to you.  If you were utterly alone, an epidemic would leave you untouched.  Loneliness should be the “anti-epidemic”: having people around you should fix loneliness.</p>
          <button>Expand</button>
          <div className="hidden">
            <p className="leading-relaxed mb-4 ">But that is clearly not the truth.  Technology is making us more and more connected.  Any hour of the day, we can reach out and communicate with — or at least “message with” — anybody: strangers, friends, enemies, celebrities.</p>
            <p className="leading-relaxed mb-4 ">And yet, more and more individuals feel severely alone.  People, people everywhere — but nobody to talk to!</p>
            <p className="leading-relaxed mb-4 ">The problem irked me.  It should be easily solvable; it really should be self-solving.  All these lonely people, we should just introduce them to each other.  It should work, but I have watched so many attempts to do exactly that, to establish “online communities” degenerate into digital Lord Of The Flies dystopias. The misbehaviors were so varied and creative, they earned evocative names: cat-fishing, brigading, sock-puppeteering, cancelling. It was dismaying.</p>
            <p className="leading-relaxed mb-4 ">Then, I was reading about the Bolt hackathon, specifically the judging criteria, and one word stood out, like it was underlined: “impact”.  Solve a big problem and with the big prize.</p>
            <p className="leading-relaxed mb-4 ">That just lit me up.  Sure, I could make any number of clever little things.  It would be fun and educational and if one thing were clever enough, I could even win the hackathon.  Or at least place.</p>
            <p className="leading-relaxed mb-4 ">But “impact”?  No, I needed to solve a real problem and I had just the thing: the widespread sense of social isolation.</p>
            <p className="leading-relaxed mb-4 ">I brought the hackathon up with Venessa — she was fascinated just by the idea of the “World’s Largest” hackathon — and my thought of a project to address isolation.  She brought up the work of Arthur Aron and his famous 36 Questions.  Hey, we could do that, we could pair off people, strangers, and have them ask each other the questions, see if we can turn strangers into friends. It might work.</p>
            <p className="leading-relaxed mb-4 ">So here we are.  Venessa did a beautiful job of making the site casual and approachable, I finally got the video-chat code all working and the matching algorithm into a semblance of order.  Of course, now comes the hard part: we need to convince people to use it.  Then, if we can do that, maybe…</p>
          </div>
        </div>
      </RoughNotation>
      <RoughNotation
        type="box"
        show={true}
        iterations={3}
        animate={false}
        color="black"
      >
        <div className="p-6 rounded-lg text-xl border-[14px] border-[#82755514] h-auto">
          <h3 className="text-[#37251e] text-4xl font-semibold font-peachy mb-3 flex items-center">
            Hi, I'm Venessa
          </h3>
          <p className="my-0">Co-Founder of Frendle</p>
          <p className="leading-relaxed mb-4 ">
            When Michael suggested joining Bolt.New's hackathon and use the opportunity to work together and give people a space and tools to get closer together in a welcoming space, I was all in. First, when else would I get the chance to be part of a Guinness World Record? But more importantly, when else would there be an opportunity to create something meaningful in such a short amount of time, while learning new things and being surrounded by a community of people building their dreams? Needless to say, I was in.
          </p>
          <button>Expand</button>
          <div className="hidden">
            <p className="leading-relaxed mb-4 ">I grew up in the age of dial-up modems. I can still close my eyes and hear the beeps, dings, and static that pierced my eardrums—but also filled me with wonder. To me, the internet was a portal to _the entire world_. Yes, it’s always had its dark corners, but it also had magic. From an old, rickety room, I could connect to people, ideas, and opportunities I never imagined. The internet helped me continue my education, led me to a career I still love, to finding my first home, and eventually to meeting my spouse. That sense of connection shaped my life. I still believe in its magic—and its potential to bring out the better parts of us.</p>
            <p className="leading-relaxed mb-4 ">With Frendle we aimed to create a space for people to connect with each other in a genuine, casual atmosphere. With a little help from prompts and shared experiences designed to bring people closer together. Frendle is not meant to be a social app that zaps your attention for hours. It's scheduled and time based purposely so it can be a tool to help cultivate that muscle that builds closer connections.</p>
            <p className="leading-relaxed mb-4 ">Frendle’s design is intentionally imperfect. We’re inspired by watercolors, and the doodles drawn on paper as our minds wander. Technology, especially AI, can feel cold and clinical. We wanted to create something that feels warm. Our colors are organic, our AI-generated doodles are intentionally wonky, and our animations are full of quiet nuance. We hope it all evokes a sense of approachability. To us, Frendle is about using technology to support, not replace, our human nature.</p>
          </div>
        </div>

      </RoughNotation>


    </div>
  </div>
  // </div >
);

export default AboutMission;
