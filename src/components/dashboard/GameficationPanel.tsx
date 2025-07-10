import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ShieldCheck, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const GameficationPanel = () => {
  const userProgress = {
    level: 3,
    levelName: 'Rising Star',
    progress: 65,
    points: 2850,
    nextLevelPoints: 5000,
  };

  const achievements = [
    { id: 1, icon: <Trophy className="w-5 h-5 text-yellow-500" />, title: 'First Collaboration', description: 'Completed your first project with another artist.' },
    { id: 2, icon: <ShieldCheck className="w-5 h-5 text-green-500" />, title: 'Verified Artist', description: 'Completed profile verification.' },
    { id: 3, icon: <Zap className="w-5 h-5 text-blue-500" />, title: 'Power Networker', description: 'Connected with 10 professionals.' },
  ];

  return (
    <Card className="floating-card">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-1">
            <h3 className="font-semibold">Level {userProgress.level}: {userProgress.levelName}</h3>
            <p className="text-sm text-muted-foreground">{userProgress.points} / {userProgress.nextLevelPoints} XP</p>
          </div>
          <Progress value={userProgress.progress} className="w-full" />
        </div>
        <div>
          <h4 className="font-semibold mb-3">Achievements</h4>
          <ul className="space-y-3">
            {achievements.map(ach => (
              <li key={ach.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  {ach.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{ach.title}</p>
                  <p className="text-xs text-muted-foreground">{ach.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Button variant="outline" className="w-full hover-scale">View All Achievements</Button>
      </CardContent>
    </Card>
  );
};

export default GameficationPanel;

