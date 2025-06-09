import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import "wired-elements";

export function RootComponent() {
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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [
      { rel: "stylesheet" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <div>
        <DefaultCatchBoundary {...props} />
      </div>
    );
  },
  notFoundComponent: () => <div>not found</div>,
  component: RootComponent,
});
