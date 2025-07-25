
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Music, 
  Heart, 
  Star, 
  Play, 
  Users,
  Calendar,
  Award,
  TrendingUp,
  Volume2,
  BookOpen
} from 'lucide-react';

interface CulturalContent {
  id: string;
  title: string;
  type: 'music' | 'story' | 'pattern' | 'celebration';
  culture: string;
  region: string;
  description: string;
  tags: string[];
  rating: number;
  plays: number;
  likes: number;
  audioUrl?: string;
  imageUrl?: string;
  isVerified: boolean;
  contributor: string;
  culturalContext: string;
  learningNotes: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instruments: string[];
  timestamp: string;
}

export const CulturalExpansion = () => {
  const [selectedCulture, setSelectedCulture] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('discover');

  // Mock cultural content data
  const culturalContent: CulturalContent[] = [
    {
      id: '1',
      title: 'Traditional Punjabi Dhol Pattern',
      type: 'music',
      culture: 'Punjabi',
      region: 'Punjab, India',
      description: 'A traditional dhol rhythm pattern used in Bhangra music',
      tags: ['dhol', 'bhangra', 'traditional', 'percussion'],
      rating: 4.8,
      plays: 1523,
      likes: 234,
      audioUrl: '/audio/dhol-pattern.mp3',
      imageUrl: '/images/dhol.jpg',
      isVerified: true,
      contributor: 'Gurdeep Singh',
      culturalContext: 'Used in harvest celebrations and wedding ceremonies',
      learningNotes: 'Focus on the Ta-Dhimi-Ta-Ka pattern with emphasis on downbeats',
      difficulty: 'intermediate',
      instruments: ['dhol', 'tabla'],
      timestamp: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Flamenco Guitar Rasgueado',
      type: 'music',
      culture: 'Spanish',
      region: 'Andalusia, Spain',
      description: 'Essential flamenco guitar strumming technique',
      tags: ['flamenco', 'guitar', 'spanish', 'rasgueado'],
      rating: 4.9,
      plays: 2100,
      likes: 378,
      audioUrl: '/audio/flamenco-rasgueado.mp3',
      imageUrl: '/images/flamenco-guitar.jpg',
      isVerified: true,
      contributor: 'Carmen Rodriguez',
      culturalContext: 'Fundamental technique in flamenco music expression',
      learningNotes: 'Start slow with thumb-index-middle-ring finger sequence',
      difficulty: 'advanced',
      instruments: ['flamenco guitar'],
      timestamp: '2024-01-12T14:30:00Z'
    },
    {
      id: '3',
      title: 'Irish Tin Whistle Ornaments',
      type: 'music',
      culture: 'Irish',
      region: 'Ireland',
      description: 'Traditional Irish tin whistle ornamentation techniques',
      tags: ['tin whistle', 'irish', 'traditional', 'ornaments'],
      rating: 4.7,
      plays: 890,
      likes: 156,
      audioUrl: '/audio/tin-whistle-ornaments.mp3',
      imageUrl: '/images/tin-whistle.jpg',
      isVerified: true,
      contributor: 'Seamus O\'Brien',
      culturalContext: 'Essential for expressing emotion in Irish traditional music',
      learningNotes: 'Practice cuts, rolls, and crans slowly before attempting in melodies',
      difficulty: 'intermediate',
      instruments: ['tin whistle', 'low whistle'],
      timestamp: '2024-01-10T16:45:00Z'
    }
  ];

  const cultures = ['all', 'Punjabi', 'Spanish', 'Irish', 'Japanese', 'Brazilian', 'African'];
  const types = ['all', 'music', 'story', 'pattern', 'celebration'];
  const [filters, setFilters] = useState({
    culture: 'all',
    type: 'all',
    difficulty: 'all',
    verified: false
  });

  const filteredContent = culturalContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCulture = selectedCulture === 'all' || content.culture === selectedCulture;
    const matchesType = selectedType === 'all' || content.type === selectedType;
    
    return matchesSearch && matchesCulture && matchesType;
  });

  const CulturalCard = ({ content }: { content: CulturalContent }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {content.title}
              {content.isVerified && <Award className="w-4 h-4 text-yellow-500" />}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {content.culture} • {content.region}
            </p>
          </div>
          <Badge variant={content.type === 'music' ? 'default' : 'secondary'}>
            {content.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{content.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current text-yellow-500" />
            {content.rating}
          </div>
          <div className="flex items-center gap-1">
            <Play className="w-4 h-4" />
            {content.plays.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {content.likes}
          </div>
          <Badge variant="outline" className="text-xs">
            {content.difficulty}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Cultural Context</h4>
          <p className="text-sm text-muted-foreground">{content.culturalContext}</p>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Learning Notes</h4>
          <p className="text-sm text-muted-foreground">{content.learningNotes}</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Play className="w-4 h-4 mr-1" />
              Play
            </Button>
            <Button size="sm" variant="outline">
              <Heart className="w-4 h-4 mr-1" />
              Like
            </Button>
          </div>
          <Button size="sm">
            <BookOpen className="w-4 h-4 mr-1" />
            Learn
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Globe className="w-8 h-8" />
          Cultural Music Expansion
        </h1>
        <p className="text-muted-foreground">
          Explore authentic musical traditions from around the world
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="learning">Learning Path</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="contribute">Contribute</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search cultural content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedCulture}
                  onChange={(e) => setSelectedCulture(e.target.value)}
                >
                  {cultures.map(culture => (
                    <option key={culture} value={culture}>
                      {culture === 'all' ? 'All Cultures' : culture}
                    </option>
                  ))}
                </select>

                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>

                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => (
              <CulturalCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Cultural Learning Paths</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Structured learning paths for different cultural musical traditions will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle>Cultural Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with cultural music practitioners and enthusiasts worldwide.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contribute">
          <Card>
            <CardHeader>
              <CardTitle>Contribute Cultural Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share your cultural musical knowledge and traditions with the community.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
