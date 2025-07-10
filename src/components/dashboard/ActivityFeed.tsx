import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, MessageCircle, Heart } from 'lucide-react';

const ActivityFeed = () => {
  const mockNotifications = [
    { id: 1, type: 'collaboration', message: 'Armaan Singh wants to collaborate on a new track', time: '2h ago' },
    { id: 2, type: 'like', message: 'Your track "Dil Da Mamla" received 50 new likes', time: '4h ago' },
    { id: 3, type: 'message', message: 'New message from Priya Kaur about the upcoming project', time: '6h ago' }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'collaboration': return <Bell className="w-4 h-4 text-primary" />;
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'message': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card className="floating-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Activity Feed</span>
          <Button variant="ghost" size="sm">View All</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockNotifications.map(notification => (
            <li key={notification.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div>
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;

