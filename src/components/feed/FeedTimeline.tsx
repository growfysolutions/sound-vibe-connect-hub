
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import PostCard from './PostCard';
import CreatePostForm from './CreatePostForm';
import FeedFilters from './FeedFilters';
import { PostWithProfile } from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface FilterOptions {
  category: string;
  tags: string[];
  searchQuery: string;
}

const POSTS_PER_PAGE = 10;

export function FeedTimeline() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    tags: [],
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchPosts = useCallback(async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset;
      setLoadingMore(!reset);

      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles (*)
        `)
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + POSTS_PER_PAGE - 1);

      // Apply filters
      if (filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }

      if (filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters.searchQuery) {
        query = query.ilike('content', `%${filters.searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const newPosts = data as PostWithProfile[];
      
      if (reset) {
        setPosts(newPosts);
        setOffset(POSTS_PER_PAGE);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setOffset(prev => prev + POSTS_PER_PAGE);
      }

      setHasMore(newPosts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, offset]);

  const loadMorePosts = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPosts(false);
    }
  }, [fetchPosts, loadingMore, hasMore]);

  useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onLoadMore: loadMorePosts,
    threshold: 200
  });

  useEffect(() => {
    setOffset(0);
    fetchPosts(true);
  }, [filters]);

  useEffect(() => {
    fetchPosts(true);

    // Set up real-time subscription for new posts
    const channel = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        async (payload) => {
          // Fetch the complete post with profile data
          const { data: newPost, error } = await supabase
            .from('posts')
            .select(`
              *,
              profiles (*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && newPost) {
            setPosts(prev => [newPost as PostWithProfile, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLike = async (postId: string) => {
    if (!user?.id) {
      toast.error('Please log in to like posts');
      return;
    }

    try {
      // Check if user already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        // Unlike the post
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
        toast.success('Post unliked');
      } else {
        // Like the post
        const { error: insertError } = await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (insertError) throw insertError;
        toast.success('Post liked!');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const postUrl = `${window.location.origin}/posts/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      toast.success('Post link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to copy link');
    }
  };

  const handlePostCreated = () => {
    setOffset(0);
    fetchPosts(true);
    toast.success('Post created successfully!');
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handleEdit = (postId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit post:', postId);
    toast.info('Edit functionality coming soon!');
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post Form */}
      <CreatePostForm onPostCreated={handlePostCreated} />
      
      {/* Filters */}
      <FeedFilters
        onFiltersChange={handleFiltersChange}
        isVisible={showFilters}
        onToggle={() => setShowFilters(!showFilters)}
      />
      
      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onShare={handleShare}
                onEdit={handleEdit}
                onDelete={handlePostDeleted}
              />
            ))}
            
            {/* Loading more indicator */}
            {loadingMore && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading more posts...</span>
              </div>
            )}
            
            {/* End of posts indicator */}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                You've reached the end of the feed
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No posts found
            </h3>
            <p className="text-muted-foreground">
              {filters.searchQuery || filters.category !== 'All' || filters.tags.length > 0
                ? 'Try adjusting your filters or search terms'
                : 'Be the first to share something with the community!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
