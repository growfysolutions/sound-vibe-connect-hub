
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, MapPin, Clock, Users } from 'lucide-react';

interface PerformanceAnalyticsProps {
  profileId: string;
  timeRange: string;
}

export function PerformanceAnalytics({ profileId, timeRange }: PerformanceAnalyticsProps) {
  // Mock data - in real app, this would come from API
  const playsOverTime = [
    { date: '2024-01', plays: 8500, engagement: 65 },
    { date: '2024-02', plays: 12200, engagement: 72 },
    { date: '2024-03', plays: 15800, engagement: 68 },
    { date: '2024-04', plays: 18500, engagement: 74 },
    { date: '2024-05', plays: 22100, engagement: 78 },
    { date: '2024-06', plays: 19800, engagement: 71 },
    { date: '2024-07', plays: 28400, engagement: 82 }
  ];

  const geographicData = [
    { region: 'Punjab, India', plays: 45600, percentage: 36.4 },
    { region: 'UK', plays: 28900, percentage: 23.1 },
    { region: 'Canada', plays: 18700, percentage: 14.9 },
    { region: 'USA', plays: 15200, percentage: 12.1 },
    { region: 'Australia', plays: 8900, percentage: 7.1 },
    { region: 'Others', plays: 8100, percentage: 6.4 }
  ];

  const listeningPatterns = [
    { hour: '6AM', plays: 1200 },
    { hour: '9AM', plays: 2800 },
    { hour: '12PM', plays: 4200 },
    { hour: '3PM', plays: 3800 },
    { hour: '6PM', plays: 6200 },
    { hour: '9PM', plays: 8900 },
    { hour: '12AM', plays: 5400 }
  ];

  const audienceDemographics = [
    { name: '18-24', value: 28, color: '#8B5CF6' },
    { name: '25-34', value: 35, color: '#06B6D4' },
    { name: '35-44', value: 22, color: '#10B981' },
    { name: '45-54', value: 12, color: '#F59E0B' },
    { name: '55+', value: 3, color: '#EF4444' }
  ];

  const chartConfig = {
    plays: { label: 'Plays', color: 'hsl(var(--chart-1))' },
    engagement: { label: 'Engagement %', color: 'hsl(var(--chart-2))' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Plays Over Time */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-saffron" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <AreaChart data={playsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="plays"
                stroke="hsl(var(--saffron))"
                fill="hsl(var(--saffron))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Geographic Reach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {geographicData.map((region) => (
            <div key={region.region} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{region.region}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{region.plays.toLocaleString()}</span>
                  <Badge variant="secondary" className="text-xs">
                    {region.percentage}%
                  </Badge>
                </div>
              </div>
              <Progress value={region.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Peak Listening Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            Peak Listening Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={listeningPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="plays" fill="hsl(var(--green-500))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Audience Demographics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Audience Demographics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <ChartContainer config={chartConfig} className="h-64 w-64">
                <PieChart>
                  <Pie
                    data={audienceDemographics}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {audienceDemographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Age Distribution</h4>
              {audienceDemographics.map((demo) => (
                <div key={demo.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: demo.color }}
                    />
                    <span className="text-sm">{demo.name} years</span>
                  </div>
                  <span className="text-sm font-medium">{demo.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
