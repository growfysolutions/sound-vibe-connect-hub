
import { useState, useEffect, useCallback } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';

interface ProjectComment {
  id: string;
  project_id: number;
  user_id: string;
  file_id: string | null;
  content: string;
  timestamp_ms: number | null;
  position_data: any | null;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateCommentData {
  content: string;
  file_id?: string;
  timestamp_ms?: number;
  position_data?: any;
  parent_comment_id?: string;
}

export const useProjectComments = (projectId?: number, fileId?: string) => {
  const { profile } = useProfile();
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch project comments
  const fetchComments = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      let query = supabase
        .from('project_comments')
        .select('*')
        .eq('project_id', projectId);

      if (fileId) {
        query = query.eq('file_id', fileId);
      }

      const { data, error } = await query.order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, fileId]);

  // Create a new comment
  const createComment = useCallback(async (commentData: CreateCommentData) => {
    if (!profile?.id || !projectId) return null;

    try {
      const { data, error } = await supabase
        .from('project_comments')
        .insert({
          project_id: projectId,
          user_id: profile.id,
          ...commentData
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        return null;
      }

      await fetchComments();
      return data;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  }, [profile?.id, projectId, fetchComments]);

  // Update comment
  const updateComment = useCallback(async (commentId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('project_comments')
        .update({ content })
        .eq('id', commentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating comment:', error);
        return null;
      }

      await fetchComments();
      return data;
    } catch (error) {
      console.error('Error updating comment:', error);
      return null;
    }
  }, [fetchComments]);

  // Delete comment
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('project_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        return false;
      }

      await fetchComments();
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }, [fetchComments]);

  // Get comments by file
  const getCommentsByFile = useCallback((targetFileId: string) => {
    return comments.filter(comment => comment.file_id === targetFileId);
  }, [comments]);

  // Get replies to a comment
  const getCommentReplies = useCallback((parentId: string) => {
    return comments.filter(comment => comment.parent_comment_id === parentId);
  }, [comments]);

  // Get timeline comments (comments with timestamps)
  const getTimelineComments = useCallback(() => {
    return comments.filter(comment => comment.timestamp_ms !== null);
  }, [comments]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!projectId) return;

    fetchComments();

    const commentsChannel = supabase
      .channel('project-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_comments',
          filter: `project_id=eq.${projectId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentsChannel);
    };
  }, [projectId, fetchComments]);

  return {
    comments,
    isLoading,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByFile,
    getCommentReplies,
    getTimelineComments,
    fetchComments
  };
};
