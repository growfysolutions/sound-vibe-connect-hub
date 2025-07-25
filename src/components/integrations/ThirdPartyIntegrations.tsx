
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Music, 
  Play, 
  Upload, 
  Download, 
  Link, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Share2,
  BarChart3,
  Users,
  Calendar,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  platform: 'spotify' | 'youtube' | 'soundcloud' | 'apple_music' | 'bandcamp';
  status: 'connected' | 'disconnected' | 'error';
  connected_at?: string;
  access_token?: string;
  refresh_token?: string;
  user_id: string;
  profile_data?: any;
  sync_enabled: boolean;
  last_sync?: string;
}

interface PlatformStats {
  platform: string;
  followers: number;
  tracks: number;
  playlists: number;
  monthly_listeners?: number;
  total_plays: number;
}

interface SyncActivity {
  id: string;
  platform: string;
  action: 'upload' | 'download' | 'sync' | 'share';
  status: 'success' | 'error' | 'pending';
  description: string;
  timestamp: string;
}

export const ThirdPartyIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [syncActivity, setSyncActivity] = useState<SyncActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('platforms');

  useEffect(() => {
    fetchIntegrations();
    fetchPlatformStats();
    fetchSyncActivity();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('platform_integrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatformStats = async () => {
    try {
      const mockStats: PlatformStats[] = [
        {
          platform: 'spotify',
          followers: 1250,
          tracks: 45,
          playlists: 12,
          monthly_listeners: 5680,
          total_plays: 125000
        },
        {
          platform: 'youtube',
          followers: 3200,
          tracks: 38,
          playlists: 8,
          total_plays: 890000
        },
        {
          platform: 'soundcloud',
          followers: 890,
          tracks: 52,
          playlists: 15,
          total_plays: 67000
        }
      ];
      setPlatformStats(mockStats);
    } catch (error) {
      console.error('Error fetching platform stats:', error);
    }
  };

  const fetchSyncActivity = async () => {
    try {
      const mockActivity: SyncActivity[] = [
        {
          id: '1',
          platform: 'spotify',
          action: 'upload',
          status: 'success',
          description: 'Uploaded "New Track" to Spotify',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          platform: 'youtube',
          action: 'sync',
          status: 'pending',
          description: 'Syncing playlist "Best of 2024"',
          timestamp: new Date().toISOString()
        },
        {
          id: '3',
          platform: 'soundcloud',
          action: 'download',
          status: 'error',
          description: 'Failed to download analytics data',
          timestamp: new Date().toISOString()
        }
      ];
      setSyncActivity(mockActivity);
    } catch (error) {
      console.error('Error fetching sync activity:', error);
    }
  };

  const connectPlatform = async (platform: string) => {
    try {
      // Simulate OAuth flow
      const authUrl = `https://accounts.${platform}.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI`;
      
      // In a real implementation, you would redirect to the OAuth URL
      window.open(authUrl, '_blank', 'width=600,height=600');
      
      // Mock successful connection
      setTimeout(() => {
        toast.success(`Successfully connected to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
        fetchIntegrations();
      }, 2000);
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      toast.error(`Failed to connect to ${platform}`);
    }
  };

  const disconnectPlatform = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('platform_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;
      
      toast.success('Platform disconnected successfully');
      fetchIntegrations();
    } catch (error) {
      console.error('Error disconnecting platform:', error);
      toast.error('Failed to disconnect platform');
    }
  };

  const toggleSync = async (integrationId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('platform_integrations')
        .update({ sync_enabled: enabled })
        .eq('id', integrationId);

      if (error) throw error;
      
      toast.success(`Sync ${enabled ? 'enabled' : 'disabled'} successfully`);
      fetchIntegrations();
    } catch (error) {
      console.error('Error toggling sync:', error);
      toast.error('Failed to update sync settings');
    }
  };

  const syncNow = async (platform: string) => {
    try {
      toast.success(`Started syncing with ${platform}`);
      // In a real implementation, you would trigger the sync process
      fetchSyncActivity();
    } catch (error) {
      console.error('Error syncing:', error);
      toast.error('Failed to start sync');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'spotify': return <Music className="w-6 h-6 text-green-500" />;
      case 'youtube': return <Play className="w-6 h-6 text-red-500" />;
      case 'soundcloud': return <Music className="w-6 h-6 text-orange-500" />;
      case 'apple_music': return <Music className="w-6 h-6 text-gray-800" />;
      case 'bandcamp': return <Music className="w-6 h-6 text-blue-500" />;
      default: return <Music className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
      case 'sync': return <RefreshCw className="w-4 h-4" />;
      case 'share': return <Share2 className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const platforms = [
    { id: 'spotify', name: 'Spotify', color: 'bg-green-500' },
    { id: 'youtube', name: 'YouTube Music', color: 'bg-red-500' },
    { id: 'soundcloud', name: 'SoundCloud', color: 'bg-orange-500' },
    { id: 'apple_music', name: 'Apple Music', color: 'bg-gray-800' },
    { id: 'bandcamp', name: 'Bandcamp', color: 'bg-blue-500' }
  ];

  const PlatformCard = ({ platform, integration }: { platform: any; integration?: Integration }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {getPlatformIcon(platform.id)}
            <div>
              <CardTitle className="text-lg">{platform.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {integration ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>
          <Badge className={integration ? getStatusColor(integration.status) : 'bg-gray-500'}>
            {integration ? integration.status : 'disconnected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {integration ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-sync</span>
              <Switch 
                checked={integration.sync_enabled}
                onCheckedChange={(checked) => toggleSync(integration.id, checked)}
              />
            </div>
            
            {integration.last_sync && (
              <p className="text-sm text-muted-foreground">
                Last sync: {new Date(integration.last_sync).toLocaleDateString()}
              </p>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => syncNow(platform.id)}
                className="flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Sync Now
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => disconnectPlatform(integration.id)}
                className="text-red-600 hover:text-red-700"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your {platform.name} account to sync your music and analytics
            </p>
            <Button 
              onClick={() => connectPlatform(platform.id)}
              className="w-full"
            >
              <Link className="w-4 h-4 mr-2" />
              Connect to {platform.name}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const StatsCard = ({ stats }: { stats: PlatformStats }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {getPlatformIcon(stats.platform)}
          <CardTitle className="capitalize">{stats.platform}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{stats.followers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{stats.tracks}</p>
            <p className="text-sm text-muted-foreground">Tracks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{stats.total_plays.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Plays</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{stats.playlists}</p>
            <p className="text-sm text-muted-foreground">Playlists</p>
          </div>
          {stats.monthly_listeners && (
            <div className="text-center col-span-2">
              <p className="text-2xl font-bold text-primary">{stats.monthly_listeners.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Monthly Listeners</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity }: { activity: SyncActivity }) => (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <div className="flex items-center gap-2">
        {getPlatformIcon(activity.platform)}
        {getActionIcon(activity.action)}
      </div>
      <div className="flex-1">
        <p className="font-medium">{activity.description}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {activity.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
        {activity.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
        {activity.status === 'pending' && <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />}
        <Badge variant={activity.status === 'success' ? 'default' : activity.status === 'error' ? 'destructive' : 'secondary'}>
          {activity.status}
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Platform Integrations</h1>
        <p className="text-muted-foreground">
          Connect and sync your music across all major platforms
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const integration = integrations.find(i => i.platform === platform.id);
              return (
                <PlatformCard 
                  key={platform.id} 
                  platform={platform} 
                  integration={integration}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformStats.map((stats) => (
              <StatsCard key={stats.platform} stats={stats} />
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Cross-Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformStats.map((stats) => (
                  <div key={stats.platform} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{stats.platform}</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.total_plays.toLocaleString()} plays
                      </span>
                    </div>
                    <Progress 
                      value={(stats.total_plays / Math.max(...platformStats.map(s => s.total_plays))) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-sync new releases</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically distribute new tracks to all connected platforms
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sync analytics daily</p>
                    <p className="text-sm text-muted-foreground">
                      Update play counts and analytics from all platforms
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cross-platform playlists</p>
                    <p className="text-sm text-muted-foreground">
                      Sync playlist updates across all platforms
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Metadata synchronization</p>
                    <p className="text-sm text-muted-foreground">
                      Keep track information consistent across platforms
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sync Frequency</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Rate Limit</label>
                  <Input type="number" defaultValue="100" placeholder="Requests per minute" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Timeout</label>
                  <Input type="number" defaultValue="30" placeholder="Seconds" />
                </div>
                
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
