import { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Resources",
    href: "/resources",
  },
  {
    title: "Community Expectations",
    href: "/expectations",
  },
  {
    title: "Profile",
    href: "/profile",
    requiresAuth: true,
  },
  {
    title: "UI Kit",
    href: "/uikit",
    requiresAuth: true,
  },
];
