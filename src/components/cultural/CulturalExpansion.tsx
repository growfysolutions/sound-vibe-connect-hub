import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Languages, 
  TrendingUp, 
  Star, 
  MapPin, 
  PlayCircle,
  Heart,
  Share2
} from 'lucide-react';

interface CulturalContent {
  id: string;
  title: string;
  type: 'music' | 'event' | 'artist' | 'tradition';
  culture: string;
  description: string;
  image: string;
  likes: number;
  shares: number;
  trending: boolean;
  location: string;
  tags: string[];
}

interface CulturalTrend {
  id: string;
  name: string;
  culture: string;
  growth: number;
  category: string;
  participants: number;
  description: string;
}

export const CulturalExpansion: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedCulture, setSelectedCulture] = useState('all');

  // Mock data for cultural content
  const culturalContent: CulturalContent[] = [
    {
      id: '1',
      title: 'Traditional Punjabi Folk Music',
      type: 'music',
      culture: 'punjabi',
      description: 'Explore the rich tradition of Punjabi folk music with authentic instruments and vocals.',
      image: '/placeholder.svg',
      likes: 234,
      shares: 45,
      trending: true,
      location: 'Punjab, India',
      tags: ['folk', 'traditional', 'punjabi']
    },
    {
      id: '2',
      title: 'Bollywood Fusion Workshop',
      type: 'event',
      culture: 'indian',
      description: 'Learn to blend classical Indian music with modern Bollywood beats.',
      image: '/placeholder.svg',
      likes: 189,
      shares: 32,
      trending: false,
      location: 'Mumbai, India',
      tags: ['bollywood', 'fusion', 'workshop']
    },
    {
      id: '3',
      title: 'Ravi Shankar Tribute',
      type: 'artist',
      culture: 'indian',
      description: 'Celebrating the legendary sitar maestro and his contributions to world music.',
      image: '/placeholder.svg',
      likes: 456,
      shares: 78,
      trending: true,
      location: 'New Delhi, India',
      tags: ['sitar', 'classical', 'legend']
    }
  ];

  const culturalTrends: CulturalTrend[] = [
    {
      id: '1',
      name: 'Fusion Bhangra',
      culture: 'punjabi',
      growth: 85,
      category: 'music',
      participants: 1200,
      description: 'Modern electronic beats mixed with traditional Bhangra rhythms'
    },
    {
      id: '2',
      name: 'Indie Bollywood',
      culture: 'indian',
      growth: 67,
      category: 'music',
      participants: 890,
      description: 'Independent artists creating fresh takes on Bollywood classics'
    },
    {
      id: '3',
      name: 'Classical Crossover',
      culture: 'indian',
      growth: 45,
      category: 'music',
      participants: 567,
      description: 'Blending Indian classical music with Western orchestral arrangements'
    }
  ];

  const cultures = [
    { id: 'all', name: 'All Cultures', flag: '🌍' },
    { id: 'punjabi', name: 'Punjabi', flag: '🇮🇳' },
    { id: 'indian', name: 'Indian', flag: '🇮🇳' },
    { id: 'pakistani', name: 'Pakistani', flag: '🇵🇰' },
    { id: 'bengali', name: 'Bengali', flag: '🇧🇩' }
  ];

  const filteredContent = selectedCulture === 'all' 
    ? culturalContent 
    : culturalContent.filter(content => content.culture === selectedCulture);

  const ContentCard = ({ content }: { content: CulturalContent }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {content.title}
              {content.trending && <TrendingUp className="w-4 h-4 text-orange-500" />}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{content.location}</span>
            </div>
          </div>
          <Badge variant={content.type === 'music' ? 'default' : 'secondary'}>
            {content.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{content.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags.map((tag, index) => (
            <Badge key={index} variant="outline">{tag}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm">{content.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{content.shares}</span>
            </div>
          </div>
          <Button size="sm">
            <PlayCircle className="w-4 h-4 mr-2" />
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TrendCard = ({ trend }: { trend: CulturalTrend }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{trend.name}</CardTitle>
          <Badge variant="outline" className="text-green-600">
            +{trend.growth}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{trend.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">{trend.participants} participants</span>
          </div>
          <Button size="sm" variant="outline">
            Join Trend
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Globe className="w-8 h-8 text-saffron" />
          Cultural Expansion
        </h1>
        <p className="text-muted-foreground">
          Discover and celebrate musical cultures from around the world
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="contribute">Contribute</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {cultures.map((culture) => (
              <Button
                key={culture.id}
                variant={selectedCulture === culture.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCulture(culture.id)}
                className="flex items-center gap-2"
              >
                <span>{culture.flag}</span>
                {culture.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalTrends.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contribute" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Share Your Culture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Help expand our cultural database by sharing music, traditions, and stories from your heritage.
              </p>
              <div className="flex gap-4">
                <Button>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Upload Music
                </Button>
                <Button variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  Share Story
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
