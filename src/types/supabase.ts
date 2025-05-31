export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          selected_charity: string | null
          membership_status: 'free' | 'premium' | null
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          selected_charity?: string | null
          membership_status?: 'free' | 'premium' | null
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          selected_charity?: string | null
          membership_status?: 'free' | 'premium' | null
          stripe_customer_id?: string | null
        }
      }
      charities: {
        Row: {
          id: string
          name: string
          description: string
          website: string
          logo_url: string | null
          category: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          website: string
          logo_url?: string | null
          category: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          website?: string
          logo_url?: string | null
          category?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          created_at: string
          stripe_subscription_id: string
          status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing'
          price_id: string
          cancel_at: string | null
          cancel_at_period_end: boolean
          ended_at: string | null
          current_period_end: string
          current_period_start: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          stripe_subscription_id: string
          status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing'
          price_id: string
          cancel_at?: string | null
          cancel_at_period_end?: boolean
          ended_at?: string | null
          current_period_end: string
          current_period_start: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          stripe_subscription_id?: string
          status?: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing'
          price_id?: string
          cancel_at?: string | null
          cancel_at_period_end?: boolean
          ended_at?: string | null
          current_period_end?: string
          current_period_start?: string
        }
      }
    }
  }
}