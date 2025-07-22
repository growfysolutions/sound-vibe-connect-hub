import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PerformanceAnalytics } from './analytics/PerformanceAnalytics';
import { CollaborationMetrics } from './analytics/CollaborationMetrics';
import { SkillTracking } from './analytics/SkillTracking';
import { IndustryRecognition } from './analytics/IndustryRecognition';
import { NetworkVisualization } from './analytics/NetworkVisualization';
import { CulturalImpact } from './analytics/CulturalImpact';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  Heart,
  Download,
  Share2,
  Calendar
} from 'lucide-react';

interface AnalyticsDashboardProps {
  profileId: string;
}

export function AnalyticsDashboard({ profileId }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState('performance');

  // Mock data - in real app, this would come from API
  const overallStats = {
    totalPlays: 125400,
    monthlyGrowth: 23.5,
    activeCollaborations: 8,
    skillLevel: 4.2,
    industryScore: 87,
    culturalImpact: 342
  };

  return (
    <div className="space-y-6">
      {/* Header with Overall Stats */}
      <Card className="border-saffron/20 bg-gradient-to-r from-card/95 to-background/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-saffron" />
              Professional Analytics
            </CardTitle>
            <div className="flex gap-2">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={timeRange === range ? 'bg-saffron hover:bg-saffron/90' : ''}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-saffron/10 to-amber-500/10">
              <div className="text-2xl font-bold text-saffron">{overallStats.totalPlays.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Plays</div>
              <Badge variant="secondary" className="mt-1 text-xs bg-green-500/20 text-green-600">
                +{overallStats.monthlyGrowth}%
              </Badge>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <div className="text-2xl font-bold text-blue-600">{overallStats.activeCollaborations}</div>
              <div className="text-xs text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="text-2xl font-bold text-purple-600">{overallStats.skillLevel}/5</div>
              <div className="text-xs text-muted-foreground">Skill Level</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <div className="text-2xl font-bold text-green-600">{overallStats.industryScore}</div>
              <div className="text-xs text-muted-foreground">Industry Score</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
              <div className="text-2xl font-bold text-amber-600">{overallStats.culturalImpact}</div>
              <div className="text-xs text-muted-foreground">Cultural Points</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-rose-500/10 to-red-500/10">
              <div className="text-2xl font-bold text-rose-600">4.8/5</div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-muted/50">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Collaboration</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="recognition" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Recognition</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Network</span>
          </TabsTrigger>
          <TabsTrigger value="cultural" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Cultural</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <PerformanceAnalytics profileId={profileId} timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="collaboration" className="mt-6">
          <CollaborationMetrics profileId={profileId} timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillTracking profileId={profileId} timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="recognition" className="mt-6">
          <IndustryRecognition profileId={profileId} timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="network" className="mt-6">
          <NetworkVisualization profileId={profileId} timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="cultural" className="mt-6">
          <CulturalImpact profileId={profileId} timeRange={timeRange} />
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Export Analytics Report</h3>
              <p className="text-sm text-muted-foreground">Generate comprehensive reports for industry professionals</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Insights
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Reports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
