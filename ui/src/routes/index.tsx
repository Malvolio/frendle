import { SignedIn, SignedOut } from "@/components/home";
import { useAuth } from "@/providers/auth-provider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => {
    const { loading, user } = useAuth();
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-muted/30">
          <div className="text-lg text-muted-foreground">Loading...</div>
        </div>
      );
    }
    return user ? <SignedIn /> : <SignedOut />;
  },
});
