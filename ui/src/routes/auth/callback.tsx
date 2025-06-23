import { useAuth } from "@/providers/auth-provider";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/callback")({
  component: () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      console.log("[CallbackPage] User:", user);
      if (!loading) {
        const redirectPath = localStorage.getItem("auth_redirect") || "/";
        console.log(
          "[CallbackPage] Redirecting to:",
          redirectPath,
          localStorage.getItem("auth_redirect")
        );
        localStorage.removeItem("auth_redirect"); // Clean up
        navigate({ to: redirectPath });
      }
    }, [loading, navigate]);

    return (
      <div className="flex items-center justify-center min-h-screen">
        {user ? "Successfully logged in!" : "Logging in..."}
      </div>
    );
  },
});
