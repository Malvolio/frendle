import { Root } from "@/routes/__root";
import { AboutPage } from "@/routes/about";
import { CallbackPage } from "@/routes/auth/callback";
import { HomePage } from "@/routes/home";
import { LoginPage } from "@/routes/login";
import { MatchPage } from "@/routes/match";
import OnboardingPage from "@/routes/onboarding";
import { PrivacyPage } from "@/routes/privacy";
import { ProfilePage } from "@/routes/profile";
import { ResourcesPage } from "@/routes/resources";
import { SessionPage } from "@/routes/session";
import { UIKit } from "@/routes/uikit";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TermsPage } from "./routes/terms";

const rootRoute = createRootRoute({
  component: Root,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resources",
  component: ResourcesPage,
});

const uikitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/uikit",
  component: UIKit,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const matchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/match",
  component: MatchPage,
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

const callbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/callback",
  component: CallbackPage,
});
const sessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/session",
  component: SessionPage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string,
    host: Boolean(search.host),
  }),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  resourcesRoute,
  uikitRoute,
  onboardingRoute,
  privacyRoute,
  loginRoute,
  profileRoute,
  matchRoute,
  sessionRoute,
  termsRoute,
  callbackRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
