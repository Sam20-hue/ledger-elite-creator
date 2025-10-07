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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_payment_accounts: {
        Row: {
          account_details: Json
          account_name: string
          account_type: string
          created_at: string
          created_by: string | null
          currency: string
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          account_details: Json
          account_name: string
          account_type: string
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          account_details?: Json
          account_name?: string
          account_type?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          balance: number | null
          bank_name: string
          created_at: string | null
          currency: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          balance?: number | null
          bank_name: string
          created_at?: string | null
          currency: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          balance?: number | null
          bank_name?: string
          created_at?: string | null
          currency?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_id: string | null
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string
          status: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          reason: string | null
          start_date: string
          status: string | null
          type: string
          updated_at: string | null
          urgency: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
          status?: string | null
          type: string
          updated_at?: string | null
          urgency?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          urgency?: string | null
          user_id?: string
        }
        Relationships: []
      }
      market_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          symbol: string
          target_value: number | null
          triggered_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          symbol: string
          target_value?: number | null
          triggered_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          symbol?: string
          target_value?: number | null
          triggered_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      online_users: {
        Row: {
          id: string
          last_seen: string | null
          page_route: string
          user_id: string
        }
        Insert: {
          id?: string
          last_seen?: string | null
          page_route: string
          user_id: string
        }
        Update: {
          id?: string
          last_seen?: string | null
          page_route?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          performance_percentage: number | null
          total_invested: number | null
          total_profit_loss: number | null
          total_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          performance_percentage?: number | null
          total_invested?: number | null
          total_profit_loss?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          performance_percentage?: number | null
          total_invested?: number | null
          total_profit_loss?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          avg_price: number
          created_at: string | null
          current_price: number
          id: string
          name: string
          portfolio_id: string
          profit_loss: number | null
          profit_loss_percentage: number | null
          sector: string | null
          shares: number
          symbol: string
          total_value: number
          updated_at: string | null
        }
        Insert: {
          avg_price: number
          created_at?: string | null
          current_price: number
          id?: string
          name: string
          portfolio_id: string
          profit_loss?: number | null
          profit_loss_percentage?: number | null
          sector?: string | null
          shares: number
          symbol: string
          total_value: number
          updated_at?: string | null
        }
        Update: {
          avg_price?: number
          created_at?: string | null
          current_price?: number
          id?: string
          name?: string
          portfolio_id?: string
          profit_loss?: number | null
          profit_loss_percentage?: number | null
          sector?: string | null
          shares?: number
          symbol?: string
          total_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_verified: boolean | null
          last_name: string | null
          phone: string | null
          profile_completed: boolean | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          profile_completed?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_name?: string | null
          phone?: string | null
          profile_completed?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transaction_approvals: {
        Row: {
          approval_token: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          expires_at: string
          id: string
          is_used: boolean
          transaction_id: string
        }
        Insert: {
          approval_token: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          expires_at: string
          id?: string
          is_used?: boolean
          transaction_id: string
        }
        Update: {
          approval_token?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_approvals_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_approvals_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          new_status: string | null
          old_status: string | null
          transaction_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_status?: string | null
          old_status?: string | null
          transaction_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_status?: string | null
          old_status?: string | null
          transaction_id?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          admin_approved: boolean | null
          amount: number
          created_at: string | null
          currency: string
          description: string | null
          id: string
          status: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_approved?: boolean | null
          amount: number
          created_at?: string | null
          currency: string
          description?: string | null
          id?: string
          status?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_approved?: boolean | null
          amount?: number
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_accounts: {
        Row: {
          balance_btc: number | null
          balance_eur: number | null
          balance_ksh: number | null
          balance_usd: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          total_earned: number | null
          total_invested: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance_btc?: number | null
          balance_eur?: number | null
          balance_ksh?: number | null
          balance_usd?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          total_earned?: number | null
          total_invested?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance_btc?: number | null
          balance_eur?: number | null
          balance_ksh?: number | null
          balance_usd?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          total_earned?: number | null
          total_invested?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_trading_experience: {
        Row: {
          created_at: string
          experience_level: string | null
          first_trade_date: string | null
          id: string
          losing_trades: number | null
          total_trades: number | null
          updated_at: string
          user_id: string
          winning_trades: number | null
        }
        Insert: {
          created_at?: string
          experience_level?: string | null
          first_trade_date?: string | null
          id?: string
          losing_trades?: number | null
          total_trades?: number | null
          updated_at?: string
          user_id: string
          winning_trades?: number | null
        }
        Update: {
          created_at?: string
          experience_level?: string | null
          first_trade_date?: string | null
          id?: string
          losing_trades?: number | null
          total_trades?: number | null
          updated_at?: string
          user_id?: string
          winning_trades?: number | null
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          created_at: string | null
          current_price: number
          id: string
          name: string
          price_change: number | null
          price_change_percentage: number | null
          symbol: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_price: number
          id?: string
          name: string
          price_change?: number | null
          price_change_percentage?: number | null
          symbol: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_price?: number
          id?: string
          name?: string
          price_change?: number | null
          price_change_percentage?: number | null
          symbol?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_online_users: {
        Row: {
          id: string | null
          last_seen: string | null
          page_route: string | null
          user_id: string | null
        }
        Insert: {
          id?: string | null
          last_seen?: string | null
          page_route?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string | null
          last_seen?: string | null
          page_route?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_view_online_users: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
