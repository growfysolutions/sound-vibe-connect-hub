
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, CheckCheck, Volume2 } from 'lucide-react';
import { useCulturalNotifications } from '@/hooks/useCulturalNotifications';
import { formatDistanceToNow } from 'date-fns';

const CulturalNotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useCulturalNotifications();

  const playNotificationSound = (soundAlert: string) => {
    if (soundAlert && 'Audio' in window) {
      try {
        const audio = new Audio(soundAlert);
        audio.volume = 0.3;
        audio.play().catch(console.error);
      } catch (error) {
        console.error('Error playing notification sound:', error);
      }
    }
  };

  return (
    <Card className="floating-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Cultural Notifications
          </h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <CheckCheck className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No notifications yet
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-3 border rounded-lg ${
                  notification.is_read ? 'opacity-60' : 'bg-primary/5 border-primary/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {notification.type.replace('_', ' ')}
                      </Badge>
                      {notification.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          High Priority
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(notification.created_at))} ago
                      </span>
                      {notification.sound_alert && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1"
                          onClick={() => playNotificationSound(notification.sound_alert!)}
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 shrink-0"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CulturalNotificationCenter;
