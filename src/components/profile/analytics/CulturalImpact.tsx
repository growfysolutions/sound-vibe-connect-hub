
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, BookOpen, Users, TrendingUp, Award, Music } from 'lucide-react';

interface CulturalImpactProps {
  profileId: string;
  timeRange: string;
}

export function CulturalImpact({ profileId, timeRange }: CulturalImpactProps) {
  // Mock data - in real app, this would come from API
  const preservationContributions = [
    { month: 'Jan', traditional: 12, documentation: 8, teaching: 15 },
    { month: 'Feb', traditional: 18, documentation: 12, teaching: 22 },
    { month: 'Mar', traditional: 15, documentation: 10, teaching: 18 },
    { month: 'Apr', traditional: 22, documentation: 16, teaching: 28 },
    { month: 'May', traditional: 20, documentation: 14, teaching: 25 },
    { month: 'Jun', traditional: 28, documentation: 20, teaching: 35 }
  ];

  const fusionInnovations = [
    { category: 'Traditional-Electronic', count: 8, impact: 85 },
    { category: 'Folk-Pop Fusion', count: 12, impact: 92 },
    { category: 'Classical-Jazz', count: 5, impact: 78 },
    { category: 'Devotional-Modern', count: 15, impact: 88 },
    { category: 'Regional-Global', count: 10, impact: 81 }
  ];

  const communityEngagement = [
    { event: 'Cultural Festivals', participation: 24, impact: 2400 },
    { event: 'Educational Workshops', participation: 18, impact: 450 },
    { event: 'Community Concerts', participation: 15, impact: 1800 },
    { event: 'Youth Programs', participation: 32, impact: 960 },
    { event: 'Cultural Preservation', participation: 12, impact: 300 }
  ];

  const educationalImpact = [
    { metric: 'Students Taught', value: 127, growth: 23 },
    { metric: 'Tutorials Created', value: 45, growth: 67 },
    { metric: 'Knowledge Articles', value: 23, growth: 12 },
    { metric: 'Workshop Hours', value: 234, growth: 34 }
  ];

  const culturalAuthenticity = [
    { aspect: 'Language Preservation', score: 92, color: '#8B5CF6' },
    { aspect: 'Traditional Techniques', score: 88, color: '#06B6D4' },
    { aspect: 'Cultural Context', score: 95, color: '#10B981' },
    { aspect: 'Historical Accuracy', score: 87, color: '#F59E0B' },
    { aspect: 'Regional Variations', score: 83, color: '#EF4444' }
  ];

  const chartConfig = {
    traditional: { label: 'Traditional', color: 'hsl(var(--chart-1))' },
    documentation: { label: 'Documentation', color: 'hsl(var(--chart-2))' },
    teaching: { label: 'Teaching', color: 'hsl(var(--chart-3))' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Traditional Music Preservation */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-saffron" />
            Traditional Music Preservation Contributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <AreaChart data={preservationContributions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="traditional"
                stackId="1"
                stroke="hsl(var(--saffron))"
                fill="hsl(var(--saffron))"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="documentation"
                stackId="1"
                stroke="hsl(var(--blue-500))"
                fill="hsl(var(--blue-500))"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="teaching"
                stackId="1"
                stroke="hsl(var(--green-500))"
                fill="hsl(var(--green-500))"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Fusion Innovations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Modern-Traditional Fusion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fusionInnovations.map((innovation, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{innovation.category}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {innovation.count} works
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {innovation.impact}% impact
                  </span>
                </div>
              </div>
              <Progress value={innovation.impact} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Community Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Community Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={communityEngagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="event" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="participation" fill="hsl(var(--green-500))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Educational Content Impact */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Educational Content Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {educationalImpact.map((metric, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                <div className="text-sm text-muted-foreground mb-2">{metric.metric}</div>
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-600">
                  +{metric.growth}% growth
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Authenticity Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Cultural Authenticity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
              <div className="text-3xl font-bold text-amber-600">89%</div>
              <div className="text-sm text-muted-foreground">Overall Authenticity Score</div>
            </div>
            
            <div className="space-y-3">
              {culturalAuthenticity.map((aspect, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{aspect.aspect}</span>
                    <span className="font-medium">{aspect.score}%</span>
                  </div>
                  <Progress value={aspect.score} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cultural Impact Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Cultural Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-rose-500/10 to-pink-500/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-lg">🏆</div>
                <div className="font-medium text-sm">Cultural Preservation Award</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Recognized for documenting 50+ traditional Punjabi folk songs
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-lg">🎓</div>
                <div className="font-medium text-sm">Education Impact Leader</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Taught traditional music to 100+ students across 3 countries
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-lg">🌍</div>
                <div className="font-medium text-sm">Global Cultural Ambassador</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Promoted Punjabi culture in 15+ international festivals
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Cultural Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-saffron/10 to-amber-500/10">
              <div className="text-2xl font-bold text-saffron">342</div>
              <div className="text-sm text-muted-foreground">Cultural Impact Points</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="text-2xl font-bold text-purple-600">67</div>
              <div className="text-sm text-muted-foreground">Fusion Innovations</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <div className="text-2xl font-bold text-green-600">1,247</div>
              <div className="text-sm text-muted-foreground">People Educated</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-muted-foreground">Authenticity Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
