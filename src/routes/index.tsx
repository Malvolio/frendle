import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { useAuth, useSignInWithGoogle } from "@/providers/auth-provider";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Shield, Smile, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: () => {
    const { user } = useAuth();
    const { handleGoogleSignIn, isLoading } = useSignInWithGoogle();

    return (
      <PublicLayout>
        <section className="relative">
          {/* Hero section */}
          <div className="relative h-[90vh] flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40"></div>

            <div className="container relative z-10 pt-20 md:pt-0">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                  Kindle new friendships
                </h1>

                <p className="text-xl md:text-2xl mb-8 animate-fade-in font-medium">
                  Get paired for brief 1:1 video chats and guided activities in
                  a fun, casual environment designed to creating closer
                  connections.
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

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
          </div>

          {/* Features section */}
          <div className="bg-background py-20">
            <div className="container">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">How Frendle Works</h2>
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
