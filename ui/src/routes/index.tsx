import { SignedIn, SignedOut } from "@/components/home";
import Unready from "@/components/Unready";
import { useAuth } from "@/providers/auth-provider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => {
    const { loading, user } = useAuth();
    if (loading) {
      return <Unready />;
    }
    return user ? <SignedIn /> : <SignedOut />;
  },
});
