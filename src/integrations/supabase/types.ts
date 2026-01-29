export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      job_applications: {
        Row: {
          about: string | null
          created_at: string
          email: string
          id: string
          job_id: string
          job_title: string
          name: string
          phone: string
        }
        Insert: {
          about?: string | null
          created_at?: string
          email: string
          id?: string
          job_id: string
          job_title: string
          name: string
          phone: string
        }
        Update: {
          about?: string | null
          created_at?: string
          email?: string
          id?: string
          job_id?: string
          job_title?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          company: string | null
          created_at: string
          design_specs: Json
          email: string
          estimated_cost: number | null
          id: string
          listing_number: number
          name: string
          primary_voltage: number | null
          project_address: string | null
          quantity: number
          rated_power_kva: number | null
          secondary_voltage: number | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          design_specs: Json
          email: string
          estimated_cost?: number | null
          id?: string
          listing_number?: number
          name: string
          primary_voltage?: number | null
          project_address?: string | null
          quantity?: number
          rated_power_kva?: number | null
          secondary_voltage?: number | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          design_specs?: Json
          email?: string
          estimated_cost?: number | null
          id?: string
          listing_number?: number
          name?: string
          primary_voltage?: number | null
          project_address?: string | null
          quantity?: number
          rated_power_kva?: number | null
          secondary_voltage?: number | null
          status?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string | null
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id?: string | null
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          estimated_price: number | null
          id: string
          name: string
          phone: string | null
          product_interest: string | null
          project_details: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          estimated_price?: number | null
          id?: string
          name: string
          phone?: string | null
          product_interest?: string | null
          project_details?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          estimated_price?: number | null
          id?: string
          name?: string
          phone?: string | null
          product_interest?: string | null
          project_details?: string | null
        }
        Relationships: []
      }
      scrape_logs: {
        Row: {
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          items_added: number | null
          items_found: number | null
          items_updated: number | null
          source_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          items_added?: number | null
          items_found?: number | null
          items_updated?: number | null
          source_id?: string | null
          status: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          items_added?: number | null
          items_found?: number | null
          items_updated?: number | null
          source_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scrape_logs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "scrape_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      scrape_sources: {
        Row: {
          base_url: string
          created_at: string
          id: string
          is_active: boolean
          last_scraped: string | null
          name: string
          scrape_config: Json | null
          updated_at: string
        }
        Insert: {
          base_url: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_scraped?: string | null
          name: string
          scrape_config?: Json | null
          updated_at?: string
        }
        Update: {
          base_url?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_scraped?: string | null
          name?: string
          scrape_config?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      scraped_inventory: {
        Row: {
          capacity: string
          capacity_kva: number | null
          category: string
          created_at: string
          external_id: string | null
          feoc_compliant: boolean | null
          id: string
          is_hidden: boolean | null
          is_verified: boolean | null
          location: string | null
          manufacturer: string | null
          price: string | null
          price_numeric: number | null
          quantity: number | null
          raw_data: Json | null
          scraped_at: string
          source_id: string | null
          source_url: string | null
          type: string
          updated_at: string
          voltage: string | null
        }
        Insert: {
          capacity: string
          capacity_kva?: number | null
          category: string
          created_at?: string
          external_id?: string | null
          feoc_compliant?: boolean | null
          id?: string
          is_hidden?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          manufacturer?: string | null
          price?: string | null
          price_numeric?: number | null
          quantity?: number | null
          raw_data?: Json | null
          scraped_at?: string
          source_id?: string | null
          source_url?: string | null
          type: string
          updated_at?: string
          voltage?: string | null
        }
        Update: {
          capacity?: string
          capacity_kva?: number | null
          category?: string
          created_at?: string
          external_id?: string | null
          feoc_compliant?: boolean | null
          id?: string
          is_hidden?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          manufacturer?: string | null
          price?: string | null
          price_numeric?: number | null
          quantity?: number | null
          raw_data?: Json | null
          scraped_at?: string
          source_id?: string | null
          source_url?: string | null
          type?: string
          updated_at?: string
          voltage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scraped_inventory_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "scrape_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_responses: {
        Row: {
          bid_amount: number | null
          created_at: string
          decline_notes: string | null
          decline_reason: string | null
          id: string
          listing_id: string
          response_type: string
          user_id: string
        }
        Insert: {
          bid_amount?: number | null
          created_at?: string
          decline_notes?: string | null
          decline_reason?: string | null
          id?: string
          listing_id: string
          response_type: string
          user_id: string
        }
        Update: {
          bid_amount?: number | null
          created_at?: string
          decline_notes?: string | null
          decline_reason?: string | null
          id?: string
          listing_id?: string
          response_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_responses_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_responses_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings_supplier_view"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          task_id: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          blocked_by_id: string
          created_at: string
          id: string
          task_id: string
        }
        Insert: {
          blocked_by_id: string
          created_at?: string
          id?: string
          task_id: string
        }
        Update: {
          blocked_by_id?: string
          created_at?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_blocked_by_id_fkey"
            columns: ["blocked_by_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          owner_id: string | null
          position: number
          priority: Database["public"]["Enums"]["task_priority"]
          project_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          owner_id?: string | null
          position?: number
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          owner_id?: string | null
          position?: number
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          approved: boolean | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      marketplace_listings_supplier_view: {
        Row: {
          company: string | null
          created_at: string | null
          design_specs: Json | null
          email: string | null
          estimated_cost: number | null
          id: string | null
          listing_number: number | null
          name: string | null
          primary_voltage: number | null
          project_address: string | null
          quantity: number | null
          rated_power_kva: number | null
          secondary_voltage: number | null
          status: string | null
        }
        Insert: {
          company?: never
          created_at?: string | null
          design_specs?: Json | null
          email?: never
          estimated_cost?: number | null
          id?: string | null
          listing_number?: number | null
          name?: never
          primary_voltage?: number | null
          project_address?: never
          quantity?: number | null
          rated_power_kva?: number | null
          secondary_voltage?: number | null
          status?: string | null
        }
        Update: {
          company?: never
          created_at?: string | null
          design_specs?: Json | null
          email?: never
          estimated_cost?: number | null
          id?: string | null
          listing_number?: number | null
          name?: never
          primary_voltage?: number | null
          project_address?: never
          quantity?: number | null
          rated_power_kva?: number | null
          secondary_voltage?: number | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "supplier"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal"
        | "won"
        | "lost"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status:
        | "backlog"
        | "todo"
        | "in_progress"
        | "review"
        | "done"
        | "blocked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "supplier"],
      lead_status: ["new", "contacted", "qualified", "proposal", "won", "lost"],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: [
        "backlog",
        "todo",
        "in_progress",
        "review",
        "done",
        "blocked",
      ],
    },
  },
} as const
