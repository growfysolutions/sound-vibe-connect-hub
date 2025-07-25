
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { PostWithProfile } from '@/types';
import { CreatePostForm } from './CreatePostForm';
import { PostCard } from './PostCard';
import { CulturalWidgets } from './CulturalWidgets';
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
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-6">
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
            <div className="text-center text-muted-foreground py-10 bg-gradient-to-r from-card/50 to-background/30 rounded-lg border border-hsl(var(--ocean-blue))/20">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-hsl(var(--ocean-blue))/10 to-hsl(var(--teal))/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">No posts yet</h3>
                  <p className="text-muted-foreground">Be the first to share something amazing!</p>
                  <p className="text-sm text-muted-foreground/80" style={{ fontFamily: 'serif' }}>
                    ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ। ਪਹਿਲੇ ਬਣੋ ਜੋ ਕੁਝ ਸਾਂਝਾ ਕਰਦਾ ਹੈ!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cultural Widgets Column - Only show on large screens when not in desktop three-column mode */}
        <div className="hidden lg:block xl:hidden">
          <CulturalWidgets />
        </div>
      </div>
    </div>
  );
}
