
import { useState, useEffect, useCallback } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeSession {
  id: string;
  project_id: number;
  user_id: string;
  session_type: string;
  status: string;
  last_activity: string;
  session_data: any;
  created_at: string;
}

export const useRealTimeCollaboration = (projectId?: number) => {
  const { profile } = useProfile();
  const [activeSessions, setActiveSessions] = useState<RealTimeSession[]>([]);
  const [currentSession, setCurrentSession] = useState<RealTimeSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch active sessions for the project
  const fetchActiveSessions = useCallback(async () => {
    if (!projectId) return;

    try {
      const { data, error } = await supabase
        .from('project_sessions')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', 'active')
        .order('last_activity', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        return;
      }

      setActiveSessions(data || []);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  }, [projectId]);

  // Start a new collaboration session
  const startSession = useCallback(async (sessionType: string, sessionData = {}) => {
    if (!profile?.id || !projectId) return null;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_sessions')
        .insert({
          project_id: projectId,
          user_id: profile.id,
          session_type: sessionType,
          session_data: sessionData,
          status: 'active',
          last_activity: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting session:', error);
        return null;
      }

      setCurrentSession(data);
      await fetchActiveSessions();
      return data;
    } catch (error) {
      console.error('Error starting session:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [profile?.id, projectId, fetchActiveSessions]);

  // Update session activity
  const updateSessionActivity = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('project_sessions')
        .update({ 
          last_activity: new Date().toISOString() 
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating session activity:', error);
        return;
      }

      await fetchActiveSessions();
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  }, [fetchActiveSessions]);

  // End a session
  const endSession = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('project_sessions')
        .update({ status: 'ended' })
        .eq('id', sessionId);

      if (error) {
        console.error('Error ending session:', error);
        return;
      }

      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [currentSession]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!projectId) return;

    fetchActiveSessions();

    // Subscribe to real-time changes for project sessions
    const sessionChannel = supabase
      .channel('project-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_sessions',
          filter: `project_id=eq.${projectId}`
        },
        () => {
          fetchActiveSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
    };
  }, [projectId, fetchActiveSessions]);

  return {
    activeSessions,
    currentSession,
    startSession,
    updateSessionActivity,
    endSession,
    isLoading
  };
};
