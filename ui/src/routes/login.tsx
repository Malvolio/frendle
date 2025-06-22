import { LoginPrompt } from "@/components/auth/login-prompt";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: () => <LoginPrompt />,
});
