import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, Music, MessageSquare, Eye, Heart, 
  Target, Award, Clock, Activity 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  profileViews: number;
  profileViewsChange: number;
  connections: number;
  connectionsChange: number;
  projects: number;
  projectsChange: number;
  messages: number;
  messagesChange: number;
  weeklyActivity: Array<{ day: string; views: number; connections: number; messages: number }>;
  genreInterests: Array<{ name: string; value: number; color: string }>;
  skillDistribution: Array<{ skill: string; projects: number; collaborations: number }>;
  monthlyGrowth: Array<{ month: string; connections: number; projects: number; profile_views: number }>;
  topCollaborators: Array<{ name: string; projects: number; rating: number; avatar: string }>;
  recentAchievements: Array<{ title: string; date: string; type: string; description: string }>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F'];

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // This would typically come from a comprehensive analytics API
        // For now, we'll generate mock data based on real user data
        const mockAnalytics = await generateAnalyticsData(user.id);
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  const generateAnalyticsData = async (userId: string): Promise<AnalyticsData> => {
    // Fetch real data where possible
    const { data: connections } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted');

    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Generate analytics with some real data mixed with calculated/mock data
    return {
      profileViews: Math.floor(Math.random() * 500) + 100,
      profileViewsChange: Math.floor(Math.random() * 40) - 20,
      connections: connections?.length || 0,
      connectionsChange: Math.floor(Math.random() * 20) - 5,
      projects: projects?.length || 0,
      projectsChange: Math.floor(Math.random() * 10) - 2,
      messages: Math.floor(Math.random() * 50) + 10,
      messagesChange: Math.floor(Math.random() * 30) - 10,
      
      weeklyActivity: [
        { day: 'Mon', views: 45, connections: 2, messages: 8 },
        { day: 'Tue', views: 52, connections: 1, messages: 12 },
        { day: 'Wed', views: 38, connections: 3, messages: 5 },
        { day: 'Thu', views: 67, connections: 0, messages: 15 },
        { day: 'Fri', views: 72, connections: 4, messages: 20 },
        { day: 'Sat', views: 58, connections: 2, messages: 8 },
        { day: 'Sun', views: 41, connections: 1, messages: 6 },
      ],
      
      genreInterests: (profile?.genres || ['Pop', 'Rock', 'Electronic']).map((genre, index) => ({
        name: genre,
        value: Math.floor(Math.random() * 30) + 10,
        color: COLORS[index % COLORS.length]
      })),
      
      skillDistribution: [
        { skill: 'Production', projects: 8, collaborations: 12 },
        { skill: 'Mixing', projects: 5, collaborations: 8 },
        { skill: 'Songwriting', projects: 10, collaborations: 15 },
        { skill: 'Vocals', projects: 6, collaborations: 10 },
        { skill: 'Instruments', projects: 4, collaborations: 7 },
      ],
      
      monthlyGrowth: [
        { month: 'Jan', connections: 5, projects: 2, profile_views: 120 },
        { month: 'Feb', connections: 8, projects: 3, profile_views: 180 },
        { month: 'Mar', connections: 12, projects: 4, profile_views: 240 },
        { month: 'Apr', connections: 15, projects: 6, profile_views: 320 },
        { month: 'May', connections: 18, projects: 8, profile_views: 380 },
        { month: 'Jun', connections: 22, projects: 10, profile_views: 450 },
      ],
      
      topCollaborators: [
        { name: 'Alex Johnson', projects: 5, rating: 4.9, avatar: '/placeholder.jpg' },
        { name: 'Sam Wilson', projects: 3, rating: 4.8, avatar: '/placeholder.jpg' },
        { name: 'Jordan Lee', projects: 4, rating: 4.7, avatar: '/placeholder.jpg' },
      ],
      
      recentAchievements: [
        { title: 'Networking Pro', date: '2 days ago', type: 'connection', description: 'Connected with 10 professionals' },
        { title: 'Project Starter', date: '1 week ago', type: 'project', description: 'Created 5 collaborative projects' },
        { title: 'Community Builder', date: '2 weeks ago', type: 'engagement', description: 'Received 50 profile views' },
      ]
    };
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change !== undefined && (
              <p className={`text-xs ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change}% from last period
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-card">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="h-64 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Profile Views"
            value={analytics.profileViews}
            change={analytics.profileViewsChange}
            icon={Eye}
            trend="up"
          />
          <StatCard
            title="Connections"
            value={analytics.connections}
            change={analytics.connectionsChange}
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Projects"
            value={analytics.projects}
            change={analytics.projectsChange}
            icon={Music}
            trend="up"
          />
          <StatCard
            title="Messages"
            value={analytics.messages}
            change={analytics.messagesChange}
            icon={MessageSquare}
            trend="up"
          />
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="growth" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" name="Profile Views" />
                      <Bar dataKey="messages" fill="#82ca9d" name="Messages" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Genre Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.genreInterests}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analytics.genreInterests.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={analytics.monthlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="profile_views" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="connections" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="projects" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.skillDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="projects" fill="#8884d8" name="Projects" />
                      <Bar dataKey="collaborations" fill="#82ca9d" name="Collaborations" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Collaborators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.topCollaborators.map((collaborator, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full" />
                        <div>
                          <p className="font-medium">{collaborator.name}</p>
                          <p className="text-sm text-muted-foreground">{collaborator.projects} projects</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{collaborator.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Award className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{achievement.description}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{achievement.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Monthly Connections</span>
                      <span>8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span>85/100</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Project Collaborations</span>
                      <span>6/8</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Community Engagement</span>
                      <span>92/100</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
