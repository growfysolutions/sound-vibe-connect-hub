import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VersionControlStats {
  type: string;
  icon: string;
  totalChanges: number;
  averageMergeTime: number;
  successRate: number;
  lastUpdated: string;
}

interface Contributor {
  name: string;
  contributionScore: number;
  avatar: string;
  lastActive: string;
}

export const CulturalVersionControl: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const versionControlStats: VersionControlStats[] = [
    {
      type: 'Cultural Guidelines',
      icon: '📜',
      totalChanges: 235,
      averageMergeTime: 14,
      successRate: 92,
      lastUpdated: '2 hours ago'
    },
    {
      type: 'UI/UX Standards',
      icon: '🎨',
      totalChanges: 189,
      averageMergeTime: 11,
      successRate: 95,
      lastUpdated: '1 hour ago'
    },
    {
      type: 'Accessibility Protocols',
      icon: '♿',
      totalChanges: 152,
      averageMergeTime: 16,
      successRate: 88,
      lastUpdated: '3 hours ago'
    },
    {
      type: 'Content Style Guide',
      icon: '✍️',
      totalChanges: 210,
      averageMergeTime: 13,
      successRate: 90,
      lastUpdated: '4 hours ago'
    }
  ];

  const topContributors: Contributor[] = [
    {
      name: 'Arjun Singh',
      contributionScore: 95,
      avatar: 'https://example.com/arjun.jpg',
      lastActive: '30 minutes ago'
    },
    {
      name: 'Priya Sharma',
      contributionScore: 92,
      avatar: 'https://example.com/priya.jpg',
      lastActive: '1 hour ago'
    },
    {
      name: 'Raj Patel',
      contributionScore: 88,
      avatar: 'https://example.com/raj.jpg',
      lastActive: '2 hours ago'
    },
    {
      name: 'Neha Verma',
      contributionScore: 85,
      avatar: 'https://example.com/neha.jpg',
      lastActive: '4 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-saffron">Cultural Version Control</h2>
          <p className="text-muted-foreground">Track changes and contributions to cultural guidelines</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'quarter'].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="guidelines" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guidelines">Guideline Analytics</TabsTrigger>
          <TabsTrigger value="contributions">Top Contributors</TabsTrigger>
        </TabsList>

        <TabsContent value="guidelines" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {versionControlStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <span className="mr-2">{stat.icon}</span>
                    {stat.type}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {stat.totalChanges} changes
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-saffron">
                        {stat.successRate}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Avg. {stat.averageMergeTime} days
                      </span>
                    </div>
                    <Progress value={stat.successRate} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Updated {stat.lastUpdated}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contributions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topContributors.map((contributor, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <img src={contributor.avatar} alt={contributor.name} className="w-6 h-6 rounded-full mr-2" />
                      {contributor.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {contributor.contributionScore} points
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Last active {contributor.lastActive}
                    </p>
                    <Progress value={contributor.contributionScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
