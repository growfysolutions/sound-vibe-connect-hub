
import { useState, useEffect, useCallback } from 'react';
import { useProfile } from '@/contexts/ProfileContext';

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

  const startSession = useCallback(async (sessionType: string, sessionData = {}) => {
    if (!profile?.id || !projectId) return null;

    // Mock implementation for now
    const mockSession: RealTimeSession = {
      id: Math.random().toString(36).substr(2, 9),
      project_id: projectId,
      user_id: profile.id,
      session_type: sessionType,
      status: 'active',
      last_activity: new Date().toISOString(),
      session_data: sessionData,
      created_at: new Date().toISOString(),
    };

    setCurrentSession(mockSession);
    setActiveSessions(prev => [...prev, mockSession]);
    return mockSession;
  }, [profile?.id, projectId]);

  const updateSessionActivity = useCallback(async (sessionId: string) => {
    setActiveSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, last_activity: new Date().toISOString() }
          : session
      )
    );
  }, []);

  const endSession = useCallback(async (sessionId: string) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  }, [currentSession]);

  useEffect(() => {
    if (!projectId || !profile?.id) return;

    // Mock initial sessions
    const mockSessions: RealTimeSession[] = [];
    setActiveSessions(mockSessions);
  }, [projectId, profile?.id]);

  return {
    activeSessions,
    currentSession,
    startSession,
    updateSessionActivity,
    endSession
  };
};
