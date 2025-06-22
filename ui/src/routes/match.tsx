import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, MessageSquare, Users, Video } from "lucide-react";

export const Route = createFileRoute("/match")({
  component: () => (
    <AuthLayout title="Match with Others">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-lg text-muted-foreground">
            Connect with strangers through brief, guided activities in a safe
            environment.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Start a New Match
              </CardTitle>
              <CardDescription>
                You'll be matched with someone who shares your interests for a
                brief video chat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center text-center">
                    <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                    <div className="font-medium">5-15 minutes</div>
                    <div className="text-sm text-muted-foreground">
                      per session
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center text-center">
                    <Users className="h-8 w-8 text-muted-foreground mb-2" />
                    <div className="font-medium">1-on-1 matching</div>
                    <div className="text-sm text-muted-foreground">
                      private conversation
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center text-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                    <div className="font-medium">Guided topics</div>
                    <div className="text-sm text-muted-foreground">
                      conversation starters
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full md:w-auto" size="lg">
                    Find a Match
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Note: This feature is coming soon! Check back in the future
                    for matching functionality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Matching Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary text-xs">1</span>
                  </div>
                  <span>Be respectful and kind to your match partner.</span>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary text-xs">2</span>
                  </div>
                  <span>
                    Follow the guided prompts to help create meaningful
                    conversation.
                  </span>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary text-xs">3</span>
                  </div>
                  <span>
                    If you feel uncomfortable at any time, you can end the
                    session.
                  </span>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary text-xs">4</span>
                  </div>
                  <span>
                    Report any inappropriate behavior through our reporting
                    system.
                  </span>
                </li>
                <li className="flex gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary text-xs">5</span>
                  </div>
                  <span>Enjoy the opportunity to meet someone new!</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthLayout>
  ),
});
