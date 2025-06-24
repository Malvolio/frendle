export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      availabilities: {
        Row: {
          created_at: string | null
          hour_of_week: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hour_of_week: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          hour_of_week?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "availabilities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "system_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_profiles: {
        Row: {
          created_at: string | null
          id: string
          interests: Json
          timezone: string
        }
        Insert: {
          created_at?: string | null
          id: string
          interests?: Json
          timezone: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interests?: Json
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "system_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_profiles_timezone_fkey"
            columns: ["timezone"]
            isOneToOne: false
            referencedRelation: "timezones"
            referencedColumns: ["zone_name"]
          },
        ]
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          name: string | null
          selected_charity: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id: string
          name?: string | null
          selected_charity?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          selected_charity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "system_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      relationships: {
        Row: {
          guest_id: string
          guest_paused_until: string | null
          guest_rating: number | null
          host_id: string
          host_paused_until: string | null
          host_rating: number | null
          id: string
          next_match: string | null
          paused_until: string | null
          rating: number | null
        }
        Insert: {
          guest_id: string
          guest_paused_until?: string | null
          guest_rating?: number | null
          host_id: string
          host_paused_until?: string | null
          host_rating?: number | null
          id?: string
          next_match?: string | null
          paused_until?: string | null
          rating?: number | null
        }
        Update: {
          guest_id?: string
          guest_paused_until?: string | null
          guest_rating?: number | null
          host_id?: string
          host_paused_until?: string | null
          host_rating?: number | null
          id?: string
          next_match?: string | null
          paused_until?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "relationships_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "system_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "system_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          guest_confirmed: string | null
          guest_id: string
          host_confirmed: string | null
          host_id: string
          id: string
          room_id: string
          scheduled_for: string
          session_status: Database["public"]["Enums"]["session_status_enum"]
        }
        Insert: {
          created_at?: string | null
          guest_confirmed?: string | null
          guest_id: string
          host_confirmed?: string | null
          host_id: string
          id?: string
          room_id?: string
          scheduled_for?: string
          session_status?: Database["public"]["Enums"]["session_status_enum"]
        }
        Update: {
          created_at?: string | null
          guest_confirmed?: string | null
          guest_id?: string
          host_confirmed?: string | null
          host_id?: string
          id?: string
          room_id?: string
          scheduled_for?: string
          session_status?: Database["public"]["Enums"]["session_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "sessions_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "system_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "system_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_profiles: {
        Row: {
          created_at: string | null
          id: string
          last_matched: string | null
          membership_status:
            | Database["public"]["Enums"]["membership_status_enum"]
            | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          last_matched?: string | null
          membership_status?:
            | Database["public"]["Enums"]["membership_status_enum"]
            | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_matched?: string | null
          membership_status?:
            | Database["public"]["Enums"]["membership_status_enum"]
            | null
          name?: string | null
        }
        Relationships: []
      }
      timezones: {
        Row: {
          offset_hours: number
          zone_name: string
        }
        Insert: {
          offset_hours: number
          zone_name: string
        }
        Update: {
          offset_hours?: number
          zone_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_matching_partners: {
        Args: { arg_id: string }
        Returns: {
          partner_id: string
          partner_timezone: string
          name: string
          email: string
        }[]
      }
    }
    Enums: {
      membership_status_enum:
        | "unpaid"
        | "good"
        | "suspended"
        | "banned"
        | "paused"
      session_status_enum:
        | "scheduled"
        | "cancelled_by_host"
        | "cancelled_by_guest"
        | "rated"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      membership_status_enum: [
        "unpaid",
        "good",
        "suspended",
        "banned",
        "paused",
      ],
      session_status_enum: [
        "scheduled",
        "cancelled_by_host",
        "cancelled_by_guest",
        "rated",
      ],
    },
  },
} as const
