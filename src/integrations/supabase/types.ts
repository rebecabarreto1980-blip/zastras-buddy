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
      clientes: {
        Row: {
          codigo_cupom: string | null
          cpf: string | null
          cupom10_enviado: boolean
          data_cadastro: string
          data_compra: string | null
          data_cupom: string | null
          data_nascimento_crianca: string | null
          data_primeiro_contato: string | null
          email: string | null
          id: string
          nome_cliente: string
          nome_crianca: string | null
          observacoes: string | null
          primeiro_contato_feito: boolean
          produtos: string | null
          qtd_compras: number | null
          segmento: string | null
          telefone: string
          ultima_compra: string | null
          ultimo_contato: string | null
          valor_total_gasto: number | null
          vendedor_id: string | null
        }
        Insert: {
          codigo_cupom?: string | null
          cpf?: string | null
          cupom10_enviado?: boolean
          data_cadastro?: string
          data_compra?: string | null
          data_cupom?: string | null
          data_nascimento_crianca?: string | null
          data_primeiro_contato?: string | null
          email?: string | null
          id?: string
          nome_cliente: string
          nome_crianca?: string | null
          observacoes?: string | null
          primeiro_contato_feito?: boolean
          produtos?: string | null
          qtd_compras?: number | null
          segmento?: string | null
          telefone: string
          ultima_compra?: string | null
          ultimo_contato?: string | null
          valor_total_gasto?: number | null
          vendedor_id?: string | null
        }
        Update: {
          codigo_cupom?: string | null
          cpf?: string | null
          cupom10_enviado?: boolean
          data_cadastro?: string
          data_compra?: string | null
          data_cupom?: string | null
          data_nascimento_crianca?: string | null
          data_primeiro_contato?: string | null
          email?: string | null
          id?: string
          nome_cliente?: string
          nome_crianca?: string | null
          observacoes?: string | null
          primeiro_contato_feito?: boolean
          produtos?: string | null
          qtd_compras?: number | null
          segmento?: string | null
          telefone?: string
          ultima_compra?: string | null
          ultimo_contato?: string | null
          valor_total_gasto?: number | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      compras: {
        Row: {
          cliente_id: string
          created_at: string
          data_compra: string
          id: string
          nota_cupom: string | null
          produtos: string | null
          valor: number | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_compra: string
          id?: string
          nota_cupom?: string | null
          produtos?: string | null
          valor?: number | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_compra?: string
          id?: string
          nota_cupom?: string | null
          produtos?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_contatos: {
        Row: {
          cliente_id: string
          cupom_gerado: string | null
          data_contato: string
          id: string
          mensagem_enviada: string | null
          resposta_recebida: string | null
          tipo_contato: string
          vendedor_id: string | null
        }
        Insert: {
          cliente_id: string
          cupom_gerado?: string | null
          data_contato?: string
          id?: string
          mensagem_enviada?: string | null
          resposta_recebida?: string | null
          tipo_contato?: string
          vendedor_id?: string | null
        }
        Update: {
          cliente_id?: string
          cupom_gerado?: string | null
          data_contato?: string
          id?: string
          mensagem_enviada?: string | null
          resposta_recebida?: string | null
          tipo_contato?: string
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_contatos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_contatos_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      lembretes: {
        Row: {
          cliente_id: string
          data_lembrete: string
          id: string
          mensagem: string
          status: string
          tipo_lembrete: string
          vendedor_id: string | null
        }
        Insert: {
          cliente_id: string
          data_lembrete: string
          id?: string
          mensagem: string
          status?: string
          tipo_lembrete?: string
          vendedor_id?: string | null
        }
        Update: {
          cliente_id?: string
          data_lembrete?: string
          id?: string
          mensagem?: string
          status?: string
          tipo_lembrete?: string
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lembretes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lembretes_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      vendedores: {
        Row: {
          ativo: boolean
          auth_user_id: string | null
          data_cadastro: string
          email_auth: string | null
          id: string
          nome: string
          role: string
        }
        Insert: {
          ativo?: boolean
          auth_user_id?: string | null
          data_cadastro?: string
          email_auth?: string | null
          id?: string
          nome: string
          role?: string
        }
        Update: {
          ativo?: boolean
          auth_user_id?: string | null
          data_cadastro?: string
          email_auth?: string | null
          id?: string
          nome?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_vendedor_id: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
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
