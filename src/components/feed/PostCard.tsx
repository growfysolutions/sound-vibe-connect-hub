
import { useState, useEffect } from 'react';
import { MoreHorizontal, Heart, MessageCircle, Share, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { PostWithProfile } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/ProfileContext';

interface PostCardProps {
  post: PostWithProfile;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string | null;
    avatar_url?: string | null;
  };
}

export function PostCard({ post }: PostCardProps) {
  const { profile } = useProfile();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchPostInteractions();
    fetchComments();
  }, [post.id]);

  const fetchPostInteractions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user liked this post
      const { data: likeData } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single();

      setIsLiked(!!likeData);

      // Get likes count
      const { count: likesCount } = await supabase
        .from('likes')
        .select('id', { count: 'exact' })
        .eq('post_id', post.id);

      setLikesCount(likesCount || 0);

      // Get comments count
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('id', { count: 'exact' })
        .eq('post_id', post.id);

      setCommentsCount(commentsCount || 0);
    } catch (error) {
      console.error('Error fetching post interactions:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!inner(
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to like posts');
        return;
      }

      setIsLoading(true);

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);

        if (error) throw error;
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          });

        if (error) throw error;
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to comment');
        return;
      }

      setIsCommenting(true);

      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          post_id: post.id,
          user_id: user.id
        });

      if (error) throw error;

      setNewComment('');
      setCommentsCount(prev => prev + 1);
      await fetchComments();
      toast.success('Comment added!');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: `Post by ${post.profiles?.full_name || 'Unknown User'}`,
          text: post.content,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${post.content}\n\n- ${post.profiles?.full_name || 'Unknown User'} on SoundVibe`);
        toast.success('Post copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy post');
      }
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Post removed from saved' : 'Post saved!');
  };

  // Handle case where post.profiles might be null
  const profileName = post.profiles?.full_name || 'Unknown User';
  const avatarUrl = post.profiles?.avatar_url;
  const profileInitial = profileName.charAt(0).toUpperCase();

  return (
    <Card className={cn(
      "border-saffron/20 bg-gradient-to-r from-card/95 to-background/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg",
      isMobile ? "mx-0" : ""
    )}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 border-2 border-saffron/30">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-saffron to-amber-500 text-white font-semibold">
                {profileInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground truncate">
                  {profileName}
                </h3>
                <span className="text-xs bg-saffron/20 text-saffron px-2 py-1 rounded-full">
                  ✓ Verified Artist
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <button 
                  className="hover:text-foreground transition-colors"
                  onClick={() => toast.info('Post details coming soon!')}
                >
                  {formatDistanceToNow(new Date(post.created_at))} ago
                </button>
                <span>•</span>
                <span className="flex items-center">
                  📍 Punjab Traditional
                </span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="p-2">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 px-2">
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center hover:text-foreground transition-colors"
              onClick={() => setShowComments(!showComments)}
            >
              ❤️ {likesCount} likes
            </button>
            <button 
              className="flex items-center hover:text-foreground transition-colors"
              onClick={() => setShowComments(!showComments)}
            >
              💬 {commentsCount} comments
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span>🎵 Traditional</span>
            <span>•</span>
            <span style={{ fontFamily: 'serif' }}>ਪਰੰਪਰਾਗਤ</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-saffron/10 pt-4">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center space-x-2 transition-all duration-200",
                isLiked ? "text-red-600 hover:text-red-700" : "hover:text-red-600"
              )}
              onClick={handleLike}
              disabled={isLoading}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span>Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
              onClick={() => {
                setShowComments(!showComments);
                if (!showComments) {
                  setTimeout(() => {
                    document.getElementById(`comment-input-${post.id}`)?.focus();
                  }, 100);
                }
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 hover:text-green-600 transition-colors"
              onClick={handleShare}
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center space-x-2 transition-all duration-200",
              isSaved ? "text-yellow-600 hover:text-yellow-700" : "hover:text-yellow-600"
            )}
            onClick={handleSave}
          >
            <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
            <span>Save</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 border-t border-saffron/10 pt-4">
            {/* Comment Input */}
            <div className="flex space-x-3 mb-4">
              <Avatar className="w-8 h-8 border border-saffron/30">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-saffron to-amber-500 text-white text-sm">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Input
                  id={`comment-input-${post.id}`}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment... ਟਿੱਪਣੀ ਲਿਖੋ..."
                  className="border-saffron/30 focus:border-saffron"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
                />
                {newComment.trim() && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleComment}
                      disabled={isCommenting}
                      className="bg-gradient-to-r from-saffron to-amber-500 hover:from-saffron/90 hover:to-amber-500/90"
                    >
                      {isCommenting ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="w-8 h-8 border border-saffron/30">
                    <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-saffron to-amber-500 text-white text-sm">
                      {comment.profiles?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{comment.profiles?.full_name || 'Unknown User'}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at))} ago
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
