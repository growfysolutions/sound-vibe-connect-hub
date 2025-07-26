
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
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <CreatePostForm onPostCreated={fetchPosts} />
      </div>
      
      {/* Feed Posts */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg shadow-sm p-6">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-card border border-border rounded-lg shadow-sm">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border rounded-lg shadow-sm">
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎵</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">No posts yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Be the first to share something amazing with the SoundVibe community!
              </p>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: 'serif' }}>
                ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ। ਪਹਿਲੇ ਬਣੋ ਜੋ ਕੁਝ ਸਾਂਝਾ ਕਰਦਾ ਹੈ!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
