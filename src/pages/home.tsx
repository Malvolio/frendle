import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, Smile, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage = () => (
  <PublicLayout>
    <section className="relative">
      {/* Hero section */}
      <div className="relative h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/20 to-background"></div>
          <img
            src="https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg"
            alt="People connecting"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-10 pt-20 md:pt-0">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Meaningful Connections Through Guided Activities
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground animate-fade-in opacity-90">
              Frendle helps you connect with strangers through brief, guided
              video activities in a safe environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/about">
                <Button size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
              <Link to="/match">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
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
              <h3 className="text-xl font-semibold mb-2">Match with Others</h3>
              <p className="text-muted-foreground">
                Get matched with people who share your interests and
                conversation goals.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe Environment</h3>
              <p className="text-muted-foreground">
                Enjoy conversations in a moderated, safe space with clear
                community guidelines.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Smile className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Guided Activities</h3>
              <p className="text-muted-foreground">
                Follow fun prompts designed to create meaningful conversations.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Charities</h3>
              <p className="text-muted-foreground">
                20% of premium subscriptions go to your selected 501(c) charity.
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
