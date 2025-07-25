
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
    <div className="min-h-screen bg-gradient-to-br from-hsl(var(--color-primary-50)) to-hsl(var(--background)) p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Creation Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-hsl(var(--color-primary-500))/20 shadow-lg">
              <CreatePostForm onPostCreated={fetchPosts} />
            </div>
            
            {/* Feed Posts */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl border border-hsl(var(--color-primary-500))/20 shadow-lg p-6">
                    <Skeleton className="h-32 w-full rounded-lg bg-hsl(var(--color-primary-100))" />
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-hsl(var(--color-primary-500))/20 shadow-lg">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-xl border border-hsl(var(--color-primary-500))/20 shadow-lg">
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-hsl(var(--color-primary-500))/10 to-hsl(var(--color-secondary-500))/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🎵</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-hsl(var(--color-primary-900))">No posts yet</h3>
                    <p className="text-hsl(var(--color-neutral-600)) max-w-md mx-auto">
                      Be the first to share something amazing with the SoundVibe community!
                    </p>
                    <p className="text-sm text-hsl(var(--color-neutral-500))" style={{ fontFamily: 'serif' }}>
                      ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ। ਪਹਿਲੇ ਬਣੋ ਜੋ ਕੁਝ ਸਾਂਝਾ ਕਰਦਾ ਹੈ!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cultural Widgets Column - Only show on large screens when not in desktop three-column mode */}
          <div className="hidden lg:block xl:hidden">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-hsl(var(--color-primary-500))/20 shadow-lg">
              <CulturalWidgets />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
