
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Music, Users, Target, Award } from 'lucide-react';

export function AchievementsTab() {
  const achievements = [
    {
      id: 1,
      title: 'First Connection',
      description: 'Connected with your first music collaborator',
      icon: Users,
      completed: true,
      progress: 100,
      points: 50,
      category: 'Social'
    },
    {
      id: 2,
      title: 'Project Creator',
      description: 'Created your first music project',
      icon: Music,
      completed: true,
      progress: 100,
      points: 100,
      category: 'Creative'
    },
    {
      id: 3,
      title: 'Rising Star',
      description: 'Reached Level 5 in your musical journey',
      icon: Star,
      completed: false,
      progress: 60,
      points: 200,
      category: 'Progress'
    },
    {
      id: 4,
      title: 'Collaborator',
      description: 'Successfully completed 5 collaborations',
      icon: Target,
      completed: false,
      progress: 40,
      points: 150,
      category: 'Social'
    },
    {
      id: 5,
      title: 'Master Musician',
      description: 'Achieved expertise in 3 different genres',
      icon: Award,
      completed: false,
      progress: 33,
      points: 300,
      category: 'Skill'
    }
  ];

  const stats = {
    totalAchievements: achievements.length,
    completedAchievements: achievements.filter(a => a.completed).length,
    totalPoints: achievements.filter(a => a.completed).reduce((sum, a) => sum + a.points, 0),
    nextMilestone: 'Level 5 Master'
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Social': return 'bg-blue-500';
      case 'Creative': return 'bg-purple-500';
      case 'Progress': return 'bg-green-500';
      case 'Skill': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Achievements</h2>
          <p className="text-muted-foreground">Track your musical journey milestones</p>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span className="font-semibold">{stats.totalPoints} XP</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{stats.completedAchievements}/{stats.totalAchievements}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Points</p>
                <p className="text-2xl font-bold">{stats.totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Next Goal</p>
                <p className="text-sm font-bold">{stats.nextMilestone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Completion</p>
                <p className="text-2xl font-bold">{Math.round((stats.completedAchievements / stats.totalAchievements) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <Card key={achievement.id} className={`relative overflow-hidden ${achievement.completed ? 'border-green-500/50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getCategoryColor(achievement.category)}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {achievement.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={achievement.completed ? 'default' : 'secondary'}>
                    {achievement.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {achievement.progress}%
                    </span>
                  </div>
                  <Progress value={achievement.progress} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reward</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium">{achievement.points} XP</span>
                    </div>
                  </div>
                </div>
                {achievement.completed && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <Trophy className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
