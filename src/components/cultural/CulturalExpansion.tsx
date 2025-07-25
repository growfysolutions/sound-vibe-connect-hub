
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Music, 
  Users, 
  BookOpen, 
  Calendar, 
  Star,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Download,
  Upload,
  Headphones,
  Mic,
  Guitar,
  Palette,
  Award,
  MapPin,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CulturalContent {
  id: string;
  title: string;
  description: string;
  type: 'song' | 'story' | 'dance' | 'instrument' | 'tradition' | 'history';
  culture: string;
  region: string;
  language: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  audio_url?: string;
  video_url?: string;
  lyrics?: string;
  notation?: string;
  historical_context?: string;
  cultural_significance?: string;
  tags: string[];
  created_by: string;
  created_at: string;
  likes_count: number;
  views_count: number;
  downloads_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
}

interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  type: 'festival' | 'workshop' | 'performance' | 'ceremony' | 'celebration';
  culture: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  participants_count: number;
  is_virtual: boolean;
  is_free: boolean;
  price?: number;
  language: string;
  tags: string[];
  image_url?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface CulturalMentor {
  id: string;
  name: string;
  title: string;
  bio: string;
  cultures: string[];
  specialties: string[];
  languages: string[];
  experience_years: number;
  rating: number;
  reviews_count: number;
  is_available: boolean;
  hourly_rate?: number;
  avatar_url?: string;
  verified: boolean;
}

