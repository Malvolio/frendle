import ScrollTriggeredImages from "@/components/index/ScrollTriggeredImages";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { useAuth, useSignInWithGoogle } from "@/providers/auth-provider";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Scroll, Shield, Smile, Users } from "lucide-react";
import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// function useScrollPosition() {
//   const [scrollY, setScrollY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return scrollY;
// }

const features = [
  {
    title: "Match for 1:1 casual convos",
    description:
      "Match with others who share similar interests and looking for platonic connections that can lead to deeper friendships",
    image: "index/match.svg",
    alt: "TODO",
  },
  {
    title: "Prompt-based conversations",
    description:
      "Inspired by the 36 questions from Author ___ to build connections this has been a blueprint for social encounters since the 80s. Fun prompts designed to create meaningful conversations. Questions are provided over time to get to know each other over the course of a couple of chats",
    image: "index/questions.svg",
    alt: "TODO",
  },
  {
    title: "Shared experiences",
    description:
      "From simple games to watching awe inspiring videos and art together. These playful interactions take the pressure off and create a shared sense of awe",
    image: "/hero-image.png",
    alt: "TODO",
  },
  {
    title: "Focused time, safe space",
    description:
      "We don’t do jerks, we create short, structured chats that respect your time and boundaries and look to cultivate a safe environment where all are welcome",
    image: "index/week.svg",
    alt: "TODO",
  },
  {
    title: "Platonic by design",
    description:
      "o focus on friendship and connection Backed by psychology, not social media metrics",
    image: "index/support-charities.png",
    alt: "TODO",
  },
  {
    title: "Community-supported & supporting charities",
    description:
      "We charge a small monthly fee to keep. Think of it as a swear jar but 20% goes to the charity of your choice, the rest to run the community.",
    image: "index/donation.svg",
    alt: "TODO",
  },
];

export const Route = createFileRoute("/")({
  component: () => {
    const { user } = useAuth();
    const { handleGoogleSignIn, isLoading } = useSignInWithGoogle();
    const [expanded, setExpanded] = useState(false);
    const mainControls = useAnimation();
    // const scrollY = useScrollPosition();
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
                  {/* TODO: Login here */}
                  {!user && (
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
                  )}
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
                No feeds. No followers. Just honest, one-on-one conversations that bring people closer together. Frendle is about  matching you with kind, curious humans for meaningful, platonic chats.
              </p>
            </div>
            <ScrollTriggeredImages />


          </motion.section>
          {/* /////// */}
          {/* Features section */}
          <div className="py-20">
            <div className="container">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 text-[#373737]">
                  How Frendle Works
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Our platform is designed to foster genuine connections in a
                  structured, time-boxed environment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Match with Others
                  </h3>
                  <p className="text-muted-foreground">
                    Get matched with people who share your interests and
                    conversation goals.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Safe Environment
                  </h3>
                  <p className="text-muted-foreground">
                    Enjoy conversations in a moderated, safe space with clear
                    community guidelines.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Smile className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Guided Activities
                  </h3>
                  <p className="text-muted-foreground">
                    Follow fun prompts designed to create meaningful
                    conversations.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Support Charities
                  </h3>
                  <p className="text-muted-foreground">
                    20% of premium subscriptions go to your selected 501(c)
                    charity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA section */}
          <div className="bg-muted/30 py-20">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join thousands of people using Frendle to create meaningful
                  connections and reduce social isolation.
                </p>
                <Link to="/match">
                  <Button size="lg">
                    Start Matching Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  },
});

export function Feature({
  title,
  description,
  image,
  alt,
}: {
  title: string;
  description: string;
  image: string;
  alt: string;
}) {
  const ref = useRef(null);
  // const inView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 p-6 mb-8 top-40 left-0 h-96 z-30 relative"
    >
      <div className="w-[526px] text-[#37251E]">
        <h3 className="text-2xl font-bold pt-7">{title}</h3>
        <hr></hr>
        <p className="">{description}</p>
      </div>

      <div>
        <img src={image} alt={alt} className="w-[500px]" />
      </div>
    </div>
  );
}
