import { AboutMission } from "@/components/about";
import { PublicLayout } from "@/components/layout/public-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => (
    <PublicLayout>
      <AboutMission />
    </PublicLayout>
  ),
});
