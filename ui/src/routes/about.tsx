import { AboutMission, AboutStory, AboutTeam } from "@/components/about";
import PageTitle from "@/components/layout/PageTitle";
import { PublicLayout } from "@/components/layout/public-layout";
import { createFileRoute } from "@tanstack/react-router";



export const Route = createFileRoute("/about")({
  component: () => (
    <PublicLayout>
      <AboutMission />
    </PublicLayout >
  ),
});
