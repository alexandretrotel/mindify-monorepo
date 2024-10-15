export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      authors: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          mindify_ai: boolean;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          mindify_ai?: boolean;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          mindify_ai?: boolean;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      chapters: {
        Row: {
          created_at: string;
          id: number;
          mindify_ai: boolean | null;
          texts: string[];
          titles: string[];
        };
        Insert: {
          created_at?: string;
          id?: number;
          mindify_ai?: boolean | null;
          texts: string[];
          titles: string[];
        };
        Update: {
          created_at?: string;
          id?: number;
          mindify_ai?: boolean | null;
          texts?: string[];
          titles?: string[];
        };
        Relationships: [];
      };
      friends: {
        Row: {
          created_at: string;
          friend_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          friend_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          friend_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      leaderboard: {
        Row: {
          created_at: string;
          updated_at: string | null;
          user_id: string;
          xp: number;
        };
        Insert: {
          created_at?: string;
          updated_at?: string | null;
          user_id: string;
          xp: number;
        };
        Update: {
          created_at?: string;
          updated_at?: string | null;
          user_id?: string;
          xp?: number;
        };
        Relationships: [];
      };
      learning_sessions: {
        Row: {
          created_at: string;
          id: number;
          total_length: number;
          total_time: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          total_length: number;
          total_time: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          total_length?: number;
          total_time?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      liked_minds: {
        Row: {
          created_at: string;
          mind_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          mind_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          mind_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "liked_minds_mind_id_fkey";
            columns: ["mind_id"];
            isOneToOne: false;
            referencedRelation: "minds";
            referencedColumns: ["id"];
          }
        ];
      };
      minds: {
        Row: {
          created_at: string;
          id: number;
          mindify_ai: boolean | null;
          question: string | null;
          summary_id: number | null;
          text: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          mindify_ai?: boolean | null;
          question?: string | null;
          summary_id?: number | null;
          text: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          mindify_ai?: boolean | null;
          question?: string | null;
          summary_id?: number | null;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "minds_summary_id_fkey";
            columns: ["summary_id"];
            isOneToOne: false;
            referencedRelation: "summaries";
            referencedColumns: ["id"];
          }
        ];
      };
      minds_in_playlists: {
        Row: {
          created_at: string;
          mind_id: number;
          playlist_id: number;
        };
        Insert: {
          created_at?: string;
          mind_id?: number;
          playlist_id: number;
        };
        Update: {
          created_at?: string;
          mind_id?: number;
          playlist_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "minds_in_playlists_mind_id_fkey";
            columns: ["mind_id"];
            isOneToOne: false;
            referencedRelation: "minds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "minds_in_playlists_playlist_id_fkey";
            columns: ["playlist_id"];
            isOneToOne: false;
            referencedRelation: "playlists";
            referencedColumns: ["id"];
          }
        ];
      };
      minds_in_users_playlists: {
        Row: {
          created_at: string;
          mind_id: number;
          user_playlist_id: number;
        };
        Insert: {
          created_at?: string;
          mind_id: number;
          user_playlist_id: number;
        };
        Update: {
          created_at?: string;
          mind_id?: number;
          user_playlist_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "minds_in_users_playlists_mind_id_fkey";
            columns: ["mind_id"];
            isOneToOne: false;
            referencedRelation: "minds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "minds_in_users_playlists_user_playlist_id_fkey";
            columns: ["user_playlist_id"];
            isOneToOne: false;
            referencedRelation: "users_playlists";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          friend_id: string | null;
          id: number;
          is_read: boolean;
          message: string;
          mind_id: number | null;
          summary_id: number | null;
          title: string;
          type: Database["public"]["Enums"]["notifications_type"];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          friend_id?: string | null;
          id?: number;
          is_read?: boolean;
          message: string;
          mind_id?: number | null;
          summary_id?: number | null;
          title: string;
          type: Database["public"]["Enums"]["notifications_type"];
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          friend_id?: string | null;
          id?: number;
          is_read?: boolean;
          message?: string;
          mind_id?: number | null;
          summary_id?: number | null;
          title?: string;
          type?: Database["public"]["Enums"]["notifications_type"];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_mind_id_fkey";
            columns: ["mind_id"];
            isOneToOne: false;
            referencedRelation: "minds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_summary_id_fkey";
            columns: ["summary_id"];
            isOneToOne: false;
            referencedRelation: "summaries";
            referencedColumns: ["id"];
          }
        ];
      };
      onboarding: {
        Row: {
          created_at: string;
          id: number;
          onboarded: boolean;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          onboarded?: boolean;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          onboarded?: boolean;
          user_id?: string;
        };
        Relationships: [];
      };
      playlists: {
        Row: {
          created_at: string;
          id: number;
          slug: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          slug: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      read_summaries: {
        Row: {
          created_at: string;
          read_at: string;
          summary_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          read_at?: string;
          summary_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          read_at?: string;
          summary_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "summary_reads_summary_id_fkey";
            columns: ["summary_id"];
            isOneToOne: false;
            referencedRelation: "summaries";
            referencedColumns: ["id"];
          }
        ];
      };
      saved_minds: {
        Row: {
          created_at: string;
          mind_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          mind_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          mind_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_minds_mind_id_fkey";
            columns: ["mind_id"];
            isOneToOne: false;
            referencedRelation: "minds";
            referencedColumns: ["id"];
          }
        ];
      };
      saved_summaries: {
        Row: {
          created_at: string;
          summary_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          summary_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          summary_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_summaries_summary_id_fkey";
            columns: ["summary_id"];
            isOneToOne: false;
            referencedRelation: "summaries";
            referencedColumns: ["id"];
          }
        ];
      };
      srs_data: {
        Row: {
          created_at: string;
          difficulty: number;
          due: string;
          elapsed_days: number;
          lapses: number;
          last_review: string | null;
          mind_id: number;
          reps: number;
          scheduled_days: number;
          stability: number;
          state: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          difficulty: number;
          due: string;
          elapsed_days: number;
          lapses: number;
          last_review?: string | null;
          mind_id?: number;
          reps: number;
          scheduled_days: number;
          stability: number;
          state: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          difficulty?: number;
          due?: string;
          elapsed_days?: number;
          lapses?: number;
          last_review?: string | null;
          mind_id?: number;
          reps?: number;
          scheduled_days?: number;
          stability?: number;
          state?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "srs_data_mind_id_fkey";
            columns: ["mind_id"];
            isOneToOne: false;
            referencedRelation: "minds";
            referencedColumns: ["id"];
          }
        ];
      };
      summaries: {
        Row: {
          author_id: number;
          chapters_id: number | null;
          created_at: string;
          id: number;
          image_url: string | null;
          mindify_ai: boolean | null;
          reading_time: number | null;
          slug: string;
          source_type: Database["public"]["Enums"]["source"];
          source_url: string | null;
          title: string;
          topic_id: number;
        };
        Insert: {
          author_id: number;
          chapters_id?: number | null;
          created_at?: string;
          id?: number;
          image_url?: string | null;
          mindify_ai?: boolean | null;
          reading_time?: number | null;
          slug: string;
          source_type: Database["public"]["Enums"]["source"];
          source_url?: string | null;
          title: string;
          topic_id: number;
        };
        Update: {
          author_id?: number;
          chapters_id?: number | null;
          created_at?: string;
          id?: number;
          image_url?: string | null;
          mindify_ai?: boolean | null;
          reading_time?: number | null;
          slug?: string;
          source_type?: Database["public"]["Enums"]["source"];
          source_url?: string | null;
          title?: string;
          topic_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "summaries_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "summaries_chapters_id_fkey";
            columns: ["chapters_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "summaries_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "topics";
            referencedColumns: ["id"];
          }
        ];
      };
      summary_ratings: {
        Row: {
          created_at: string;
          rating: number;
          summary_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          rating: number;
          summary_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          rating?: number;
          summary_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "summary_ratings_summary_id_fkey";
            columns: ["summary_id"];
            isOneToOne: false;
            referencedRelation: "summaries";
            referencedColumns: ["id"];
          }
        ];
      };
      summary_requests: {
        Row: {
          author: string;
          created_at: string;
          id: number;
          source: Database["public"]["Enums"]["source"];
          title: string;
          topic_id: number;
          user_id: string | null;
          validated: boolean;
        };
        Insert: {
          author: string;
          created_at?: string;
          id?: number;
          source: Database["public"]["Enums"]["source"];
          title: string;
          topic_id: number;
          user_id?: string | null;
          validated?: boolean;
        };
        Update: {
          author?: string;
          created_at?: string;
          id?: number;
          source?: Database["public"]["Enums"]["source"];
          title?: string;
          topic_id?: number;
          user_id?: string | null;
          validated?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "summary_requests_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "topics";
            referencedColumns: ["id"];
          }
        ];
      };
      support_bugs: {
        Row: {
          bug_type: Database["public"]["Enums"]["bugs"];
          created_at: string;
          description: string;
          id: number;
          status: Database["public"]["Enums"]["support_status"];
          title: string;
          user_id: string;
        };
        Insert: {
          bug_type: Database["public"]["Enums"]["bugs"];
          created_at?: string;
          description: string;
          id?: number;
          status?: Database["public"]["Enums"]["support_status"];
          title: string;
          user_id: string;
        };
        Update: {
          bug_type?: Database["public"]["Enums"]["bugs"];
          created_at?: string;
          description?: string;
          id?: number;
          status?: Database["public"]["Enums"]["support_status"];
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      support_features: {
        Row: {
          created_at: string;
          description: string;
          feature_type: Database["public"]["Enums"]["features"];
          id: number;
          status: Database["public"]["Enums"]["support_status"];
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          feature_type: Database["public"]["Enums"]["features"];
          id?: number;
          status?: Database["public"]["Enums"]["support_status"];
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          feature_type?: Database["public"]["Enums"]["features"];
          id?: number;
          status?: Database["public"]["Enums"]["support_status"];
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      topics: {
        Row: {
          black_icon: string | null;
          created_at: string;
          emoji: string | null;
          id: number;
          name: string;
          slug: string;
          white_icon: string | null;
        };
        Insert: {
          black_icon?: string | null;
          created_at?: string;
          emoji?: string | null;
          id?: number;
          name: string;
          slug: string;
          white_icon?: string | null;
        };
        Update: {
          black_icon?: string | null;
          created_at?: string;
          emoji?: string | null;
          id?: number;
          name?: string;
          slug?: string;
          white_icon?: string | null;
        };
        Relationships: [];
      };
      user_topics: {
        Row: {
          created_at: string;
          topic_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          topic_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          topic_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_topics_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "topics";
            referencedColumns: ["id"];
          }
        ];
      };
      users_playlists: {
        Row: {
          created_at: string;
          id: number;
          slug: string;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          slug: string;
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          slug?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      clean_unused_chapters: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      delete_user: {
        Args: {
          user_id: string;
        };
        Returns: undefined;
      };
      fetch_user_metadata: {
        Args: {
          user_id: string;
        };
        Returns: Json;
      };
      get_friends_metadata: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          friend_id: string;
          created_at: string;
          raw_user_meta_data: Json;
        }[];
      };
      get_leaderboard: {
        Args: Record<PropertyKey, never>;
        Returns: {
          user_id: string;
          name: string;
          metadata: Json;
          xp: number;
          level: number;
          xp_for_next_level: number;
          progression: number;
        }[];
      };
      get_user_level: {
        Args: {
          input_user_id: string;
        };
        Returns: {
          user_id: string;
          xp: number;
          level: number;
          xp_for_next_level: number;
          xp_of_current_level: number;
          progression: number;
        }[];
      };
      notify_due_minds: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      search_users: {
        Args: {
          search_query: string;
        };
        Returns: {
          id: string;
          name: string;
          avatar: string;
        }[];
      };
      send_pending_friend_request_notifications: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      update_leaderboard: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      bugs: "display" | "features" | "performance" | "misc";
      features: "summaries" | "social" | "statistics" | "notifications" | "security" | "misc";
      notifications_type:
        | "flashcards_due"
        | "new_summary"
        | "friend_request"
        | "friend_read_summary"
        | "friend_saved_summary"
        | "friend_request_accepted";
      plan: "free" | "pro";
      source: "article" | "podcast" | "video" | "book";
      support_status: "not_started" | "in_progress" | "finished";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
