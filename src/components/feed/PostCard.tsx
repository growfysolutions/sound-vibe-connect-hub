import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ThumbsUp, Send, MoreHorizontal, Trash2, Share2, Bookmark, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PostWithProfile, CommentWithProfile } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

export function PostCard({ post }: { post: PostWithProfile }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  useEffect(() => {
    const initializePostState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Fetch likes
      const { data: likes, error: likesError } = await supabase.from('likes').select('*', { count: 'exact' }).eq('post_id', post.id);
      if (likesError) console.error('Error fetching likes:', likesError.message);
      else {
        setLikesCount(likes.length);
        if (user) {
          setIsLiked(likes.some(like => like.user_id === user.id));
        }
      }

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*, profiles(id, full_name, avatar_url)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (commentsError) console.error('Error fetching comments:', commentsError.message);
      else setComments(commentsData as CommentWithProfile[]);
    };

    initializePostState();
  }, [post.id]);

  const toggleLike = async () => {
    if (!user) return toast.error('You must be logged in to like a post.');

    const currentlyLiked = isLiked;
    setIsLiked(!currentlyLiked);
    setLikesCount(prev => currentlyLiked ? prev - 1 : prev + 1);

    if (currentlyLiked) {
      const { error } = await supabase.from('likes').delete().match({ user_id: user.id, post_id: post.id });
      if (error) {
        toast.error('Failed to unlike post.');
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } else {
      const { error } = await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
      if (error) {
        toast.error('Failed to like post.');
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('You must be logged in to comment.');
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: post.id, user_id: user.id, content: newComment.trim() })
      .select('*, profiles(id, full_name, avatar_url)')
      .single();

    if (error) {
      toast.error('Failed to add comment.');
    } else {
      setComments(prev => [...prev, data as CommentWithProfile]);
      setNewComment('');
    }
  };

  const handleDelete = async () => {
    if (!user || user.id !== post.user_id) {
      toast.error("You can only delete your own posts.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) {
      return;
    }

    // First, delete related records (likes, comments)
    await supabase.from('likes').delete().eq('post_id', post.id);
    await supabase.from('comments').delete().eq('post_id', post.id);

    // Then, delete the post itself
    const { error } = await supabase.from('posts').delete().eq('id', post.id);

    if (error) {
      toast.error("Failed to delete post.");
    } else {
      toast.success("Post deleted successfully.");
      // This is a simple way to refresh the page to show the updated post list.
      // A more advanced implementation would use a callback to update the parent state.
      window.location.reload();
    }
  };

  return (
    <Card className="glass-card hover:border-primary/20 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={post.profiles?.avatar_url || undefined} alt={post.profiles?.full_name || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary font-semibold">
                {post.profiles?.full_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            {/* Activity indicator for online status */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-foreground">{post.profiles?.full_name || 'Anonymous'}</p>
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                Shared a post
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{timeAgo}</p>
          </div>
          {user && user.id === post.user_id && (
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-500 cursor-pointer">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-4 border-t border-border/30">
        {/* Engagement Stats */}
        {(likesCount > 0 || comments.length > 0) && (
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-4">
              {likesCount > 0 && (
                <span className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1 text-primary" />
                  {likesCount}
                </span>
              )}
              {comments.length > 0 && (
                <span className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-1 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLike} 
            className={`hover:bg-primary/10 transition-all duration-200 ${isLiked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'}`}
          >
            <ThumbsUp className={`mr-2 h-4 w-4 transition-transform duration-200 ${isLiked ? 'fill-current scale-110' : 'hover:scale-110'}`} />
            Like
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowComments(!showComments)}
            className="text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-all duration-200"
          >
            <MessageCircle className="mr-2 h-4 w-4 hover:scale-110 transition-transform duration-200" />
            Comment
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-200"
          >
            <Share2 className="mr-2 h-4 w-4 hover:scale-110 transition-transform duration-200" />
            Share
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 transition-all duration-200"
          >
            <Bookmark className="mr-2 h-4 w-4 hover:scale-110 transition-transform duration-200" />
            Save
          </Button>
        </div>
        {showComments && (
          <div className="w-full mt-4 space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{comment.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg flex-1">
                  <p className="font-semibold text-sm">{comment.profiles?.full_name}</p>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
            <form onSubmit={handleAddComment} className="flex items-center space-x-2 pt-4">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
