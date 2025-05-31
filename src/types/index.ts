export interface User {
  id: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  selectedCharity?: string;
  membershipStatus: 'free' | 'premium';
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  website: string;
  logoUrl?: string;
  category: string;
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface NavItem {
  title: string;
  href: string;
  requiresAuth?: boolean;
}