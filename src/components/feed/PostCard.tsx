import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Share2, MoreHorizontal, Play, Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PostWithProfile } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: PostWithProfile;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
}

export default function PostCard({ post, onLike, onShare }: PostCardProps) {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInteractionData();
  }, [post.id, user?.id]);

  const fetchInteractionData = async () => {
    try {
      // Fetch like count
      const { count: likes } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      setLikeCount(likes || 0);

      // Check if current user liked this post
      if (user?.id) {
        const { data: userLike } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_id', user.id)
          .single();

        setIsLiked(!!userLike);
      }
    } catch (error) {
      console.error('Error fetching interaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    onLike(post.id);
    // Optimistically update UI
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const renderMedia = () => {
    if (!post.media_url || post.media_type === 'text') return null;

    switch (post.media_type) {
      case 'image':
        return (
          <img
            src={post.media_url}
            alt="Post media"
            className="w-full rounded-lg border object-cover max-h-96"
          />
        );
      case 'video':
        return (
          <video
            src={post.media_url}
            controls
            className="w-full rounded-lg border max-h-96"
          />
        );
      case 'audio':
        return (
          <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-primary"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <div className="flex-1">
              <audio
                src={post.media_url}
                controls
                className="w-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-3 bg-muted rounded w-1/6" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.profiles?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {post.profiles?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground">
                {post.profiles?.full_name || 'Anonymous'}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
                {post.profiles?.role && (
                  <Badge variant="secondary" className="text-xs">
                    {post.profiles.role}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Content */}
        <p className="text-foreground leading-relaxed">{post.content}</p>

        {/* Media */}
        {renderMedia()}

        {/* Interaction Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likeCount}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(post.id)}
              className="text-muted-foreground hover:text-green-500"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection postId={post.id} />
      </CardContent>
    </Card>
  );
}
