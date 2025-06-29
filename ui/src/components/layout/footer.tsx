import { NAV_ITEMS } from "@/config/navigation";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/40 border-t p-8">
      <div className="container py-8 md:py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/lib/logo_small.svg"
                alt="Logo"
                width="137px"
                height="114px"
              />
            </Link>
            <p className="text-md">Create connections, make friends</p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.filter((item) => !item.requiresAuth).map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li key="about-us">
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Frendle
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/donation"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Donation Policy
                </Link>
              </li> */}
            </ul>
          </div>
          <div className="text-lg">
            <p className="my-0">
              <strong>Got thoughts?</strong>{" "}
            </p>
            <p className="my-0">We'd love to hear your feedback!</p>
            <p className="my-0">
              Email us at{" "}
              <a href="mailto:hello@frendle.space" className="underline">
                hello@frendle.space
              </a>
            </p>
          </div>
     
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Frendle. All rights reserved.
          </p>
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            Made with <Heart className="h-3 w-3 text-red-500" /> using Bolt.new
          </a>
        </div>
      </div>
    </footer>
  );
}
