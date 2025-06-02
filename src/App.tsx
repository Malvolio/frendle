import { Toaster } from "@/components/ui/toaster";
import { AboutPage } from "@/pages/about";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { MatchPage } from "@/pages/match";
import { PrivacyPage } from "@/pages/privacy";
import { ProfilePage } from "@/pages/profile";
import { ResourcesPage } from "@/pages/resources";
import { SessionPage } from "@/pages/session";
import { UIKit } from "@/pages/uikit";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Outlet, RouterProvider, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import "@/App.css";

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resources',
  component: ResourcesPage,
});

const uikitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/uikit',
  component: UIKit,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const matchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/match',
  component: MatchPage,
});

const sessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/session',
  component: SessionPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: search.id as string,
      host: search.host === 'true',
    };
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  resourcesRoute,
  uikitRoute,
  privacyRoute,
  loginRoute,
  profileRoute,
  matchRoute,
  sessionRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App