
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Music,
  Youtube,
  Instagram,
  Github,
  Zap,
  Cloud,
  Activity,
  Shield
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  isConnected: boolean;
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  dataPoints: number;
  category: 'music' | 'social' | 'analytics' | 'storage';
}

interface SyncStatus {
  integration: string;
  status: 'syncing' | 'completed' | 'failed';
  progress: number;
  lastUpdated: string;
}

export const ThirdPartyIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'spotify',
      name: 'Spotify',
      description: 'Sync your playlists and track listening habits',
      icon: Music,
      isConnected: true,
      status: 'active',
      lastSync: '2 hours ago',
      dataPoints: 1250,
      category: 'music'
    },
    {
      id: 'youtube',
      name: 'YouTube Music',
      description: 'Import your music library and preferences',
      icon: Youtube,
      isConnected: false,
      status: 'inactive',
      lastSync: 'Never',
      dataPoints: 0,
      category: 'music'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Share your musical journey and connect with fans',
      icon: Instagram,
      isConnected: true,
      status: 'error',
      lastSync: '1 day ago',
      dataPoints: 450,
      category: 'social'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Version control for your music projects',
      icon: Github,
      isConnected: false,
      status: 'inactive',
      lastSync: 'Never',
      dataPoints: 0,
      category: 'analytics'
    }
  ]);

  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([
    {
      integration: 'spotify',
      status: 'completed',
      progress: 100,
      lastUpdated: '2 hours ago'
    },
    {
      integration: 'instagram',
      status: 'failed',
      progress: 45,
      lastUpdated: '1 day ago'
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              isConnected: !integration.isConnected,
              status: !integration.isConnected ? 'active' : 'inactive'
            }
          : integration
      )
    );
  };

  const syncIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration || !integration.isConnected) return;

    // Simulate sync process
    setSyncStatuses(prev => {
      const existing = prev.find(s => s.integration === integrationId);
      if (existing) {
        return prev.map(s => 
          s.integration === integrationId 
            ? { ...s, status: 'syncing' as const, progress: 0 }
            : s
        );
      } else {
        return [...prev, {
          integration: integrationId,
          status: 'syncing' as const,
          progress: 0,
          lastUpdated: 'Now'
        }];
      }
    });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSyncStatuses(prev => 
        prev.map(s => 
          s.integration === integrationId && s.status === 'syncing'
            ? { ...s, progress: Math.min(s.progress + 10, 100) }
            : s
        )
      );
    }, 500);

    // Complete sync after 5 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setSyncStatuses(prev => 
        prev.map(s => 
          s.integration === integrationId
            ? { ...s, status: 'completed' as const, progress: 100, lastUpdated: 'Just now' }
            : s
        )
      );
    }, 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const IntegrationCard = ({ integration }: { integration: Integration }) => {
    const Icon = integration.icon;
    const syncStatus = syncStatuses.find(s => s.integration === integration.id);

    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(integration.status)}
              <Switch 
                checked={integration.isConnected}
                onCheckedChange={() => toggleIntegration(integration.id)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge 
                variant={integration.status === 'active' ? 'default' : 'secondary'}
                className={getStatusColor(integration.status)}
              >
                {integration.status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Sync</span>
              <span className="text-sm">{integration.lastSync}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Points</span>
              <span className="text-sm font-medium">{integration.dataPoints.toLocaleString()}</span>
            </div>

            {syncStatus && syncStatus.status === 'syncing' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Syncing...</span>
                  <span className="text-sm">{syncStatus.progress}%</span>
                </div>
                <Progress value={syncStatus.progress} className="h-2" />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => syncIntegration(integration.id)}
                disabled={!integration.isConnected || syncStatus?.status === 'syncing'}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const categories = [
    { id: 'music', name: 'Music Platforms', icon: Music },
    { id: 'social', name: 'Social Media', icon: Instagram },
    { id: 'analytics', name: 'Analytics', icon: Activity },
    { id: 'storage', name: 'Cloud Storage', icon: Cloud }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Zap className="w-8 h-8 text-blue-500" />
          Third-Party Integrations
        </h1>
        <p className="text-muted-foreground">
          Connect your favorite platforms to enhance your music experience
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Connected</p>
                    <p className="text-2xl font-bold">
                      {integrations.filter(i => i.isConnected).length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">
                      {integrations.filter(i => i.status === 'active').length}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Errors</p>
                    <p className="text-2xl font-bold">
                      {integrations.filter(i => i.status === 'error').length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data Points</p>
                    <p className="text-2xl font-bold">
                      {integrations.reduce((sum, i) => sum + i.dataPoints, 0).toLocaleString()}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations
              .filter(i => i.isConnected)
              .map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          {categories.map((category) => {
            const categoryIntegrations = integrations.filter(i => i.category === category.id);
            if (categoryIntegrations.length === 0) return null;

            return (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <category.icon className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryIntegrations.map((integration) => (
                    <IntegrationCard key={integration.id} integration={integration} />
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure global settings for your integrations here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
