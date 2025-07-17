import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Music, 
  Star, 
  Eye, 
  Heart, 
  MessageSquare,
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  profileViews: number;
  connectionRequests: number;
  projectViews: number;
  collaborationRequests: number;
  weeklyActivity: Array<{ day: string; value: number }>;
  genreDistribution: Array<{ genre: string; count: number; color: string }>;
  skillsProgress: Array<{ skill: string; level: number; growth: number }>;
  monthlyStats: Array<{ month: string; connections: number; projects: number; views: number }>;
}

interface AnalyticsDashboardProps {
  userId: string;
  userProfile: any;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f'];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  userId,
  userProfile
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [userId, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    try {
      // Simulate analytics data (in real app, this would come from actual user activity tracking)
      const mockAnalytics: AnalyticsData = {
        profileViews: Math.floor(Math.random() * 500) + 100,
        connectionRequests: Math.floor(Math.random() * 50) + 10,
        projectViews: Math.floor(Math.random() * 1000) + 200,
        collaborationRequests: Math.floor(Math.random() * 30) + 5,
        weeklyActivity: [
          { day: 'Mon', value: Math.floor(Math.random() * 50) + 10 },
          { day: 'Tue', value: Math.floor(Math.random() * 50) + 10 },
          { day: 'Wed', value: Math.floor(Math.random() * 50) + 10 },
          { day: 'Thu', value: Math.floor(Math.random() * 50) + 10 },
          { day: 'Fri', value: Math.floor(Math.random() * 50) + 10 },
          { day: 'Sat', value: Math.floor(Math.random() * 50) + 10 },
          { day: 'Sun', value: Math.floor(Math.random() * 50) + 10 },
        ],
        genreDistribution: [
          { genre: 'Pop', count: 15, color: COLORS[0] },
          { genre: 'Rock', count: 12, color: COLORS[1] },
          { genre: 'Electronic', count: 8, color: COLORS[2] },
          { genre: 'Hip Hop', count: 6, color: COLORS[3] },
          { genre: 'Jazz', count: 4, color: COLORS[4] },
          { genre: 'Other', count: 3, color: COLORS[5] },
        ],
        skillsProgress: [
          { skill: 'Vocals', level: 85, growth: 12 },
          { skill: 'Guitar', level: 70, growth: 8 },
          { skill: 'Production', level: 60, growth: 15 },
          { skill: 'Mixing', level: 45, growth: 20 },
          { skill: 'Composition', level: 75, growth: 5 },
        ],
        monthlyStats: [
          { month: 'Jan', connections: 5, projects: 2, views: 120 },
          { month: 'Feb', connections: 8, projects: 3, views: 150 },
          { month: 'Mar', connections: 12, projects: 4, views: 200 },
          { month: 'Apr', connections: 15, projects: 6, views: 250 },
          { month: 'May', connections: 18, projects: 5, views: 280 },
          { month: 'Jun', connections: 22, projects: 7, views: 320 },
        ]
      };

      // Fetch real data where available
      const { data: connections } = await supabase
        .from('connections')
        .select('created_at')
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
        .eq('status', 'accepted');

      const { data: projects } = await supabase
        .from('projects')
        .select('created_at, likes, plays')
        .eq('user_id', userId);

      if (connections) {
        mockAnalytics.connectionRequests = connections.length;
      }

      if (projects) {
        mockAnalytics.projectViews = projects.reduce((sum, p) => sum + (p.plays || 0), 0);
      }

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getGrowthIndicator = (value: number) => {
    if (value > 10) return { icon: TrendingUp, color: 'text-green-500', label: 'High Growth' };
    if (value > 5) return { icon: TrendingUp, color: 'text-blue-500', label: 'Moderate Growth' };
    return { icon: TrendingUp, color: 'text-gray-500', label: 'Steady' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your music career progress</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{analytics.profileViews}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connections</p>
                <p className="text-2xl font-bold">{analytics.connectionRequests}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500">+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Project Views</p>
                <p className="text-2xl font-bold">{analytics.projectViews}</p>
              </div>
              <Music className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500">+25% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collaboration Requests</p>
                <p className="text-2xl font-bold">{analytics.collaborationRequests}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500">+5% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Progress</TabsTrigger>
          <TabsTrigger value="genres">Genre Analysis</TabsTrigger>
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your engagement throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Growth</CardTitle>
                <CardDescription>Connections and projects over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="connections" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="projects" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Development</CardTitle>
              <CardDescription>Track your improvement in different musical skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.skillsProgress.map(skill => {
                  const growth = getGrowthIndicator(skill.growth);
                  return (
                    <div key={skill.skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill.skill}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            +{skill.growth}%
                          </Badge>
                          <growth.icon className={`w-4 h-4 ${growth.color}`} />
                        </div>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{skill.level}% Complete</span>
                        <span>{growth.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Genre Distribution</CardTitle>
              <CardDescription>Your musical preferences and collaborations by genre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.genreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ genre, percent }) => `${genre} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.genreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-3">
                  {analytics.genreDistribution.map(genre => (
                    <div key={genre.genre} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: genre.color }}
                        ></div>
                        <span className="font-medium">{genre.genre}</span>
                      </div>
                      <Badge variant="outline">{genre.count} projects</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Insights</CardTitle>
              <CardDescription>AI-powered insights about your career progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">Key Strength</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Your profile views are 40% above average for musicians in your genre. Your bio and portfolio are particularly engaging.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-700 dark:text-green-300">Growth Opportunity</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Consider expanding into related genres like Indie Pop. Your current audience shows 60% overlap with this genre.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-orange-700 dark:text-orange-300">Achievement Unlock</span>
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    You're close to reaching 25 connections! This milestone will unlock the "Community Builder" badge and premium features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};