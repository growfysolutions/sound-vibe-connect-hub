import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, TrendingUp, DollarSign, Repeat } from 'lucide-react';

interface CollaborationMetricsProps {
  profileId: string;
  timeRange: string;
}

export function CollaborationMetrics({}: CollaborationMetricsProps) {
  // Mock data - in real app, this would come from API
  const completionRates = [
    { month: 'Jan', completed: 12, started: 15, rate: 80 },
    { month: 'Feb', completed: 18, started: 20, rate: 90 },
    { month: 'Mar', completed: 14, started: 18, rate: 78 },
    { month: 'Apr', completed: 22, started: 25, rate: 88 },
    { month: 'May', completed: 19, started: 22, rate: 86 },
    { month: 'Jun', completed: 25, started: 28, rate: 89 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 2400, projects: 8 },
    { month: 'Feb', revenue: 3200, projects: 12 },
    { month: 'Mar', revenue: 2800, projects: 10 },
    { month: 'Apr', revenue: 4100, projects: 15 },
    { month: 'May', revenue: 3600, projects: 13 },
    { month: 'Jun', revenue: 4800, projects: 18 }
  ];

  const topCollaborators = [
    {
      id: 1,
      name: 'Simran Kaur',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b132?w=150',
      projects: 8,
      rating: 4.9,
      category: 'Vocalist'
    },
    {
      id: 2,
      name: 'Arjun Singh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      projects: 6,
      rating: 4.8,
      category: 'Producer'
    },
    {
      id: 3,
      name: 'Preet Kaur',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      projects: 5,
      rating: 4.7,
      category: 'Lyricist'
    }
  ];

  const satisfactionMetrics = {
    overall: 4.6,
    communication: 4.8,
    creativity: 4.5,
    timeliness: 4.4,
    professionalism: 4.7
  };

  const chartConfig = {
    completed: { label: 'Completed', color: 'hsl(var(--chart-1))' },
    rate: { label: 'Success Rate %', color: 'hsl(var(--chart-2))' },
    revenue: { label: 'Revenue ($)', color: 'hsl(var(--chart-3))' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Project Completion Rates */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Project Completion Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={completionRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="completed" fill="hsl(var(--green-500))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Partner Satisfaction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Partner Satisfaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{satisfactionMetrics.overall}/5</div>
            <div className="text-sm text-muted-foreground">Overall Rating</div>
          </div>
          
          <div className="space-y-3">
            {Object.entries(satisfactionMetrics).slice(1).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{key}</span>
                  <span className="font-medium">{value}/5</span>
                </div>
                <Progress value={(value / 5) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Generated */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-500" />
            Revenue Generated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--amber-500))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--amber-500))' }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Collaborators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-purple-500" />
            Top Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topCollaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                  <AvatarFallback>{collaborator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{collaborator.name}</div>
                  <div className="text-xs text-muted-foreground">{collaborator.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{collaborator.projects} projects</div>
                <Badge variant="secondary" className="text-xs">
                  ⭐ {collaborator.rating}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Success Metrics Summary */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Collaboration Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-muted-foreground">Avg Completion Rate</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <div className="text-2xl font-bold text-blue-600">73%</div>
              <div className="text-sm text-muted-foreground">Repeat Collaborations</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
              <div className="text-2xl font-bold text-amber-600">$21.5K</div>
              <div className="text-sm text-muted-foreground">Total Revenue (6M)</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="text-2xl font-bold text-purple-600">45</div>
              <div className="text-sm text-muted-foreground">Active Partners</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
