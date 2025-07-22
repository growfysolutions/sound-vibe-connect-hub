import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, Clock, Languages, DollarSign, ExternalLink } from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  type: 'tutorial' | 'theory' | 'language' | 'business';
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress?: number;
  instructor?: string;
  description: string;
  icon: string;
}

export function LearningCornerWidget() {
  const [activeCategory, setActiveCategory] = useState<'tutorial' | 'theory' | 'language' | 'business'>('tutorial');

  const learningModules: LearningModule[] = [
    {
      id: '1',
      title: 'Dhol Basics: Your First Beat',
      type: 'tutorial',
      duration: '15 min',
      difficulty: 'Beginner',
      progress: 75,
      instructor: 'Master Gurcharan Singh',
      description: 'Learn the fundamental dhol beats used in traditional Bhangra',
      icon: '🥁'
    },
    {
      id: '2',
      title: 'Harmonium Finger Positions',
      type: 'tutorial',
      duration: '20 min',
      difficulty: 'Beginner',
      progress: 30,
      instructor: 'Ustad Rajesh Kumar',
      description: 'Master proper finger placement for smooth harmonium playing',
      icon: '🎹'
    },
    {
      id: '3',
      title: 'Understanding Raag Structures',
      type: 'theory',
      duration: '35 min',
      difficulty: 'Intermediate',
      instructor: 'Dr. Simran Kaur',
      description: 'Deep dive into the theory behind traditional Punjabi raags',
      icon: '📚'
    },
    {
      id: '4',
      title: 'Punjabi for Musicians',
      type: 'language',
      duration: '25 min',
      difficulty: 'Beginner',
      progress: 60,
      instructor: 'Prof. Amarjeet Singh',
      description: 'Essential Punjabi vocabulary for musical collaboration',
      icon: '🗣️'
    },
    {
      id: '5',
      title: 'Music Copyright & Rights',
      type: 'business',
      duration: '30 min',
      difficulty: 'Intermediate',
      instructor: 'Legal Expert Priya Sharma',
      description: 'Protect your musical creations and understand royalties',
      icon: '⚖️'
    }
  ];

  const filteredModules = learningModules.filter(module => module.type === activeCategory);

  const getCategoryIcon = (category: typeof activeCategory) => {
    switch (category) {
      case 'tutorial': return <Play className="w-4 h-4" />;
      case 'theory': return <BookOpen className="w-4 h-4" />;
      case 'language': return <Languages className="w-4 h-4" />;
      case 'business': return <DollarSign className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: LearningModule['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  return (
    <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-saffron" />
          <span>Learning Corner</span>
        </CardTitle>
        <div className="flex gap-1 mt-2 flex-wrap">
          <Button
            size="sm"
            variant={activeCategory === 'tutorial' ? 'default' : 'ghost'}
            onClick={() => setActiveCategory('tutorial')}
            className="text-xs h-7"
          >
            <Play className="w-3 h-3 mr-1" />
            Tutorials
          </Button>
          <Button
            size="sm"
            variant={activeCategory === 'theory' ? 'default' : 'ghost'}
            onClick={() => setActiveCategory('theory')}
            className="text-xs h-7"
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Theory
          </Button>
          <Button
            size="sm"
            variant={activeCategory === 'language' ? 'default' : 'ghost'}
            onClick={() => setActiveCategory('language')}
            className="text-xs h-7"
          >
            <Languages className="w-3 h-3 mr-1" />
            Language
          </Button>
          <Button
            size="sm"
            variant={activeCategory === 'business' ? 'default' : 'ghost'}
            onClick={() => setActiveCategory('business')}
            className="text-xs h-7"
          >
            <DollarSign className="w-3 h-3 mr-1" />
            Business
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredModules.map((module) => (
          <div 
            key={module.id}
            className="p-3 bg-muted/20 rounded-lg border border-border/30 hover:border-saffron/30 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{module.icon}</span>
                <div>
                  <h4 className="text-sm font-semibold">{module.title}</h4>
                  {module.instructor && (
                    <p className="text-xs text-muted-foreground">by {module.instructor}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {module.duration}
                </Badge>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">{module.description}</p>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(module.difficulty)}`}>
                {module.difficulty}
              </span>
              
              {module.progress !== undefined ? (
                <div className="flex items-center space-x-2 flex-1 ml-3">
                  <Progress value={module.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground">{module.progress}%</span>
                </div>
              ) : (
                <Button size="sm" variant="ghost" className="text-xs">
                  Start Learning
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Quick Stats */}
        <div className="border-t border-border/30 pt-3 mt-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs font-medium">12</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-xs font-medium">5</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div>
              <p className="text-xs font-medium">28h</p>
              <p className="text-xs text-muted-foreground">Total Time</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
