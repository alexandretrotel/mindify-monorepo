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
      authors: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          created_at: string
          id: number
          texts: string[]
          titles: string[]
        }
        Insert: {
          created_at?: string
          id?: number
          texts: string[]
          titles: string[]
        }
        Update: {
          created_at?: string
          id?: number
          texts?: string[]
          titles?: string[]
        }
        Relationships: []
      }
      friends: {
        Row: {
          created_at: string
          friend_id: string
          status: Database["public"]["Enums"]["friends_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          status: Database["public"]["Enums"]["friends_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          status?: Database["public"]["Enums"]["friends_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_friends_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      minds: {
        Row: {
          created_at: string
          id: number
          summary_id: number
          text: string
        }
        Insert: {
          created_at?: string
          id?: number
          summary_id: number
          text: string
        }
        Update: {
          created_at?: string
          id?: number
          summary_id?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "minds_summary_id_fkey"
            columns: ["summary_id"]
            isOneToOne: false
            referencedRelation: "summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      read_summaries: {
        Row: {
          created_at: string
          read_at: string
          summary_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          read_at?: string
          summary_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          read_at?: string
          summary_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "summary_reads_summary_id_fkey"
            columns: ["summary_id"]
            isOneToOne: false
            referencedRelation: "summaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_minds: {
        Row: {
          created_at: string
          mind_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          mind_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          mind_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_minds_mind_id_fkey"
            columns: ["mind_id"]
            isOneToOne: false
            referencedRelation: "minds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_minds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_summaries: {
        Row: {
          created_at: string
          summary_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          summary_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          summary_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_library_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_summaries_summary_id_fkey"
            columns: ["summary_id"]
            isOneToOne: false
            referencedRelation: "summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      summaries: {
        Row: {
          author_id: number
          chapters_id: number | null
          conclusion: string
          created_at: string
          id: number
          image_url: string | null
          introduction: string
          reading_time: number | null
          slug: string
          source_type: Database["public"]["Enums"]["source"]
          source_url: string | null
          title: string
          topic_id: number
        }
        Insert: {
          author_id: number
          chapters_id?: number | null
          conclusion: string
          created_at?: string
          id?: number
          image_url?: string | null
          introduction: string
          reading_time?: number | null
          slug: string
          source_type: Database["public"]["Enums"]["source"]
          source_url?: string | null
          title: string
          topic_id: number
        }
        Update: {
          author_id?: number
          chapters_id?: number | null
          conclusion?: string
          created_at?: string
          id?: number
          image_url?: string | null
          introduction?: string
          reading_time?: number | null
          slug?: string
          source_type?: Database["public"]["Enums"]["source"]
          source_url?: string | null
          title?: string
          topic_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "summaries_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "summaries_chapters_id_fkey"
            columns: ["chapters_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "summaries_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      summaries_ratings: {
        Row: {
          created_at: string
          rating: number
          summary_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          rating: number
          summary_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          rating?: number
          summary_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "summary_ratings_summary_id_fkey"
            columns: ["summary_id"]
            isOneToOne: false
            referencedRelation: "summaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          black_icon: string | null
          created_at: string
          id: number
          name: string
          slug: string
          white_icon: string | null
        }
        Insert: {
          black_icon?: string | null
          created_at?: string
          id?: number
          name: string
          slug: string
          white_icon?: string | null
        }
        Update: {
          black_icon?: string | null
          created_at?: string
          id?: number
          name?: string
          slug?: string
          white_icon?: string | null
        }
        Relationships: []
      }
      user_topics: {
        Row: {
          created_at: string
          topic_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          topic_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          topic_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_topics_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      friends_status: "pending" | "accepted" | "blocked"
      plan: "free" | "pro"
      source: "article" | "podcast" | "video" | "book"
      status: "completed" | "saved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
