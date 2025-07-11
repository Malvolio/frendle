import { LoginPrompt } from "@/components/auth/login-prompt";
import { useAuth } from "@/providers/auth-provider";
import { ReactNode } from "react";
import Unready from "../Unready";
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
    return <Unready />;
  }

  if (!user) {
    return <LoginPrompt />;
  }

  return clean ? children : <PublicLayout>{children}</PublicLayout>;
}
