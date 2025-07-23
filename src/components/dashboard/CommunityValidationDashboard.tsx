
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, TrendingUp, Award, Globe } from 'lucide-react';

interface FeedbackStats {
  category: string;
  icon: string;
  totalResponses: number;
  positiveRating: number;
  averageScore: number;
  lastUpdated: string;
}

interface CommunityGroup {
  name: string;
  description: string;
  targetSize: number;
  currentSize: number;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export const CommunityValidationDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const feedbackStats: FeedbackStats[] = [
    {
      category: 'Cultural Authenticity',
      icon: '🎭',
      totalResponses: 127,
      positiveRating: 86,
      averageScore: 4.3,
      lastUpdated: '2 hours ago'
    },
    {
      category: 'Professional Utility',
      icon: '🎵',
      totalResponses: 94,
      positiveRating: 78,
      averageScore: 4.1,
      lastUpdated: '4 hours ago'
    },
    {
      category: 'Visual Appeal',
      icon: '🎨',
      totalResponses: 156,
      positiveRating: 91,
      averageScore: 4.5,
      lastUpdated: '1 hour ago'
    },
    {
      category: 'Usability',
      icon: '🔧',
      totalResponses: 103,
      positiveRating: 82,
      averageScore: 4.2,
      lastUpdated: '3 hours ago'
    },
    {
      category: 'Performance',
      icon: '⚡',
      totalResponses: 89,
      positiveRating: 75,
      averageScore: 3.9,
      lastUpdated: '5 hours ago'
    }
  ];

  const communityGroups: CommunityGroup[] = [
    {
      name: 'Native Punjabi Speakers',
      description: 'Community members who speak Punjabi as their first language',
      targetSize: 50,
      currentSize: 32,
      icon: '🗣️',
      priority: 'high'
    },
    {
      name: 'Professional Punjabi Musicians',
      description: 'Active musicians in the Punjabi music industry',
      targetSize: 30,
      currentSize: 18,
      icon: '🎼',
      priority: 'high'
    },
    {
      name: 'Music Industry Professionals',
      description: 'Producers, managers, and industry experts',
      targetSize: 20,
      currentSize: 12,
      icon: '🏢',
      priority: 'medium'
    },
    {
      name: 'UI/UX Accessibility Experts',
      description: 'Specialists in inclusive design and accessibility',
      targetSize: 10,
      currentSize: 7,
      icon: '♿',
      priority: 'medium'
    },
    {
      name: 'Cultural Authenticity Consultants',
      description: 'Experts in Punjabi culture and traditions',
      targetSize: 5,
      currentSize: 3,
      icon: '🏛️',
      priority: 'high'
    }
  ];

  const culturalCalendar = [
    { name: 'Vaisakhi Celebration', date: 'April 13, 2024', status: 'upcoming', type: 'major' },
    { name: 'Guru Nanak Jayanti', date: 'November 15, 2024', status: 'planned', type: 'major' },
    { name: 'Diwali Collaborative Projects', date: 'October 31, 2024', status: 'planned', type: 'medium' },
    { name: 'Harvest Festival Integration', date: 'October 1, 2024', status: 'planned', type: 'medium' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-saffron">Community Validation Dashboard</h2>
          <p className="text-muted-foreground">Cultural authenticity and user experience insights</p>
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

      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feedback">Feedback Analytics</TabsTrigger>
          <TabsTrigger value="community">Community Groups</TabsTrigger>
          <TabsTrigger value="testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="calendar">Cultural Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedbackStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <span className="mr-2">{stat.icon}</span>
                    {stat.category}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {stat.totalResponses} responses
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-saffron">
                        {stat.positiveRating}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stat.averageScore}/5.0
                      </span>
                    </div>
                    <Progress value={stat.positiveRating} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Updated {stat.lastUpdated}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {communityGroups.map((group, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span>{group.icon}</span>
                      {group.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(group.priority)}`} />
                      <Badge variant="outline" className="text-xs">
                        {group.priority} priority
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {group.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{group.currentSize}/{group.targetSize}</span>
                    </div>
                    <Progress 
                      value={(group.currentSize / group.targetSize) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Active A/B Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Color Palette Preference</h4>
                    <Badge>Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Traditional Saffron/Gold</div>
                      <div className="text-muted-foreground">47% users</div>
                    </div>
                    <div>
                      <div className="font-medium">Modern Orange/Blue</div>
                      <div className="text-muted-foreground">53% users</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Navigation Layout</h4>
                    <Badge>Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Horizontal Tabs</div>
                      <div className="text-muted-foreground">51% users</div>
                    </div>
                    <div>
                      <div className="font-medium">Vertical Sidebar</div>
                      <div className="text-muted-foreground">49% users</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Cultural Calendar Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {culturalCalendar.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">{event.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={event.status === 'upcoming' ? 'default' : 'outline'}>
                        {event.status}
                      </Badge>
                      <Badge variant="secondary">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
