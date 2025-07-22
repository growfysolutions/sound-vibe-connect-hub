import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Snowflake, Music, Calendar } from 'lucide-react';

interface WeatherData {
  temperature: string;
  condition: string;
  description: string;
  humidity: string;
  windSpeed: string;
  location: string;
}

interface MusicRecommendation {
  id: string;
  title: string;
  artist: string;
  genre: string;
  reason: string;
  mood: string;
  traditional?: boolean;
}

interface SeasonalEvent {
  name: string;
  date: string;
  associatedMusic: string;
  description: string;
}

export function WeatherMusicWidget() {
  const [currentWeather] = useState<WeatherData>({
    temperature: '24°C',
    condition: 'Partly Cloudy',
    description: 'Perfect for outdoor music practice',
    humidity: '65%',
    windSpeed: '12 km/h',
    location: 'Chandigarh, Punjab'
  });

  const weatherRecommendations: MusicRecommendation[] = [
    {
      id: '1',
      title: 'Baarish Da Raag',
      artist: 'Master Gurcharan Singh',
      genre: 'Classical Monsoon',
      reason: 'Cloudy weather calls for soulful raags',
      mood: 'Contemplative',
      traditional: true
    },
    {
      id: '2',
      title: 'Sawan Ka Mahina',
      artist: 'Various Artists',
      genre: 'Folk Collection',
      reason: 'Traditional monsoon songs',
      mood: 'Romantic',
      traditional: true
    },
    {
      id: '3',
      title: 'Chill Punjabi Beats',
      artist: 'Modern Mix',
      genre: 'Lo-fi Punjabi',
      reason: 'Relaxing vibes for cloudy afternoons',
      mood: 'Chill'
    }
  ];

  const seasonalEvents: SeasonalEvent[] = [
    {
      name: 'Teej Festival',
      date: 'Next Month',
      associatedMusic: 'Traditional Teej Songs',
      description: 'Monsoon celebration with folk music'
    },
    {
      name: 'Sawan Somvar',
      date: 'This Monday',
      associatedMusic: 'Devotional Bhajans',
      description: 'Sacred Monday of monsoon month'
    }
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'partly cloudy':
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy':
      case 'rain': return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'snowy':
      case 'snow': return <Snowflake className="w-6 h-6 text-blue-200" />;
      default: return <Cloud className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Music className="w-5 h-5 text-saffron" />
          <span>Weather & Music</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="p-3 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(currentWeather.condition)}
              <div>
                <h3 className="font-semibold text-lg">{currentWeather.temperature}</h3>
                <p className="text-sm text-muted-foreground">{currentWeather.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{currentWeather.location}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-background/50 px-2 py-1 rounded">
                  💧 {currentWeather.humidity}
                </span>
                <span className="text-xs bg-background/50 px-2 py-1 rounded">
                  🌪️ {currentWeather.windSpeed}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground italic">
            {currentWeather.description}
          </p>
        </div>

        {/* Weather-Based Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            🎵 Weather Playlist
          </h4>
          <div className="space-y-2">
            {weatherRecommendations.slice(0, 2).map((rec) => (
              <div key={rec.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{rec.title}</p>
                    {rec.traditional && (
                      <Badge variant="secondary" className="text-xs">Traditional</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.artist} • {rec.genre}</p>
                  <p className="text-xs text-saffron">{rec.reason}</p>
                </div>
                <Button size="sm" variant="ghost">
                  <Music className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Events */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Seasonal Music
          </h4>
          <div className="space-y-2">
            {seasonalEvents.map((event, index) => (
              <div key={index} className="p-2 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded border border-purple-200/30 dark:border-purple-800/30">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-semibold">{event.name}</h5>
                  <span className="text-xs text-muted-foreground">{event.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">{event.description}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  🎵 {event.associatedMusic}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Traditional Weather Songs */}
        <div className="space-y-2 pt-2 border-t border-border/30">
          <h4 className="text-sm font-semibold">Traditional Weather Songs</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>☔ "Sawan Aaya Hai" - Monsoon celebration</p>
            <p>☀️ "Dhoop Chhaon" - Sun and shade melodies</p>
            <p>🌾 "Harh Da Mela" - Harvest season songs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
