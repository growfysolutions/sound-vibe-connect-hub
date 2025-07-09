import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bell, Heart, MessageCircle, Share2, Star, Trophy, 
  Music, Users, Flame, TrendingUp, Award, Mic
} from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'achievement',
      user: 'You',
      action: 'unlocked the "Rising Star" achievement',
      time: '2h ago',
      icon: <Trophy className="w-4 h-4 text-yellow-500" />,
      bgColor: 'bg-yellow-500/10',
      details: '+50 XP earned'
    },
    {
      id: 2,
      type: 'collaboration',
      user: 'Armaan Singh',
      action: 'wants to collaborate on a new track',
      time: '3h ago',
      icon: <Users className="w-4 h-4 text-blue-500" />,
      bgColor: 'bg-blue-500/10',
      details: 'Punjabi Folk fusion project'
    },
    {
      id: 3,
      type: 'trending',
      user: 'Your track',
      action: '"Dil Da Mamla" is trending',
      time: '4h ago',
      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
      bgColor: 'bg-green-500/10',
      details: '50 new likes in the last hour'
    },
    {
      id: 4,
      type: 'endorsement',
      user: 'Priya Kaur',
      action: 'endorsed your vocal skills',
      time: '6h ago',
      icon: <Star className="w-4 h-4 text-purple-500" />,
      bgColor: 'bg-purple-500/10',
      details: 'Professional endorsement received'
    },
    {
      id: 5,
      type: 'milestone',
      user: 'You',
      action: 'reached 1,000 profile views',
      time: '1d ago',
      icon: <Award className="w-4 h-4 text-orange-500" />,
      bgColor: 'bg-orange-500/10',
      details: 'Milestone achievement unlocked'
    },
    {
      id: 6,
      type: 'collab_complete',
      user: 'You',
      action: 'completed collaboration with Ravi Sharma',
      time: '2d ago',
      icon: <Mic className="w-4 h-4 text-pink-500" />,
      bgColor: 'bg-pink-500/10',
      details: 'Project "Soulful Nights" delivered'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement':
      case 'milestone':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'collaboration':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'trending':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'endorsement':
        return <Star className="w-5 h-5 text-purple-500" />;
      case 'collab_complete':
        return <Music className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <Card className="floating-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-500" />
            Activity Feed
          </div>
          <Badge variant="secondary" className="text-xs">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="group hover:bg-muted/30 rounded-lg p-3 transition-all">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-foreground text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  
                  {activity.details && (
                    <p className="text-xs text-muted-foreground mb-2">{activity.details}</p>
                  )}
                  
                  {(activity.type === 'collaboration' || activity.type === 'trending') && (
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        Like
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Comment
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" className="w-full hover-scale">
            View All Activities
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;