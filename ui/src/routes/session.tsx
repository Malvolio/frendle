import { AuthLayout } from "@/components/layout/auth-layout";
import useGetSession from "@/components/session/useGetSession";
import VideoChat from "@/components/session/VideoChat";
import Spinner from "@/components/Spinner";
import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/session")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string,
    host: Boolean(search.host),
  }),
  component: () => {
    const { id: sessionId, host: isHost } = useSearch({ from: "/session" });
    const { loading, session, error } = useGetSession(sessionId, isHost);
    return (
      <AuthLayout title={`Session — ${isHost ? "Host" : "Guest"}`} clean>
        {loading && <Spinner />}
        {error}
        {session && <VideoChat session={session} />}
      </AuthLayout>
    );
  },
});
