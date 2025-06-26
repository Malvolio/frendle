import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/config/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Link, useRouterState } from "@tanstack/react-router";
import { scale } from "framer-motion";
import { Menu } from "lucide-react";
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
      className={`fixed top-0 border-b z-50 transition-all duration-300 w-screen ${isScrolled
        ? "bg-[#EFE7D5]  border-black/30"
        : "bg-[#EFE7D5]/0 border-black/0"
        }`}
    >
      <div className="container flex h-16 items-center justify-between px-6 w-screen m-auto">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <img
              src="/lib/logo_small.svg"
              alt="Logo"
              width="137px"
              height="114px"
              className={`${isScrolled ? "scale-75" : "scale-100"} transition-transform duration-300`}
            />
          </Link>

          <nav className="hidden md:flex gap-8 ml-6 h-full md:justify-end">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={` font-medium transition-colors hover:text-primary ${pathname === item.href
                  ? "font-bold"
                  : ""
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
          <a href=" https://bolt.new/" target="_blank" className={`w-20 ml-4 transition-all delay-200 duration-300 ${isScrolled ? "mt-16" : "mt-10"}`}>
            <img
              src="bolt_logo.png"
              alt="Frendle Logo"
              className="w-20"
            />
          </a>
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
