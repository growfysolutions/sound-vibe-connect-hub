
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Spotify, 
  Youtube, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Upload,
  Download
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  platform: string;
  type: 'streaming' | 'social' | 'collaboration' | 'analytics' | 'storage';
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  description: string;
  features: string[];
  lastSync?: string;
  isEnabled: boolean;
  icon: any;
  color: string;
  permissions: string[];
  syncOptions: {
    autoSync: boolean;
    syncFrequency: string;
    syncTypes: string[];
  };
}

export const ThirdPartyIntegrations = () => {
  const [activeTab, setActiveTab] = useState('connected');
  const [searchTerm, setSearchTerm] = useState('');

  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Spotify for Artists',
      platform: 'Spotify',
      type: 'streaming',
      status: 'connected',
      description: 'Sync your music releases and track streaming analytics',
      features: ['Music distribution', 'Analytics', 'Playlist placement', 'Fan insights'],
      lastSync: '2024-01-20T10:30:00Z',
      isEnabled: true,
      icon: Spotify,
      color: 'text-green-500',
      permissions: ['Read profile', 'Manage playlists', 'Upload tracks'],
      syncOptions: {
        autoSync: true,
        syncFrequency: 'daily',
        syncTypes: ['releases', 'analytics', 'playlists']
      }
    },
    {
      id: '2',
      name: 'YouTube Music',
      platform: 'YouTube',
      type: 'streaming',
      status: 'connected',
      description: 'Upload and manage your music videos and tracks',
      features: ['Video upload', 'Music distribution', 'Analytics', 'Comments'],
      lastSync: '2024-01-20T08:15:00Z',
      isEnabled: true,
      icon: Youtube,
      color: 'text-red-500',
      permissions: ['Upload videos', 'Manage channel', 'Read analytics'],
      syncOptions: {
        autoSync: false,
        syncFrequency: 'weekly',
        syncTypes: ['videos', 'analytics']
      }
    },
    {
      id: '3',
      name: 'Instagram',
      platform: 'Instagram',
      type: 'social',
      status: 'pending',
      description: 'Share your music content and connect with fans',
      features: ['Post sharing', 'Story highlights', 'Reels', 'Direct messages'],
      isEnabled: false,
      icon: Instagram,
      color: 'text-pink-500',
      permissions: ['Post content', 'Read messages', 'Manage stories'],
      syncOptions: {
        autoSync: false,
        syncFrequency: 'manual',
        syncTypes: ['posts', 'stories']
      }
    },
    {
      id: '4',
      name: 'SoundCloud',
      platform: 'SoundCloud',
      type: 'streaming',
      status: 'error',
      description: 'Upload tracks and connect with the SoundCloud community',
      features: ['Track upload', 'Community features', 'Analytics', 'Comments'],
      isEnabled: false,
      icon: Settings,
      color: 'text-orange-500',
      permissions: ['Upload tracks', 'Read profile', 'Manage playlists'],
      syncOptions: {
        autoSync: false,
        syncFrequency: 'weekly',
        syncTypes: ['tracks', 'analytics']
      }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const IntegrationCard = ({ integration }: { integration: Integration }) => {
    const IconComponent = integration.icon;
    
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <IconComponent className={`w-8 h-8 ${integration.color}`} />
              <div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{integration.platform}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(integration.status)}>
                {integration.status}
              </Badge>
              {getStatusIcon(integration.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{integration.description}</p>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Features</h4>
            <div className="flex flex-wrap gap-2">
              {integration.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {integration.status === 'connected' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Auto-sync</span>
                <Switch 
                  checked={integration.syncOptions.autoSync}
                  onCheckedChange={() => {}}
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Enabled</span>
                <Switch 
                  checked={integration.isEnabled}
                  onCheckedChange={() => {}}
                />
              </div>
              {integration.lastSync && (
                <p className="text-xs text-muted-foreground">
                  Last sync: {new Date(integration.lastSync).toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {integration.status === 'connected' ? (
              <>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'connected' && integration.status === 'connected') ||
                      (activeTab === 'available' && integration.status !== 'connected');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Third-Party Integrations</h1>
        <p className="text-muted-foreground">
          Connect your favorite music platforms and tools to streamline your workflow
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
        </TabsList>

        <div className="mt-6 mb-6">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </div>

        <TabsContent value="connected" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.filter(i => i.status === 'connected').map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.filter(i => i.status !== 'connected').map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
