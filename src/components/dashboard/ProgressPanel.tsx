import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, ShieldCheck, Zap, Star, Award, Crown, Target, TrendingUp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProgressPanelProps {
  connectionsCount: number;
  projectsCount: number;
}

const ProgressPanel: React.FC<ProgressPanelProps> = ({ connectionsCount, projectsCount }) => {
  const { profile } = useProfile();
  
  const userLevel = profile?.level ?? 1;
  const userXp = (profile as any)?.xp || 0;
  const xpForCurrentLevel = (userLevel - 1) * 1000;
  const progressPercentage = Math.min(((userXp - xpForCurrentLevel) / 1000) * 100, 100);
  
  const getLevelName = (level: number) => {
    if (level <= 2) return 'Rising Star';
    if (level <= 5) return 'Creative';
    if (level <= 10) return 'Professional';
    if (level <= 20) return 'Expert';
    return 'Master';
  };

  const achievements = [
    { 
      id: 1, 
      icon: <Trophy className="w-6 h-6 text-yellow-500" />, 
      title: 'First Collaboration', 
      description: 'Completed your first project collaboration.',
      unlocked: projectsCount > 0,
      category: 'collaboration',
      rarity: 'common'
    },
    { 
      id: 2, 
      icon: <ShieldCheck className="w-6 h-6 text-green-500" />, 
      title: 'Verified Artist', 
      description: 'Successfully completed profile verification.',
      unlocked: profile?.is_verified ?? false,
      category: 'profile',
      rarity: 'uncommon'
    },
    { 
      id: 3, 
      icon: <Zap className="w-6 h-6 text-blue-500" />, 
      title: 'Power Networker', 
      description: 'Connected with 10+ professionals.',
      unlocked: connectionsCount >= 10,
      category: 'networking',
      rarity: 'rare'
    },
    { 
      id: 4, 
      icon: <Star className="w-6 h-6 text-purple-500" />, 
      title: 'Rising Talent', 
      description: 'Reached Level 5 in your journey.',
      unlocked: userLevel >= 5,
      category: 'progression',
      rarity: 'epic'
    },
    { 
      id: 5, 
      icon: <Crown className="w-6 h-6 text-gold-500" />, 
      title: 'Legend', 
      description: 'Achieved the ultimate level 20.',
      unlocked: userLevel >= 20,
      category: 'progression',
      rarity: 'legendary'
    },
  ];

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Alex Chen', xp: 12500, level: 13, avatar: null },
    { rank: 2, name: 'Sarah Johnson', xp: 11200, level: 12, avatar: null },
    { rank: 3, name: 'Mike Rodriguez', xp: 9800, level: 10, avatar: null },
    { rank: 4, name: 'Emma Wilson', xp: 8900, level: 9, avatar: null },
    { rank: 5, name: 'You', xp: userXp, level: userLevel, avatar: profile?.avatar_url },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 bg-gray-100';
      case 'uncommon': return 'text-green-500 bg-green-100';
      case 'rare': return 'text-blue-500 bg-blue-100';
      case 'epic': return 'text-purple-500 bg-purple-100';
      case 'legendary': return 'text-yellow-500 bg-yellow-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* XP Progress Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border-4 border-primary/30 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userLevel}</div>
                  <div className="text-xs text-muted-foreground">Level</div>
                </div>
              </div>
              <div className="absolute -inset-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${progressPercentage * 2.83} 283`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
              </div>
            </div>
            <h3 className="font-bold text-xl text-gradient-primary">{getLevelName(userLevel)}</h3>
            <p className="text-sm text-muted-foreground">
              {userXp - xpForCurrentLevel} / 1000 XP to next level
            </p>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-2 cursor-help">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level {userLevel + 1}</span>
                    <span className="font-medium">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Earn XP by collaborating, connecting, and completing projects!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Gamification Tabs */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 m-1 bg-muted/50">
              <TabsTrigger value="achievements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Award className="w-4 h-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <TrendingUp className="w-4 h-4 mr-2" />
                Leaderboard
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="achievements" className="p-6 space-y-4">
              <div className="grid gap-4">
                {achievements.map(achievement => (
                  <TooltipProvider key={achievement.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30 hover:border-primary/50' 
                            : 'bg-muted/50 border-border opacity-60'
                        }`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            achievement.unlocked ? 'bg-primary/20 scale-110' : 'bg-muted'
                          }`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                                {achievement.rarity}
                              </Badge>
                              {achievement.unlocked && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  Unlocked
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Category: {achievement.category}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <Button variant="outline" className="w-full hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                View All Achievements
              </Button>
            </TabsContent>
            
            <TabsContent value="leaderboard" className="p-6 space-y-4">
              <div className="space-y-2">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 ${
                      user.name === 'You' 
                        ? 'bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      user.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      user.rank === 2 ? 'bg-gray-100 text-gray-700' :
                      user.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold text-primary">
                          {user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Level {user.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{user.xp.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressPanel;
