import { AboutMission, AboutStory, AboutTeam } from "@/components/about";
import PageTitle from "@/components/layout/PageTitle";
import { PublicLayout } from "@/components/layout/public-layout";
import TabSet from "@/components/TabSet";
import { createFileRoute } from "@tanstack/react-router";

import { BookOpen, Target, Users } from "lucide-react";
const AboutTabs = [
  {
    id: "mission",
    name: "Mission",
    icon: Target,
    body: AboutMission,
  },
  { id: "story", name: "Story", icon: BookOpen, body: AboutStory },
  { id: "team", name: "Team", icon: Users, body: AboutTeam },
];

export const Route = createFileRoute("/about")({
  component: () => (
    <PublicLayout>
      <PageTitle title="About Us">
        Learn more about our story, team, and mission
      </PageTitle>
      <TabSet tabs={AboutTabs} />
    </PublicLayout>
  ),
});
