export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_participants: {
        Row: {
          competition_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_participants_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_submissions: {
        Row: {
          competition_id: string
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_submissions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          entry_fee: number | null
          id: string
          judges: string[] | null
          prizes: Json
          rules: string[] | null
          start_date: string
          status: string
          submission_deadline: string
          theme: string
          title: string
          updated_at: string
          voting_deadline: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          entry_fee?: number | null
          id?: string
          judges?: string[] | null
          prizes?: Json
          rules?: string[] | null
          start_date: string
          status?: string
          submission_deadline: string
          theme: string
          title: string
          updated_at?: string
          voting_deadline: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          entry_fee?: number | null
          id?: string
          judges?: string[] | null
          prizes?: Json
          rules?: string[] | null
          start_date?: string
          status?: string
          submission_deadline?: string
          theme?: string
          title?: string
          updated_at?: string
          voting_deadline?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          addressee_id: string
          created_at: string
          id: number
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: never
          requester_id: string
          status: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: never
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          client_id: string
          created_at: string
          end_date: string | null
          gig_id: number
          id: string
          professional_id: string
          proposal_id: number
          start_date: string | null
          status: string
          terms: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          end_date?: string | null
          gig_id: number
          id?: string
          professional_id: string
          proposal_id: number
          start_date?: string | null
          status?: string
          terms?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          end_date?: string | null
          gig_id?: number
          id?: string
          professional_id?: string
          proposal_id?: number
          start_date?: string | null
          status?: string
          terms?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: true
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_group_chat: boolean
          last_message_at: string | null
          name: string | null
          project_id: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_group_chat?: boolean
          last_message_at?: string | null
          name?: string | null
          project_id?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_group_chat?: boolean
          last_message_at?: string | null
          name?: string | null
          project_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_transactions: {
        Row: {
          amount: number
          created_at: string
          dispute_reason: string | null
          gig_id: number
          id: string
          released_at: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          dispute_reason?: string | null
          gig_id: number
          id?: string
          released_at?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          dispute_reason?: string | null
          gig_id?: number
          id?: string
          released_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "escrow_transactions_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number
          created_at: string
          date: string
          description: string | null
          id: string
          image_url: string | null
          is_free: boolean
          location: string
          organizer_id: string
          price: number | null
          status: string
          tags: string[] | null
          time: string
          title: string
          type: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean
          location: string
          organizer_id: string
          price?: number | null
          status?: string
          tags?: string[] | null
          time: string
          title: string
          type: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean
          location?: string
          organizer_id?: string
          price?: number | null
          status?: string
          tags?: string[] | null
          time?: string
          title?: string
          type?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      gigs: {
        Row: {
          budget: number | null
          category: string | null
          client_id: string | null
          created_at: string
          deadline: string | null
          description: string | null
          escrow_status: string | null
          id: number
          location: string | null
          professional_id: string | null
          required_skills: string[] | null
          skills_required: string[] | null
          status: string | null
          title: string
          type: Database["public"]["Enums"]["gig_type"] | null
          user_id: string
        }
        Insert: {
          budget?: number | null
          category?: string | null
          client_id?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          escrow_status?: string | null
          id?: never
          location?: string | null
          professional_id?: string | null
          required_skills?: string[] | null
          skills_required?: string[] | null
          status?: string | null
          title: string
          type?: Database["public"]["Enums"]["gig_type"] | null
          user_id: string
        }
        Update: {
          budget?: number | null
          category?: string | null
          client_id?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          escrow_status?: string | null
          id?: never
          location?: string | null
          professional_id?: string | null
          required_skills?: string[] | null
          skills_required?: string[] | null
          status?: string | null
          title?: string
          type?: Database["public"]["Enums"]["gig_type"] | null
          user_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_uploads: {
        Row: {
          created_at: string
          duration: number | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          metadata: Json | null
          mime_type: string
          updated_at: string
          upload_status: string
          user_id: string
          waveform_data: Json | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          metadata?: Json | null
          mime_type: string
          updated_at?: string
          upload_status?: string
          user_id: string
          waveform_data?: Json | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          metadata?: Json | null
          mime_type?: string
          updated_at?: string
          upload_status?: string
          user_id?: string
          waveform_data?: Json | null
        }
        Relationships: []
      }
      mentions: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          mentioned_user_id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          mentioned_user_id: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          mentioned_user_id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          file_metadata: Json | null
          file_path: string | null
          id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          file_metadata?: Json | null
          file_path?: string | null
          id?: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          file_metadata?: Json | null
          file_path?: string | null
          id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          amount: number
          contract_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          contract_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          contract_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: number
          is_read: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: number
          is_read?: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: number
          is_read?: boolean
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      portfolio_media: {
        Row: {
          created_at: string
          description: string | null
          file_type: string
          file_url: string
          id: number
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_type: string
          file_url: string
          id?: number
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_type?: string
          file_url?: string
          id?: number
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_media_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          media_type: string | null
          media_url: string | null
          media_urls: string[] | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          media_urls?: string[] | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          media_urls?: string[] | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          collaboration_styles: string[] | null
          experience: string | null
          full_name: string | null
          genres: string[] | null
          github_url: string | null
          id: string
          instagram_url: string | null
          is_online: boolean | null
          is_verified: boolean | null
          level: number | null
          linkedin_url: string | null
          location: string | null
          portfolio: Json | null
          portfolio_url: string | null
          professional_roles: string[] | null
          rating: number | null
          reviews: number | null
          role: string | null
          skills: string[] | null
          software_proficiencies: string[] | null
          specialization: string | null
          tags: string[] | null
          twitter_url: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          collaboration_styles?: string[] | null
          experience?: string | null
          full_name?: string | null
          genres?: string[] | null
          github_url?: string | null
          id: string
          instagram_url?: string | null
          is_online?: boolean | null
          is_verified?: boolean | null
          level?: number | null
          linkedin_url?: string | null
          location?: string | null
          portfolio?: Json | null
          portfolio_url?: string | null
          professional_roles?: string[] | null
          rating?: number | null
          reviews?: number | null
          role?: string | null
          skills?: string[] | null
          software_proficiencies?: string[] | null
          specialization?: string | null
          tags?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          collaboration_styles?: string[] | null
          experience?: string | null
          full_name?: string | null
          genres?: string[] | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          is_online?: boolean | null
          is_verified?: boolean | null
          level?: number | null
          linkedin_url?: string | null
          location?: string | null
          portfolio?: Json | null
          portfolio_url?: string | null
          professional_roles?: string[] | null
          rating?: number | null
          reviews?: number | null
          role?: string | null
          skills?: string[] | null
          software_proficiencies?: string[] | null
          specialization?: string | null
          tags?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      project_collaborators: {
        Row: {
          created_at: string
          id: number
          project_id: number
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          project_id: number
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          project_id?: number
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_collaborators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_comments: {
        Row: {
          content: string
          created_at: string
          file_id: string | null
          id: string
          parent_comment_id: string | null
          position_data: Json | null
          project_id: number
          timestamp_ms: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_id?: string | null
          id?: string
          parent_comment_id?: string | null
          position_data?: Json | null
          project_id: number
          timestamp_ms?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_id?: string | null
          id?: string
          parent_comment_id?: string | null
          position_data?: Json | null
          project_id?: number
          timestamp_ms?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "project_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "project_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          created_at: string
          duration: number | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_current_version: boolean
          metadata: Json | null
          mime_type: string
          project_id: number
          updated_at: string
          user_id: string
          version_number: number
        }
        Insert: {
          created_at?: string
          duration?: number | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_current_version?: boolean
          metadata?: Json | null
          mime_type: string
          project_id: number
          updated_at?: string
          user_id: string
          version_number?: number
        }
        Update: {
          created_at?: string
          duration?: number | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_current_version?: boolean
          metadata?: Json | null
          mime_type?: string
          project_id?: number
          updated_at?: string
          user_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sessions: {
        Row: {
          created_at: string
          id: string
          last_activity: string
          project_id: number
          session_data: Json | null
          session_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity?: string
          project_id: number
          session_data?: Json | null
          session_type?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_activity?: string
          project_id?: number
          session_data?: Json | null
          session_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          assignee_id: string | null
          attachments: Json | null
          created_at: string
          creator_id: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          progress: number
          project_id: number
          status: string
          tags: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          attachments?: Json | null
          created_at?: string
          creator_id: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          progress?: number
          project_id: number
          status?: string
          tags?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          attachments?: Json | null
          created_at?: string
          creator_id?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          progress?: number
          project_id?: number
          status?: string
          tags?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_versions: {
        Row: {
          changes: Json | null
          created_at: string
          description: string | null
          file_snapshot: Json | null
          id: string
          is_current: boolean
          project_id: number
          user_id: string
          version_name: string
        }
        Insert: {
          changes?: Json | null
          created_at?: string
          description?: string | null
          file_snapshot?: Json | null
          id?: string
          is_current?: boolean
          project_id: number
          user_id: string
          version_name: string
        }
        Update: {
          changes?: Json | null
          created_at?: string
          description?: string | null
          file_snapshot?: Json | null
          id?: string
          is_current?: boolean
          project_id?: number
          user_id?: string
          version_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          artist: string
          audio_path: string | null
          created_at: string
          duration: string | null
          genre: string | null
          id: number
          is_collaborative: boolean | null
          likes: number | null
          plays: number | null
          role: string
          thumbnail: string | null
          title: string
          user_id: string
        }
        Insert: {
          artist: string
          audio_path?: string | null
          created_at?: string
          duration?: string | null
          genre?: string | null
          id?: never
          is_collaborative?: boolean | null
          likes?: number | null
          plays?: number | null
          role: string
          thumbnail?: string | null
          title: string
          user_id: string
        }
        Update: {
          artist?: string
          audio_path?: string | null
          created_at?: string
          duration?: string | null
          genre?: string | null
          id?: never
          is_collaborative?: boolean | null
          likes?: number | null
          plays?: number | null
          role?: string
          thumbnail?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string
          gig_id: number
          id: number
          message: string | null
          rate: number | null
          status: Database["public"]["Enums"]["proposal_status"]
          timeline: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          gig_id: number
          id?: never
          message?: string | null
          rate?: number | null
          status?: Database["public"]["Enums"]["proposal_status"]
          timeline?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          gig_id?: number
          id?: never
          message?: string | null
          rate?: number | null
          status?: Database["public"]["Enums"]["proposal_status"]
          timeline?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          contract_id: string
          created_at: string
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          contract_id: string
          created_at?: string
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          contract_id?: string
          created_at?: string
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: number
          recipient_id: string
          status: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: number
          recipient_id: string
          status?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: number
          recipient_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_member_of_conversation: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: boolean
      }
      is_party_to_contract: {
        Args: { p_contract_id: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      gig_type:
        | "studio_session"
        | "live_performance"
        | "songwriting"
        | "mixing_mastering"
        | "other"
      notification_type:
        | "connection_request"
        | "proposal_accepted"
        | "proposal_rejected"
      proposal_status: "pending" | "accepted" | "rejected"
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
      gig_type: [
        "studio_session",
        "live_performance",
        "songwriting",
        "mixing_mastering",
        "other",
      ],
      notification_type: [
        "connection_request",
        "proposal_accepted",
        "proposal_rejected",
      ],
      proposal_status: ["pending", "accepted", "rejected"],
    },
  },
} as const
