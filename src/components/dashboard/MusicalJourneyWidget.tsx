
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Music, Users, Star, TrendingUp } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  date?: string;
  icon: string;
}

export function MusicalJourneyWidget() {
  const { profile } = useProfile();

  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'First Performance',
      description: 'Shared your first audio track',
      achieved: true,
      date: '2 months ago',
      icon: '🎤'
    },
    {
      id: '2',
      title: 'Community Builder',
      description: 'Connected with 10 musicians',
      achieved: true,
      date: '1 month ago',
      icon: '🤝'
    },
    {
      id: '3',
      title: 'Cultural Ambassador',
      description: 'Posted in both Punjabi and English',
      achieved: false,
      icon: '🌍'
    },
    {
      id: '4',
      title: 'Collaborator',
      description: 'Complete your first collaboration',
      achieved: false,
      icon: '🎵'
    }
  ];

  const skillProgress = [
    { skill: 'Vocals', level: 75, instrument: '🎤' },
    { skill: 'Dhol', level: 45, instrument: '🥁' },
    { skill: 'Harmonium', level: 30, instrument: '🎹' },
    { skill: 'Composition', level: 60, instrument: '✍️' }
  ];

  const userLevel = profile?.level || 1;
  const nextLevelProgress = ((userLevel % 1) * 100) || 25; // Mock progress to next level

  return (
    <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-saffron" />
          <span>My Musical Journey</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Level {Math.floor(userLevel)}</span>
            <span className="text-xs text-muted-foreground">{nextLevelProgress}% to next</span>
          </div>
          <Progress value={nextLevelProgress} className="h-2" />
        </div>

        {/* Recent Milestones */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Recent Achievements
          </h4>
          <div className="space-y-2">
            {milestones.slice(0, 3).map((milestone) => (
              <div 
                key={milestone.id}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                  milestone.achieved 
                    ? 'bg-green-50/50 dark:bg-green-950/20 border border-green-200/30' 
                    : 'bg-muted/30 opacity-60'
                }`}
              >
                <span className="text-lg">{milestone.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{milestone.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{milestone.description}</p>
                </div>
                {milestone.achieved && milestone.date && (
                  <span className="text-xs text-green-600 dark:text-green-400">{milestone.date}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skill Progress */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Music className="w-4 h-4 text-saffron" />
            Skills Development
          </h4>
          <div className="space-y-3">
            {skillProgress.map((skill) => (
              <div key={skill.skill} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium flex items-center gap-2">
                    <span>{skill.instrument}</span>
                    {skill.skill}
                  </span>
                  <span className="text-xs text-muted-foreground">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Badges */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Star className="w-4 h-4 text-purple-500" />
            Cultural Badges
          </h4>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">🎭 Traditional Artist</Badge>
            <Badge variant="outline" className="text-xs">🌾 Punjab Pride</Badge>
            <Badge variant="outline" className="text-xs opacity-50">🎪 Festival Performer</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
