import { NAV_ITEMS } from "@/config/navigation";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/40 border-t">
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
            <p className="my-0"><strong>Got thoughts?</strong> </p>
            <p className="my-0">We'd love to hear your feedback!</p>
            <p className="my-0">Email us at hello@frendle.space </p>
          </div>
          {/* 
          <div>
            <h3 className="font-medium mb-4">Connect</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Follow us for updates and news about Frendle.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div> */}
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
