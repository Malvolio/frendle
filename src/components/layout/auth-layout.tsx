import { LoginPrompt } from "@/components/auth/login-prompt";
import { useAuth } from "@/providers/auth-provider";
import { ReactNode } from "react";
import { PublicLayout } from "./public-layout";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  clean?: boolean;
}

export function AuthLayout({ children, clean }: AuthLayoutProps) {
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

  return clean ? children : <PublicLayout>{children}</PublicLayout>;
}
