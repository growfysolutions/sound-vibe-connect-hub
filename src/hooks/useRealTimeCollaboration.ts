
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';

interface RealTimeSession {
  id: string;
  project_id: number;
  user_id: string;
  session_type: string;
  status: string;
  last_activity: string;
  session_data: any;
}

export const useRealTimeCollaboration = (projectId?: number) => {
  const { profile } = useProfile();
  const [activeSessions, setActiveSessions] = useState<RealTimeSession[]>([]);
  const [currentSession, setCurrentSession] = useState<RealTimeSession | null>(null);

  const startSession = useCallback(async (sessionType: string, sessionData = {}) => {
    if (!profile?.id || !projectId) return null;

    try {
      const { data, error } = await supabase
        .from('real_time_sessions')
        .insert({
          project_id: projectId,
          user_id: profile.id,
          session_type: sessionType,
          session_data: sessionData
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      return data;
    } catch (error) {
      console.error('Error starting session:', error);
      return null;
    }
  }, [profile?.id, projectId]);

  const updateSessionActivity = useCallback(async (sessionId: string) => {
    try {
      await supabase.rpc('update_session_activity', { session_id: sessionId });
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  }, []);

  const endSession = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('real_time_sessions')
        .update({ status: 'ended' })
        .eq('id', sessionId);

      if (error) throw error;

      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [currentSession]);

  useEffect(() => {
    if (!projectId) return;

    // Fetch active sessions for the project
    const fetchActiveSessions = async () => {
      const { data, error } = await supabase
        .from('real_time_sessions')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', 'active');

      if (!error && data) {
        setActiveSessions(data);
      }
    };

    fetchActiveSessions();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('realtime-sessions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'real_time_sessions',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchActiveSessions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return {
    activeSessions,
    currentSession,
    startSession,
    updateSessionActivity,
    endSession
  };
};
