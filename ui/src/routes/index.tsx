import { SignedIn, SignedOut } from "@/components/home";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/providers/auth-provider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => {
    const { loading, user } = useAuth();
    if (loading) {
      return <Spinner />;
    }
    return user ? <SignedIn /> : <SignedOut />;
  },
});
