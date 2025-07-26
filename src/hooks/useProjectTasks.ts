
import { useState, useEffect, useCallback } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';

interface ProjectTask {
  id: string;
  project_id: number;
  creator_id: string;
  assignee_id: string | null;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  progress: number;
  tags: string[];
  attachments: any[];
  created_at: string;
  updated_at: string;
}

interface CreateTaskData {
  title: string;
  description?: string;
  assignee_id?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  tags?: string[];
}

export const useProjectTasks = (projectId?: number) => {
  const { profile } = useProfile();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch project tasks
  const fetchTasks = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      // Transform the data to match our interface
      const transformedTasks: ProjectTask[] = (data || []).map(task => ({
        ...task,
        status: task.status as ProjectTask['status'],
        priority: task.priority as ProjectTask['priority'],
        tags: Array.isArray(task.tags) ? task.tags : [],
        attachments: Array.isArray(task.attachments) ? task.attachments : []
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Create a new task
  const createTask = useCallback(async (taskData: CreateTaskData) => {
    if (!profile?.id || !projectId) return null;

    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: projectId,
          creator_id: profile.id,
          ...taskData
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        return null;
      }

      await fetchTasks();
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }, [profile?.id, projectId, fetchTasks]);

  // Update task
  const updateTask = useCallback(async (taskId: string, updates: Partial<ProjectTask>) => {
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        return null;
      }

      await fetchTasks();
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }, [fetchTasks]);

  // Update task status
  const updateTaskStatus = useCallback(async (taskId: string, status: ProjectTask['status']) => {
    return updateTask(taskId, { status });
  }, [updateTask]);

  // Update task progress
  const updateTaskProgress = useCallback(async (taskId: string, progress: number) => {
    return updateTask(taskId, { progress });
  }, [updateTask]);

  // Delete task
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Error deleting task:', error);
        return false;
      }

      await fetchTasks();
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }, [fetchTasks]);

  // Get tasks by status
  const getTasksByStatus = useCallback((status: ProjectTask['status']) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  // Get tasks assigned to current user
  const getMyTasks = useCallback(() => {
    return tasks.filter(task => task.assignee_id === profile?.id);
  }, [tasks, profile?.id]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!projectId) return;

    fetchTasks();

    const tasksChannel = supabase
      .channel('project-tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_tasks',
          filter: `project_id=eq.${projectId}`
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, [projectId, fetchTasks]);

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    updateTaskStatus,
    updateTaskProgress,
    deleteTask,
    getTasksByStatus,
    getMyTasks,
    fetchTasks
  };
};
