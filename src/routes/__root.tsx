import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Outlet } from "@tanstack/react-router";
import "wired-elements";

export function Root() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <div className="min-h-screen flex flex-col font-marigny text-foreground bg-background">
          <Outlet />
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
