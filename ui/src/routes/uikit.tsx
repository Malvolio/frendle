import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/uikit")({
  component: () => (
    <div className="container py-10 bg-[url(background.jpg)]">
      <h1>UI Kit</h1>
      <p className="text-lg mb-6">
        This page showcases the UI components used in the Frendle.{" "}
      </p>
      <hr></hr>
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-8 border-black">
          <h2>Buttons</h2>

          <Button>Click Me</Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
        <div className="border p-8 border-black flex flex-col justify-center">
          <h2>Inputs</h2>
          <Input placeholder="Enter text..." />
          <Textarea placeholder="Enter longer text..." />
        </div>

        <div className="border p-8 border-black flex flex-col justify-center">
          <h2>Links</h2>
          <Button variant="link" asChild>
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Text link
            </a>
          </Button>
        </div>
      </div>
      {/* EMAIL TEMPLATE */}
      email template
    </div>
  ),
});
