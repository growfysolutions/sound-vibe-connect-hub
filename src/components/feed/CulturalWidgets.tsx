
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Sun, Star, TrendingUp, Clock, Globe } from 'lucide-react';

export function CulturalWidgets() {
  const todaysRaag = {
    name: 'Raag Yaman',
    punjabi: 'ਰਾਗ ਯਮਨ',
    description: 'Evening raag perfect for peaceful practice',
    mood: 'Peaceful & Devotional'
  };

  const trendingHashtags = [
    '#PunjabiPride', '#BhangraBeats', '#SufiSoul', '#DholVibes', 
    '#ClassicalFusion', '#ਸੰਗੀਤ', '#TumbiTales', '#RaagPractice'
  ];

  const upcomingEvents = [
    { name: 'Baisakhi Celebration', date: 'Apr 13', location: 'Amritsar' },
    { name: 'Sufi Night', date: 'Apr 20', location: 'Delhi' },
    { name: 'Global Bhangra', date: 'Apr 25', location: 'Toronto' }
  ];

  const featuredArtist = {
    name: 'Ravi Singh',
    punjabi: 'ਰਵੀ ਸਿੰਘ',
    role: 'Master Dhol Player',
    location: 'Punjab, India',
    followers: '12.5K'
  };

  const punjabWeather = {
    temperature: '28°C',
    condition: 'Golden Sunshine',
    description: 'Perfect for outdoor recordings'
  };

  const punjabTimes = [
    { city: 'Amritsar', time: '2:30 PM', punjabi: 'ਅੰਮ੍ਰਿਤਸਰ' },
    { city: 'Delhi', time: '2:30 PM', punjabi: 'ਦਿੱਲੀ' },
    { city: 'Vancouver', time: '1:00 AM', punjabi: 'ਵੈਨਕੂਵਰ' },
    { city: 'London', time: '9:00 AM', punjabi: 'ਲੰਡਨ' }
  ];

  const dailyQuote = {
    english: "Music is the universal language of the soul",
    punjabi: "ਸੰਗੀਤ ਰੂਹ ਦੀ ਵਿਸ਼ਵਵਿਆਪੀ ਭਾਸ਼ਾ ਹੈ",
    author: "Ancient Punjabi Wisdom"
  };

  return (
    <div className="space-y-6">
      {/* Today's Raag */}
      <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Star className="w-5 h-5 text-saffron" />
            <span>Today's Raag</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center p-4 bg-gradient-to-r from-saffron/10 to-amber-500/10 rounded-lg">
            <h3 className="font-semibold text-saffron">{todaysRaag.name}</h3>
            <p className="text-sm opacity-75" style={{ fontFamily: 'serif' }}>{todaysRaag.punjabi}</p>
            <p className="text-xs text-muted-foreground mt-1">{todaysRaag.description}</p>
            <Badge variant="secondary" className="mt-2">{todaysRaag.mood}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Trending Hashtags */}
      <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-saffron" />
            <span>Trending</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="border-saffron/30 hover:bg-saffron/10 cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Events */}
      <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-saffron" />
            <span>Cultural Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="flex justify-between items-center p-2 hover:bg-saffron/5 rounded">
              <div>
                <p className="font-medium text-sm">{event.name}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {event.location}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">{event.date}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Featured Artist */}
      <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Star className="w-5 h-5 text-saffron" />
            <span>Featured Artist</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-saffron to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {featuredArtist.name.charAt(0)}
            </div>
            <h3 className="font-semibold">{featuredArtist.name}</h3>
            <p className="text-sm opacity-75" style={{ fontFamily: 'serif' }}>{featuredArtist.punjabi}</p>
            <p className="text-xs text-muted-foreground">{featuredArtist.role}</p>
            <p className="text-xs flex items-center justify-center">
              <MapPin className="w-3 h-3 mr-1" />
              {featuredArtist.location}
            </p>
            <Badge>{featuredArtist.followers} followers</Badge>
            <Button size="sm" className="w-full mt-2">Follow</Button>
          </div>
        </CardContent>
      </Card>

      {/* Punjab Weather */}
      <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Sun className="w-5 h-5 text-saffron" />
            <span>Punjab Weather</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          <div className="text-2xl font-bold text-saffron">{punjabWeather.temperature}</div>
          <p className="text-sm font-medium">{punjabWeather.condition}</p>
          <p className="text-xs text-muted-foreground">{punjabWeather.description}</p>
        </CardContent>
      </Card>

      {/* World Clock */}
      <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Globe className="w-5 h-5 text-saffron" />
            <span>Punjabi Cities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {punjabTimes.map((location, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div>
                <span className="font-medium">{location.city}</span>
                <span className="text-xs opacity-60 ml-2" style={{ fontFamily: 'serif' }}>
                  {location.punjabi}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-saffron" />
                <span className="font-mono">{location.time}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Daily Inspiration */}
      <Card className="border-saffron/20 bg-gradient-to-br from-saffron/5 to-amber-500/5">
        <CardContent className="p-4 text-center space-y-3">
          <div className="text-sm italic">{dailyQuote.english}</div>
          <div className="text-sm opacity-75" style={{ fontFamily: 'serif' }}>{dailyQuote.punjabi}</div>
          <div className="text-xs text-muted-foreground">— {dailyQuote.author}</div>
        </CardContent>
      </Card>
    </div>
  );
}
