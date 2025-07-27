
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

export const useMentions = () => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const createMention = useCallback(async (mentionedUserId: string, postId?: string, commentId?: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('mentions')
        .insert({
          user_id: user.id,
          mentioned_user_id: mentionedUserId,
          post_id: postId || null,
          comment_id: commentId || null
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating mention:', error);
      return false;
    }
  }, [user?.id]);

  const parseMentions = useCallback((text: string) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    
    return mentions;
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
    searchResults,
    isSearching,
    searchUsers,
    createMention,
    parseMentions,
    clearSearch
  };
};
