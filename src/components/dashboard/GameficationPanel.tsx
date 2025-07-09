import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, Target, Zap, Crown, Star, Music, Users, 
  Calendar, TrendingUp, Award, Flame, Gift
} from 'lucide-react';

const GameficationPanel = () => {
  const weeklyGoals = [
    {
      id: 1,
      title: 'Upload 2 new tracks',
      progress: 50,
      target: 2,
      current: 1,
      xp: 100,
      icon: <Music className="w-4 h-4" />
    },
    {
      id: 2,
      title: 'Connect with 5 professionals',
      progress: 80,
      target: 5,
      current: 4,
      xp: 75,
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 3,
      title: 'Complete profile sections',
      progress: 100,
      target: 3,
      current: 3,
      xp: 50,
      icon: <Target className="w-4 h-4" />
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Armaan Singh', xp: 2450, badge: '👑' },
    { rank: 2, name: 'Priya Kaur', xp: 2180, badge: '🥈' },
    { rank: 3, name: 'You', xp: 1890, badge: '🥉' },
    { rank: 4, name: 'Ravi Sharma', xp: 1654, badge: '🏆' },
    { rank: 5, name: 'Simran Kaur', xp: 1543, badge: '⭐' }
  ];

  const dailyStreak = 7;
  const totalXP = 1890;
  const currentLevel = 3;
  const nextLevelXP = 2000;

  return (
    <div className="space-y-6">
      {/* XP and Level Card */}
      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-primary">{totalXP} XP</div>
              <div className="text-sm text-muted-foreground">Level {currentLevel}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Next Level</div>
              <div className="text-lg font-semibold">{nextLevelXP - totalXP} XP</div>
            </div>
          </div>
          <Progress value={(totalXP / nextLevelXP) * 100} className="h-3 mb-4" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Daily Streak</span>
              <Badge className="bg-orange-500 text-white">{dailyStreak} days</Badge>
            </div>
            <Button size="sm" className="btn-premium">
              <Gift className="w-4 h-4 mr-2" />
              Claim Bonus
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Weekly Goals
            </div>
            <Badge variant="secondary" className="text-xs">
              3 days left
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {weeklyGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      {goal.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{goal.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {goal.current}/{goal.target} • +{goal.xp} XP
                      </div>
                    </div>
                  </div>
                  {goal.progress === 100 && (
                    <Badge className="bg-green-500 text-white">Complete</Badge>
                  )}
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Weekly Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div 
                key={user.rank} 
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  user.name === 'You' 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                    {user.badge}
                  </div>
                  <div>
                    <div className={`font-medium ${user.name === 'You' ? 'text-primary' : ''}`}>
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">Rank #{user.rank}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{user.xp} XP</div>
                  <div className="text-xs text-muted-foreground">This week</div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4 hover-scale">
            View Full Leaderboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameficationPanel;