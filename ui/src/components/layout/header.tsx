import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/config/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Video } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = useRouterState().location.pathname;

  const { user, signOut, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.requiresAuth || (item.requiresAuth && user)
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-background/95 backdrop-blur-sm shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <img src="/lib/logo_small.svg" alt="Logo" width="137px" height="114px" />
          </Link>

          <nav className="hidden md:flex gap-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
                  }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-[1.2rem]">
          {loading ? null : user ? (
            <Button onClick={signOut} size="sm">
              Sign Out
            </Button>
          ) : (
            <Link to="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-base font-medium transition-colors hover:text-primary ${pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                      }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
