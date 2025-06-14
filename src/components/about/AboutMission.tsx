import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Globe, Handshake, Heart, Target, Users } from "lucide-react";

const AboutMission = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="w-5 h-5 text-green-600" />
        Our Mission
      </CardTitle>
      <CardDescription>Why are we doing this?</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Our Mission</h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
          Frendle was created with a simple yet powerful mission: to reduce
          social isolation and build meaningful connections in our increasingly
          digital world.
        </p>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-lg"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="mt-1">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Handshake className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Authentic Connections
              </h3>
              <p className="text-muted-foreground">
                We believe in fostering genuine human connections. Our guided
                activities are designed to help people move beyond small talk
                and form meaningful relationships.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Social Well-being</h3>
              <p className="text-muted-foreground">
                Social isolation affects millions of people globally. We're
                committed to creating spaces where everyone can feel connected,
                heard, and valued.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Transparent Giving</h3>
              <p className="text-muted-foreground">
                We're committed to social impact. Our transparent donation model
                lets users select a 501(c) charity, and we take no fees from
                these donations.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Inclusive Community
              </h3>
              <p className="text-muted-foreground">
                We strive to create a platform where everyone feels welcome,
                regardless of background, identity, or experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/40 rounded-lg p-8 md:p-12 max-w-5xl mx-auto mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">
            Our Transparent Donation Model
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe in putting social impact at the center of our business
            model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 shadow-sm text-center">
            <div className="text-4xl font-bold text-primary mb-2">20%</div>
            <p className="text-muted-foreground">
              of all premium subscription revenue goes directly to charity
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <p className="text-muted-foreground">
              of your donation goes to your selected charity with no fees
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              You Choose
            </div>
            <p className="text-muted-foreground">
              which 501(c) charity receives your contribution
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AboutMission;
