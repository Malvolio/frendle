import ScrollTriggeredImages from "@/components/index/ScrollTriggeredImages";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { useSignInWithGoogle } from "@/providers/auth-provider";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Users, Wrench } from "lucide-react";
import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const SignedOut = () => {
  const { handleGoogleSignIn, isLoading } = useSignInWithGoogle();
  const [expanded, setExpanded] = useState(false);
  const mainControls = useAnimation();
  useEffect(() => {
    const onScroll = () => {
      setExpanded(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  return (
    <PublicLayout>
      <section className="relative bg-[url('/background.jpg')] bg-cover bg-center bg-fixed min-h-screen">
        {/* Hero section */}
        <div className="relative h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40"></div>

          <div className="container relative z-10 pt-20 md:pt-0 mx-auto">
            <div className="max-w-3xl mx-auto text-center  items-center">
              <img
                src="index/hero_image.png"
                alt="Questions, videos, games for friendly connections."
                className="m-auto"
              />
              <h1 className="text-6xl md:text-7xl font-bold leading-tight animate-fade-in text-[#373737] font-peachy ">
                Create connections, make friends
              </h1>

              <p className="text-lg md:text-1xl mb-8 animate-fade-in font-normal text-[#37251E] mt-2">
                New faces, light games, real talk. Frendle makes it fun to
                connect with guided by simple prompts and playful activities.
                It&apos;s the good social app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <div className="flex flex-col gap-8 cursor-pointer">
                  <wired-button
                    elevation="3"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                      >
                        <path
                          fill="currentColor"
                          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        />
                      </svg>
                      Sign in with Google to start chatting
                    </span>
                  </wired-button>
                  <Link to="/about">Learn More</Link>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div> */}
        </div>
        {/* Features section */}
        <motion.section
          id="features"
          initial={{ width: "90%" }}
          animate={expanded ? { width: "100%" } : {}}
          transition={{ ease: "easeOut", stiffness: 80, damping: 20 }}
          className="bg-[#FFFDFA] h-auto"
          style={{
            margin: "0 auto",
            padding: "0",
            zIndex: 10,
            minHeight: "fit-content",
            position: "relative",
            display: "block",
          }}
        >
          {/*  */}
          <div className="w-[auto]  m-auto text-center bg-[#FFFDFA] h-auto sticky top-[60px] z-50 pt-12">
            <h2 className="text-4xl md:text-5xl font-peachy text-[#37251E] m-auto text-center">
              Built for real, human connection
            </h2>
            <p className="text-lg md:text-1xl mb-8 animate-fade-in font-normal text-[#37251E] text-center w-6/12 mx-auto my-4">
              No feeds. No followers. Just honest, one-on-one conversations that
              bring people closer together. Frendle is about matching you with
              kind, curious humans for meaningful, platonic chats.
            </p>
          </div>
          <ScrollTriggeredImages />
        </motion.section>
        {/* /////// */}
        {/* Money section */}
        <div className="py-20">
          <div className="container m-auto">
            <div className="text-center mb-16">
              <h2 className="font-peachy text-3xl font-bold mb-4 text-[#373737]">
                Where the money goes
              </h2>

              <p className="text-xl max-w-2xl mx-auto">
                We keep things cozy, kind, and troll-free—and that takes work. A
                small membership fee helps us stay intentional, support the
                community, and give back.
              </p>
              <img
                src="index/graph.png"
                alt="Membership fees go towards supporting the platform and the charity of your choice."
                className="w-[300px] m-auto"
              />
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap- max-w-4xl m-auto">
              <li>
                <Wrench className="h-14 w-14 text-primary" /> Keeping Frendle up
                and running (and getting better)
              </li>
              <li>
                <Users className="h-14 w-14 text-primary" /> Funding thoughtful
                moderation and safety tools
              </li>
              <li>
                <Heart className="h-14 w-14 text-primary" /> Giving back—55% of
                every membership goes to the charity you choose
              </li>
            </ol>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-muted/30 py-20">
          <div className="container m-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-peachy text-3xl font-bold mb-4 text-[#373737]">
                Ready to connect?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join to start connecting with new friends today!
              </p>
              <Link to="/match">
                <Link to="/login">
                  <Button size="lg">Sign In</Button>
                </Link>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SignedOut;
