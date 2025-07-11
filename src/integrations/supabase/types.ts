export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          id: string;
          created_at: string;
          content: string;
          user_id: string;
          post_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          content: string;
          user_id: string;
          post_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          content?: string;
          user_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      connections: {
        Row: {
          id: number;
          created_at: string;
          requester_id: string;
          addressee_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          requester_id: string;
          addressee_id: string;
          status: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          requester_id?: string;
          addressee_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "connections_addressee_id_fkey";
            columns: ["addressee_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "connections_requester_id_fkey";
            columns: ["requester_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      likes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          post_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          post_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey";
            columns: ["post_id"];
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          id: string;
          created_at: string;
          content: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          content: string;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          content?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          specialization: string | null;
          role: string | null;
          experience: string | null;
          skills: string[] | null;
          portfolio_url: string | null;
          bio: string | null;
          location: string | null;
          rating: number | null;
          reviews: number | null;
          level: number | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          specialization?: string | null;
          role?: string | null;
          experience?: string | null;
          skills?: string[] | null;
          portfolio_url?: string | null;
          bio?: string | null;
          location?: string | null;
          rating?: number | null;
          reviews?: number | null;
          level?: number | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          specialization?: string | null;
          role?: string | null;
          experience?: string | null;
          skills?: string[] | null;
          portfolio_url?: string | null;
          bio?: string | null;
          location?: string | null;
          rating?: number | null;
          reviews?: number | null;
          level?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      project_collaborators: {
        Row: {
          project_id: number;
          user_id: string;
          role: string;
        };
        Insert: {
          project_id: number;
          user_id: string;
          role: string;
        };
        Update: {
          project_id?: number;
          user_id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_collaborators_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_collaborators_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          id: number;
          created_at: string;
          title: string;
          user_id: string;
          artist: string;
          role: string;
          is_collaborative: boolean | null;
          genre: string | null;
          thumbnail: string | null;
          duration: string | null;
          plays: number | null;
          likes: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          title: string;
          user_id: string;
          artist: string;
          role: string;
          is_collaborative?: boolean | null;
          genre?: string | null;
          thumbnail?: string | null;
          duration?: string | null;
          plays?: number | null;
          likes?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          title?: string;
          user_id?: string;
          artist?: string;
          role?: string;
          is_collaborative?: boolean | null;
          genre?: string | null;
          thumbnail?: string | null;
          duration?: string | null;
          plays?: number | null;
          likes?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
