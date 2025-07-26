
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Project, Post } from '@/types';
import { toast } from 'sonner';

interface SearchResults {
  professionals: Profile[];
  projects: Project[];
  posts: Post[];
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({
    professionals: [],
    projects: [],
    posts: []
  });
  const [searching, setSearching] = useState(false);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ professionals: [], projects: [], posts: [] });
      return;
    }

    setSearching(true);
    
    try {
      const searchTerm = `%${query}%`;

      // Search professionals
      const { data: professionals, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.${searchTerm},role.ilike.${searchTerm},bio.ilike.${searchTerm}`);

      if (profError) throw profError;

      // Search projects
      const { data: projects, error: projError } = await supabase
        .from('projects')
        .select('*')
        .or(`title.ilike.${searchTerm},artist.ilike.${searchTerm},genre.ilike.${searchTerm}`);

      if (projError) throw projError;

      // Search posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .ilike('content', searchTerm);

      if (postsError) throw postsError;

      setSearchResults({
        professionals: professionals || [],
        projects: projects || [],
        posts: posts || []
      });

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    performSearch(query);
  }, [performSearch]);

  return {
    searchQuery,
    searchResults,
    searching,
    handleSearch,
    setSearchQuery
  };
};
