import { LoginPrompt } from "@/components/auth/login-prompt";
import { useAuth } from "@/providers/auth-provider";
import { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AuthLayout({ children }: AuthLayoutProps) {
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
    <div className="flex flex-col min-h-screen bg-[url('/bg-paper.png')] bg-repeat bg-auto">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
