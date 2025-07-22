import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, TrendingUp } from 'lucide-react';

interface LocalEvent {
  id: string;
  title: string;
  type: 'concert' | 'workshop' | 'jam-session' | 'festival';
  date: string;
  location: string;
  distance: string;
  attending: number;
  featured?: boolean;
}

interface LocalArtist {
  id: string;
  name: string;
  genre: string;
  location: string;
  followers: string;
  isLive?: boolean;
}

export function LocalMusicSceneWidget() {
  const [activeTab, setActiveTab] = useState<'events' | 'artists' | 'trends'>('events');

  const localEvents: LocalEvent[] = [
    {
      id: '1',
      title: 'Sufi Night at Cultural Centre',
      type: 'concert',
      date: 'Tonight 8 PM',
      location: 'Chandigarh Cultural Centre',
      distance: '2.3 km',
      attending: 156,
      featured: true
    },
    {
      id: '2',
      title: 'Dhol Workshop for Beginners',
      type: 'workshop',
      date: 'Tomorrow 10 AM',
      location: 'Music Academy, Sector 17',
      distance: '5.1 km',
      attending: 23
    },
    {
      id: '3',
      title: 'Jam Session - Folk Fusion',
      type: 'jam-session',
      date: 'This Weekend',
      location: 'Community Hall, Phase 8',
      distance: '8.2 km',
      attending: 45
    }
  ];

  const localArtists: LocalArtist[] = [
    {
      id: '1',
      name: 'Gurpreet Singh',
      genre: 'Classical Punjabi',
      location: 'Amritsar',
      followers: '2.1K',
      isLive: true
    },
    {
      id: '2',
      name: 'Simran Kaur',
      genre: 'Modern Folk',
      location: 'Chandigarh',
      followers: '1.8K'
    },
    {
      id: '3',
      name: 'The Dhol Collective',
      genre: 'Bhangra Fusion',
      location: 'Ludhiana',
      followers: '3.5K'
    }
  ];

  const getEventIcon = (type: LocalEvent['type']) => {
    switch (type) {
      case 'concert': return '🎤';
      case 'workshop': return '📚';
      case 'jam-session': return '🎵';
      case 'festival': return '🎪';
      default: return '🎵';
    }
  };

  const renderEventsTab = () => (
    <div className="space-y-3">
      {localEvents.map((event) => (
        <div 
          key={event.id}
          className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
            event.featured 
              ? 'bg-gradient-to-r from-saffron/10 to-amber-500/10 border-saffron/30' 
              : 'bg-muted/20 border-border/50'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getEventIcon(event.type)}</span>
              <div>
                <h4 className="text-sm font-semibold">{event.title}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {event.date}
                </p>
              </div>
            </div>
            {event.featured && <Badge className="text-xs">Featured</Badge>}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.location} • {event.distance}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {event.attending} attending
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderArtistsTab = () => (
    <div className="space-y-3">
      {localArtists.map((artist) => (
        <div key={artist.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-saffron to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {artist.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">{artist.name}</h4>
                {artist.isLive && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              </div>
              <p className="text-xs text-muted-foreground">{artist.genre} • {artist.location}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium">{artist.followers}</p>
            <p className="text-xs text-muted-foreground">followers</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTrendsTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Trending Genres</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Sufi Rock Fusion</span>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">+24%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Classical Punjabi</span>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">+18%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Modern Bhangra</span>
            <div className="flex items-center gap-1 text-blue-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">+12%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Popular Collaborations</h4>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Tabla + Electronic beats</p>
          <p>• Harmonium + Guitar fusion</p>
          <p>• Traditional vocals + Modern production</p>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-saffron" />
          <span>Local Music Scene</span>
        </CardTitle>
        <div className="flex gap-1 mt-2">
          <Button
            size="sm"
            variant={activeTab === 'events' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('events')}
            className="text-xs h-7"
          >
            Events
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'artists' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('artists')}
            className="text-xs h-7"
          >
            Artists
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'trends' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('trends')}
            className="text-xs h-7"
          >
            Trends
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'events' && renderEventsTab()}
        {activeTab === 'artists' && renderArtistsTab()}
        {activeTab === 'trends' && renderTrendsTab()}
      </CardContent>
    </Card>
  );
}