export const CulturalExpansion = () => {
  const [culturalContent, setCulturalContent] = useState<CulturalContent[]>([]);
  const [culturalEvents, setCulturalEvents] = useState<CulturalEvent[]>([]);
  const [culturalMentors, setCulturalMentors] = useState<CulturalMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    culture: '',
    type: '',
    language: '',
    difficulty: '',
    region: ''
  });

  useEffect(() => {
    fetchCulturalContent();
    fetchCulturalEvents();
    fetchCulturalMentors();
  }, [filters, searchQuery]);

  const fetchCulturalContent = async () => {
    try {
      // Mock data for cultural content
      const mockContent: CulturalContent[] = [
        {
          id: '1',
          title: 'ਸੱਚਾ ਪਾਤਿਸ਼ਾਹ (Sacha Patshah)',
          description: 'Traditional Sikh devotional song with deep spiritual meaning',
          type: 'song',
          culture: 'Sikh',
          region: 'Punjab',
          language: 'Punjabi',
          difficulty_level: 'intermediate',
          duration: 180,
          audio_url: '/audio/sacha-patshah.mp3',
          lyrics: 'ਸੱਚਾ ਪਾਤਿਸ਼ਾਹ ਸਚਿਆਰ ਤੂ...',
          historical_context: 'Composed during the Guru period',
          cultural_significance: 'Represents devotion and surrender to the divine',
          tags: ['devotional', 'classical', 'spiritual'],
          created_by: 'Cultural Heritage Team',
          created_at: new Date().toISOString(),
          likes_count: 245,
          views_count: 1200,
          downloads_count: 89,
          is_liked: false,
          is_bookmarked: false
        },
        {
          id: '2',
          title: 'ਭੰਗੜਾ ਬੇਸਿਕ ਸਟੈਪਸ (Bhangra Basic Steps)',
          description: 'Learn the fundamental movements of traditional Punjabi Bhangra',
          type: 'dance',
          culture: 'Punjabi',
          region: 'Punjab',
          language: 'Punjabi',
          difficulty_level: 'beginner',
          duration: 300,
          video_url: '/video/bhangra-basics.mp4',
          cultural_significance: 'Celebrates harvest season and community joy',
          tags: ['folk', 'energetic', 'celebration'],
          created_by: 'Dance Master Gurdeep',
          created_at: new Date().toISOString(),
          likes_count: 456,
          views_count: 2340,
          downloads_count: 134,
          is_liked: true,
          is_bookmarked: true
        },
        {
          id: '3',
          title: 'ਤਬਲਾ ਮਾਸਟਰਿੰਗ (Tabla Mastering)',
          description: 'Complete guide to playing tabla with traditional techniques',
          type: 'instrument',
          culture: 'Indian',
          region: 'North India',
          language: 'Hindi',
          difficulty_level: 'advanced',
          duration: 1800,
          audio_url: '/audio/tabla-guide.mp3',
          notation: 'Dhaa Dhaa Tite Dhaa...',
          historical_context: 'Evolved from ancient Indian percussion traditions',
          cultural_significance: 'Core instrument in Indian classical music',
          tags: ['percussion', 'classical', 'rhythmic'],
          created_by: 'Ustad Rahman Khan',
          created_at: new Date().toISOString(),
          likes_count: 189,
          views_count: 890,
          downloads_count: 67,
          is_liked: false,
          is_bookmarked: false
        }
      ];

      setCulturalContent(mockContent);
    } catch (error) {
      console.error('Error fetching cultural content:', error);
    }
  };

  const fetchCulturalEvents = async () => {
    try {
      const mockEvents: CulturalEvent[] = [
        {
          id: '1',
          title: 'ਵਿਸਾਖੀ ਸੇਲਿਬਰੇਸ਼ਨ (Vaisakhi Celebration)',
          description: 'Traditional Sikh new year celebration with music and dance',
          type: 'festival',
          culture: 'Sikh',
          location: 'Golden Temple, Amritsar',
          date: '2024-04-14',
          time: '10:00 AM',
          organizer: 'SGPC',
          participants_count: 50000,
          is_virtual: false,
          is_free: true,
          language: 'Punjabi',
          tags: ['religious', 'traditional', 'community'],
          status: 'upcoming'
        },
        {
          id: '2',
          title: 'ਸਿਤਾਰ ਵਰਕਸ਼ਾਪ (Sitar Workshop)',
          description: 'Learn the basics of sitar playing with renowned master',
          type: 'workshop',
          culture: 'Indian',
          location: 'Virtual',
          date: '2024-03-20',
          time: '7:00 PM',
          organizer: 'Raga Academy',
          participants_count: 25,
          is_virtual: true,
          is_free: false,
          price: 50,
          language: 'English',
          tags: ['instrumental', 'learning', 'classical'],
          status: 'upcoming'
        }
      ];

      setCulturalEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching cultural events:', error);
    }
  };

  const fetchCulturalMentors = async () => {
    try {
      const mockMentors: CulturalMentor[] = [
        {
          id: '1',
          name: 'ਗੁਰਿੰਦਰ ਕੌਰ (Gurinder Kaur)',
          title: 'Classical Sikh Music Expert',
          bio: 'Master of traditional Sikh kirtan with 20+ years experience',
          cultures: ['Sikh', 'Punjabi'],
          specialties: ['Kirtan', 'Gurbani', 'Harmonium'],
          languages: ['Punjabi', 'Hindi', 'English'],
          experience_years: 22,
          rating: 4.9,
          reviews_count: 156,
          is_available: true,
          hourly_rate: 45,
          avatar_url: '/avatars/gurinder.jpg',
          verified: true
        },
        {
          id: '2',
          name: 'ਰਾਜਾ ਸਿੰਘ (Raja Singh)',
          title: 'Bhangra Dance Master',
          bio: 'Professional bhangra instructor teaching traditional Punjab folk dance',
          cultures: ['Punjabi'],
          specialties: ['Bhangra', 'Folk Dance', 'Cultural Performance'],
          languages: ['Punjabi', 'English'],
          experience_years: 15,
          rating: 4.8,
          reviews_count: 203,
          is_available: true,
          hourly_rate: 35,
          avatar_url: '/avatars/raja.jpg',
          verified: true
        }
      ];

      setCulturalMentors(mockMentors);
    } catch (error) {
      console.error('Error fetching cultural mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const likeCulturalContent = async (contentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to like content');
        return;
      }

      // Toggle like in mock data
      setCulturalContent(prev => 
        prev.map(content => 
          content.id === contentId 
            ? { 
                ...content, 
                is_liked: !content.is_liked,
                likes_count: content.is_liked ? content.likes_count - 1 : content.likes_count + 1
              }
            : content
        )
      );

      toast.success('Content liked successfully!');
    } catch (error) {
      console.error('Error liking content:', error);
      toast.error('Failed to like content');
    }
  };

  const bookmarkContent = async (contentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to bookmark content');
        return;
      }

      setCulturalContent(prev => 
        prev.map(content => 
          content.id === contentId 
            ? { ...content, is_bookmarked: !content.is_bookmarked }
            : content
        )
      );

      toast.success('Content bookmarked successfully!');
    } catch (error) {
      console.error('Error bookmarking content:', error);
      toast.error('Failed to bookmark content');
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'song': return <Music className="w-5 h-5" />;
      case 'story': return <BookOpen className="w-5 h-5" />;
      case 'dance': return <Users className="w-5 h-5" />;
      case 'instrument': return <Guitar className="w-5 h-5" />;
      case 'tradition': return <Calendar className="w-5 h-5" />;
      case 'history': return <Globe className="w-5 h-5" />;
      default: return <Music className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'festival': return 'bg-purple-500';
      case 'workshop': return 'bg-blue-500';
      case 'performance': return 'bg-red-500';
      case 'ceremony': return 'bg-yellow-500';
      case 'celebration': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const CulturalContentCard = ({ content }: { content: CulturalContent }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {getContentTypeIcon(content.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{content.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {content.culture} • {content.region}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(content.difficulty_level)}>
              {content.difficulty_level}
            </Badge>
            <Badge variant="outline">{content.language}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{content.description}</p>
        
        {content.cultural_significance && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-1">Cultural Significance:</p>
            <p className="text-sm text-muted-foreground">{content.cultural_significance}</p>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className={`w-4 h-4 ${content.is_liked ? 'text-red-500 fill-current' : ''}`} />
            {content.likes_count}
          </div>
          <div className="flex items-center gap-1">
            <Play className="w-4 h-4" />
            {content.views_count}
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {content.downloads_count}
          </div>
          {content.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">{tag}</Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => likeCulturalContent(content.id)}
            className="flex items-center gap-1"
          >
            <Heart className={`w-4 h-4 ${content.is_liked ? 'text-red-500 fill-current' : ''}`} />
            {content.is_liked ? 'Liked' : 'Like'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => bookmarkContent(content.id)}
            className="flex items-center gap-1"
          >
            <BookOpen className="w-4 h-4" />
            {content.is_bookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button size="sm" className="flex-1">
            <Play className="w-4 h-4 mr-1" />
            Experience
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CulturalEventCard = ({ event }: { event: CulturalEvent }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {event.culture} • {event.organizer}
            </p>
          </div>
          <Badge className={getEventTypeColor(event.type)}>
            {event.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            {event.location} {event.is_virtual && '(Virtual)'}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            {event.participants_count} participants
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-primary" />
            {event.language}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">{tag}</Badge>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div>
            {event.is_free ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Free
              </Badge>
            ) : (
              <span className="text-lg font-semibold text-green-600">
                ${event.price}
              </span>
            )}
          </div>
          <Button>
            Join Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CulturalMentorCard = ({ mentor }: { mentor: CulturalMentor }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {mentor.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{mentor.name}</CardTitle>
              {mentor.verified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Award className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{mentor.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{mentor.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({mentor.reviews_count} reviews)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{mentor.bio}</p>
        
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-sm font-medium mb-1">Cultures:</p>
            <div className="flex flex-wrap gap-1">
              {mentor.cultures.map((culture, index) => (
                <Badge key={index} variant="outline">{culture}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Specialties:</p>
            <div className="flex flex-wrap gap-1">
              {mentor.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">{specialty}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Languages:</p>
            <div className="flex flex-wrap gap-1">
              {mentor.languages.map((language, index) => (
                <Badge key={index} variant="outline">{language}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Experience:</p>
            <p className="font-medium">{mentor.experience_years} years</p>
            {mentor.hourly_rate && (
              <p className="text-lg font-semibold text-green-600">
                ${mentor.hourly_rate}/hour
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>
            <Button size="sm">
              Book Session
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cultural Heritage & Learning</h1>
        <p className="text-muted-foreground">
          Explore, learn, and preserve cultural traditions through music and arts
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search cultural content, events, or mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Cultural Content</TabsTrigger>
          <TabsTrigger value="events">Cultural Events</TabsTrigger>
          <TabsTrigger value="mentors">Cultural Mentors</TabsTrigger>
          <TabsTrigger value="contribute">Contribute</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {culturalContent.map((content) => (
                <CulturalContentCard key={content.id} content={content} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalEvents.map((event) => (
              <CulturalEventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalMentors.map((mentor) => (
              <CulturalMentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contribute" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contribute to Cultural Heritage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="song">Song</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="dance">Dance</SelectItem>
                      <SelectItem value="instrument">Instrument</SelectItem>
                      <SelectItem value="tradition">Tradition</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input placeholder="Enter content title" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea placeholder="Describe the cultural content..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Culture</label>
                    <Input placeholder="e.g., Sikh, Punjabi, Indian" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Region</label>
                    <Input placeholder="e.g., Punjab, North India" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <Input placeholder="e.g., Punjabi, Hindi, English" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Cultural Significance</label>
                  <Textarea placeholder="Explain the cultural and historical significance..." />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input placeholder="Enter tags separated by commas" />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Media
                  </Button>
                  <Button className="flex-1">
                    Submit Contribution
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
