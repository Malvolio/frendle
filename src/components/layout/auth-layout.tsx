import { LoginPrompt } from "@/components/auth/login-prompt";
import { useAuth } from "@/providers/auth-provider";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    console.log("[AuthLayout] Waiting for auth initialization");
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-4 md:py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
