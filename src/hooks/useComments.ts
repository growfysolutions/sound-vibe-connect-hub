
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const useComments = (postId: string) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const createComment = useCallback(async (content: string) => {
    if (!user?.id) {
      toast.error('Please log in to comment');
      return false;
    }

    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return false;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim()
        });

      if (error) throw error;
      
      await fetchComments();
      toast.success('Comment added!');
      return true;
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to add comment');
      return false;
    } finally {
      setCreating(false);
    }
  }, [user?.id, postId, fetchComments]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchComments();
      toast.success('Comment deleted');
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
      return false;
    }
  }, [user?.id, fetchComments]);

  useEffect(() => {
    fetchComments();

    // Set up real-time subscription
    const channel = supabase
      .channel(`comments_${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, fetchComments]);

  return {
    comments,
    loading,
    creating,
    createComment,
    deleteComment
  };
};
