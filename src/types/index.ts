/**
 * This file contains custom type definitions for the application.
 */

// Defines the structure for a user's profile
export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  // Add other profile fields here as needed
};

// Defines the structure for a single post
export type Post = {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
};

// Combines a Post with its author's Profile for easy use in components
export type PostWithProfile = Post & {
  profiles: Profile | null;
};
