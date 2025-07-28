
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Bookmark, 
  Edit, 
  Trash2,
  BookmarkCheck 
} from 'lucide-react';
import { PostWithProfile } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { sanitizeHtml } from '@/utils/sanitization';
import CommentSection from './CommentSection';
import MediaGallery from './MediaGallery';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostCardProps {
  post: PostWithProfile;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onShare, onEdit, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isBookmarked, toggleBookmark } = useBookmarks(post.id);

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

  const handleDelete = async () => {
    if (!user?.id || user.id !== post.user_id) {
      toast.error('You can only delete your own posts');
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      
      toast.success('Post deleted successfully');
      onDelete?.(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const isOwner = user?.id === post.user_id;

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

  // Sanitize the post content before rendering
  const sanitizedContent = sanitizeHtml(post.content);

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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && (
                <>
                  <DropdownMenuItem onClick={() => onEdit?.(post.id)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={toggleBookmark}>
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                    Remove Bookmark
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmark
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Content - Using sanitized content */}
        <div 
          className="text-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Category */}
        {post.category && (
          <Badge variant="default" className="w-fit">
            {post.category}
          </Badge>
        )}

        {/* Media Gallery */}
        {post.media_urls && post.media_urls.length > 0 ? (
          <MediaGallery mediaUrls={post.media_urls} mediaType={post.media_type || 'image'} />
        ) : post.media_url && (
          <MediaGallery mediaUrls={[post.media_url]} mediaType={post.media_type || 'image'} />
        )}

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

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className={`transition-colors ${
                isBookmarked 
                  ? 'text-blue-500 hover:text-blue-600' 
                  : 'text-muted-foreground hover:text-blue-500'
              }`}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 mr-1" />
              ) : (
                <Bookmark className="w-4 h-4 mr-1" />
              )}
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection postId={post.id} />
      </CardContent>
    </Card>
  );
}
