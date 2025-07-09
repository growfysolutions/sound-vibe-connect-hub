import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Target, Zap } from 'lucide-react';

const UserProfileCard = () => {
  const navigate = useNavigate();

  const achievements = [
    { id: 1, name: 'First Collaboration', icon: '🤝', unlocked: true },
    { id: 2, name: 'Rising Star', icon: '⭐', unlocked: true },
    { id: 3, name: 'Community Builder', icon: '🏆', unlocked: false },
    { id: 4, name: 'Master Mixer', icon: '🎧', unlocked: false }
  ];

  const profileCompletion = 75;
  const currentLevel = 3;
  const nextLevelProgress = 60;

  return (
    <Card className="floating-card mb-6">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Avatar className="w-20 h-20 mx-auto mb-4 border-3 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                JS
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
              {currentLevel}
            </div>
          </div>
          
          <h3 className="font-semibold text-lg">Jasbir Singh</h3>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Badge className="bg-primary text-primary-foreground">Singer</Badge>
            <div className="flex items-center text-primary">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-sm font-medium">4.9</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-2">Punjabi Folk Specialist</p>
        </div>

        {/* Level Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Level {currentLevel} Progress</span>
            <span className="text-primary font-medium">{nextLevelProgress}%</span>
          </div>
          <Progress value={nextLevelProgress} className="h-2" />
        </div>

        {/* Profile Completion */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="text-primary font-medium">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
        </div>

        {/* Achievements */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-primary" />
            Recent Achievements
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-2 rounded-lg border text-center transition-all ${
                  achievement.unlocked
                    ? 'border-primary bg-primary/10 transform hover:scale-105'
                    : 'border-border bg-muted/30 opacity-50'
                }`}
              >
                <div className="text-lg mb-1">{achievement.icon}</div>
                <div className="text-xs text-muted-foreground">{achievement.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Profile Views</span>
            <span className="font-medium flex items-center">
              <Target className="w-3 h-3 mr-1 text-primary" />
              1,234
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Collaborations</span>
            <span className="font-medium flex items-center">
              <Zap className="w-3 h-3 mr-1 text-primary" />
              23
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rating</span>
            <span className="text-primary font-medium flex items-center">
              4.9 <Star className="w-3 h-3 ml-1 fill-current" />
            </span>
          </div>
        </div>

        <Button className="w-full btn-premium" onClick={() => navigate('/profile')}>
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;