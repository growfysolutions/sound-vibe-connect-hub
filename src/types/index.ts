
import { Database } from '@/integrations/supabase/types';

// Base types derived directly from the database schema
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Gig = Database['public']['Tables']['gigs']['Row'];
export type Proposal = Database['public']['Tables']['proposals']['Row'];
export type Contract = Database['public']['Tables']['contracts']['Row'];
export type Milestone = Database['public']['Tables']['milestones']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type BaseMessage = Database['public']['Tables']['messages']['Row'];
export type BaseConversation = Database['public']['Tables']['conversations']['Row'];
export type Connection = Database['public']['Tables']['connections']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];

// Import the unified Message type
export { Message } from './message';

export type Conversation = BaseConversation & {
  conversation_participants: {
    user_id: string;
    profiles: Profile;
  }[];
  messages?: Message[];
};

// A post with the author's profile
export type PostWithProfile = Post & {
  profiles: Profile | null;
};

// A comment with the author's profile
export type CommentWithProfile = Comment & {
  profiles: Profile | null;
};

// A contract with the associated gig, client, and professional profiles
export type ContractWithDetails = Contract & {
  gigs: { title: string } | null;
  client: Profile;
  professional: Profile;
};

// A review with the reviewer's profile
export type ReviewWithReviewer = Review & {
  reviewer: Profile;
};

// Extended profile type with additional computed properties
export type ExtendedProfile = Profile & {
  xp?: number;
};

// Connection with full profile data
export type ConnectionWithProfiles = Connection & {
  requester: Profile;
  addressee: Profile;
};
