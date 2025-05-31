import { NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Resources',
    href: '/resources',
  },
  {
    title: 'Profile',
    href: '/profile',
    requiresAuth: true,
  },
  {
    title: 'Match',
    href: '/match',
    requiresAuth: true,
  },
];