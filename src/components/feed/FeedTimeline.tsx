
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { PostWithProfile } from '@/types';
import { CreatePostForm } from './CreatePostForm';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';

export function FeedTimeline() {
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!inner(
          id,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else if (data) {
      setPosts(data as PostWithProfile[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="space-y-6">
      {/* Post Creation Form */}
      <CreatePostForm onPostCreated={fetchPosts} />
      
      {/* Feed Posts */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-10 bg-gradient-to-r from-card/50 to-background/30 rounded-lg border border-saffron/20">
          <div className="space-y-2">
            <p>No posts yet. Be the first to share something!</p>
            <p className="text-sm" style={{ fontFamily: 'serif' }}>
              ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ। ਪਹਿਲੇ ਬਣੋ ਜੋ ਕੁਝ ਸਾਂਝਾ ਕਰਦਾ ਹੈ!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
