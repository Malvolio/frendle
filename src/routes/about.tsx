import { AboutMission, AboutStory, AboutTeam } from "@/components/about";
import PageTitle from "@/components/layout/PageTitle";
import { PublicLayout } from "@/components/layout/public-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createFileRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";

import { BookOpen, Target, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get current tab from URL hash, default to 'story'
    const currentTab = location.hash?.replace("#", "") || "mission";

    // Handle tab change
    const handleTabChange = (hash: string) => {
      navigate({
        to: "/about",
        hash,
        replace: true,
      });
    };

    return (
      <PublicLayout>
        <PageTitle title="About Us">
          Learn more about our story, team, and mission
        </PageTitle>

        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-7/12 mx-auto grid-cols-3 mb-6">
            <TabsTrigger value="mission" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Mission
            </TabsTrigger>
            <TabsTrigger value="story" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Story
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="w-7/12 mx-auto">
            <AboutStory />
          </TabsContent>
          <TabsContent value="team" className="w-7/12 mx-auto">
            <AboutTeam />
          </TabsContent>
          <TabsContent value="mission" className="w-7/12 mx-auto">
            <AboutMission />
          </TabsContent>
        </Tabs>
      </PublicLayout>
    );
  },
});
