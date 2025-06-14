import { AuthLayout } from "@/components/layout/auth-layout";
import VideoChat from "@/components/session/VideoChat";
import { useAuth } from "@/providers/auth-provider";
import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/session")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string,
    host: Boolean(search.host),
  }),
  component: () => {
    const { id: sessionId, host } = useSearch({ from: "/session" });
    const { user } = useAuth();

    return (
      <AuthLayout title={`Video Chat — ${host ? "Host" : "Guest"}`} clean>
        <VideoChat
          sessionId={sessionId}
          isHost={host}
          userId={user?.id ?? ""}
        />
      </AuthLayout>
    );
  },
});
