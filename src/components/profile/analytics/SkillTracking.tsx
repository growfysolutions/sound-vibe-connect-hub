import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Music, Mic, TrendingUp } from 'lucide-react';

interface SkillTrackingProps {
  profileId: string;
  timeRange: string;
}

export function SkillTracking({}: SkillTrackingProps) {
  // Mock data - in real app, this would come from API
  const skillRadarData = [
    { skill: 'Vocals', current: 85, previous: 78, max: 100 },
    { skill: 'Dhol', current: 72, previous: 65, max: 100 },
    { skill: 'Harmonium', current: 68, previous: 60, max: 100 },
    { skill: 'Composition', current: 79, previous: 72, max: 100 },
    { skill: 'Production', current: 63, previous: 55, max: 100 },
    { skill: 'Performance', current: 88, previous: 82, max: 100 }
  ];

  const vocalProgress = [
    { month: 'Jan', range: 'C3-G5', score: 72 },
    { month: 'Feb', range: 'C3-A5', score: 76 },
    { month: 'Mar', range: 'B2-A5', score: 78 },
    { month: 'Apr', range: 'B2-B5', score: 82 },
    { month: 'May', range: 'A2-B5', score: 85 },
    { month: 'Jun', range: 'A2-C6', score: 88 }
  ];

  const theoryProgress = [
    { category: 'Raag Knowledge', progress: 78, total: 24, completed: 19 },
    { category: 'Taal Mastery', progress: 65, total: 12, completed: 8 },
    { category: 'Composition Theory', progress: 82, total: 15, completed: 12 },
    { category: 'Cultural Context', progress: 91, total: 20, completed: 18 }
  ];

  const culturalAuthenticity = {
    traditionalTechniques: 89,
    linguisticAccuracy: 85,
    culturalExpression: 92,
    instrumentalMastery: 76,
    overallScore: 86
  };

  const chartConfig = {
    current: { label: 'Current', color: 'hsl(var(--chart-1))' },
    previous: { label: 'Previous', color: 'hsl(var(--chart-2))' },
    score: { label: 'Score', color: 'hsl(var(--chart-3))' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Skill Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Skill Development Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <RadarChart data={skillRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Current"
                dataKey="current"
                stroke="hsl(var(--blue-500))"
                fill="hsl(var(--blue-500))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Previous"
                dataKey="previous"
                stroke="hsl(var(--muted-foreground))"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Vocal Range Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-500" />
            Vocal Range & Technique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="text-2xl font-bold text-purple-600">A2 - C6</div>
              <div className="text-sm text-muted-foreground">Current Range</div>
              <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-600">
                +4 semitones this month
              </Badge>
            </div>
            
            <ChartContainer config={chartConfig} className="h-48">
              <LineChart data={vocalProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--purple-500))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--purple-500))' }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Music Theory Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-500" />
            Music Theory Knowledge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {theoryProgress.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{category.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {category.completed}/{category.total}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {category.progress}%
                  </Badge>
                </div>
              </div>
              <Progress value={category.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cultural Authenticity Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-500" />
            Cultural Authenticity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
            <div className="text-3xl font-bold text-amber-600">{culturalAuthenticity.overallScore}/100</div>
            <div className="text-sm text-muted-foreground">Overall Authenticity Score</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Traditional Techniques</span>
              <span className="font-medium">{culturalAuthenticity.traditionalTechniques}%</span>
            </div>
            <Progress value={culturalAuthenticity.traditionalTechniques} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Linguistic Accuracy</span>
              <span className="font-medium">{culturalAuthenticity.linguisticAccuracy}%</span>
            </div>
            <Progress value={culturalAuthenticity.linguisticAccuracy} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Cultural Expression</span>
              <span className="font-medium">{culturalAuthenticity.culturalExpression}%</span>
            </div>
            <Progress value={culturalAuthenticity.culturalExpression} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Instrumental Mastery</span>
              <span className="font-medium">{culturalAuthenticity.instrumentalMastery}%</span>
            </div>
            <Progress value={culturalAuthenticity.instrumentalMastery} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Learning Achievements */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Learning Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-center">
              <div className="text-2xl">🎵</div>
              <div className="font-semibold text-sm mt-2">Raag Yaman Mastered</div>
              <div className="text-xs text-muted-foreground">2 days ago</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-center">
              <div className="text-2xl">🥁</div>
              <div className="font-semibold text-sm mt-2">Advanced Dhol Patterns</div>
              <div className="text-xs text-muted-foreground">1 week ago</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-center">
              <div className="text-2xl">📚</div>
              <div className="font-semibold text-sm mt-2">Punjabi Poetry Analysis</div>
              <div className="text-xs text-muted-foreground">2 weeks ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
