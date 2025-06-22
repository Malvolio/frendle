import { PublicLayout } from "@/components/layout/public-layout";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: () => (
    <PublicLayout>
      <div className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">
              Last updated: June 8, 2025
            </p>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Welcome to Frendle! This Privacy Policy explains how we
                  collect, use, and protect your personal information when you
                  use our application. By using our app, you consent to the
                  practices described in this policy.
                </p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date.
              </div>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p>
                <strong>Email:</strong> privacy@frendle.example.com
                <br />
                <strong>Address:</strong> 123 Connection Street, Suite 456, San
                Francisco, CA 94107
              </p>
            </div>

            <Separator className="my-8" />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Need Help?</h2>
              <p className="text-muted-foreground">
                If you have any questions about our privacy practices or would
                like to exercise your privacy rights, please don't hesitate to
                contact us.
              </p>
              <div className="flex gap-4">
                <a
                  href="mailto:privacy@frendle.example.com"
                  className="text-primary hover:underline"
                >
                  Email Us
                </a>
                <span className="text-muted-foreground">|</span>
                <a href="#" className="text-primary hover:underline">
                  FAQs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  ),
});
