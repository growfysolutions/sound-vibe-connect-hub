
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';
import { Users, Play, Square, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RealTimeCollaborationPanelProps {
  projectId: number;
}

const RealTimeCollaborationPanel = ({ projectId }: RealTimeCollaborationPanelProps) => {
  const { 
    activeSessions, 
    currentSession, 
    startSession, 
    endSession,
    isLoading 
  } = useRealTimeCollaboration(projectId);
  const [sessionType, setSessionType] = useState<'collaboration' | 'review' | 'practice'>('collaboration');

  const handleStartSession = async () => {
    const session = await startSession(sessionType);
    if (session) {
      console.log('Session started:', session);
    }
  };

  const handleEndSession = async () => {
    if (currentSession) {
      await endSession(currentSession.id);
    }
  };

  return (
    <Card className="floating-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Live Collaboration
          </h3>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {activeSessions.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentSession ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              {(['collaboration', 'review', 'practice'] as const).map(type => (
                <Button
                  key={type}
                  variant={sessionType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSessionType(type)}
                  disabled={isLoading}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
            <Button 
              onClick={handleStartSession} 
              className="w-full" 
              size="sm"
              disabled={isLoading}
            >
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? 'Starting...' : `Start ${sessionType} Session`}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div>
                <p className="font-medium">Your {currentSession.session_type} session</p>
                <p className="text-sm text-muted-foreground">
                  Started {formatDistanceToNow(new Date(currentSession.created_at))} ago
                </p>
              </div>
              <Button 
                onClick={handleEndSession} 
                variant="destructive" 
                size="sm"
                disabled={isLoading}
              >
                <Square className="w-4 h-4 mr-2" />
                End Session
              </Button>
            </div>
          </div>
        )}

        {activeSessions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Active Sessions</h4>
            {activeSessions.map(session => (
              <div key={session.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium capitalize">{session.session_type}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(session.last_activity))} ago
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs capitalize">
                  {session.status}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {activeSessions.length === 0 && !currentSession && (
          <div className="text-center p-4 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active sessions</p>
            <p className="text-xs">Start a session to collaborate in real-time</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeCollaborationPanel;
