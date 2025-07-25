
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Music, 
  MapPin, 
  Calendar, 
  Star, 
  Users, 
  Play,
  Share2,
  MessageSquare,
  Heart,
  Award,
  Headphones,
  Mic
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { culturalStyles } from '@/lib/cultural-design';
import { cn } from '@/lib/utils';

interface PublicProfileData {
  id: string;
  full_name: string;
  bio: string;
  location: string;
  professional_roles: string[];
  skills: string[];
  avatar_url: string;
  created_at: string;
  portfolio_items: any[];
  collaborations: any[];
  reviews: any[];
}

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (id) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const fetchProfile = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Transform the data to match our interface
      const profileData: PublicProfileData = {
        id: data.id,
        full_name: data.full_name || '',
        bio: data.bio || '',
        location: data.location || '',
        professional_roles: data.professional_roles || [],
        skills: data.skills || [],
        avatar_url: data.avatar_url || '',
        created_at: data.updated_at || new Date().toISOString(),
        portfolio_items: [], // TODO: Fetch from portfolio_media table
        collaborations: [], // TODO: Fetch from projects/collaborations
        reviews: [] // TODO: Fetch from reviews table
      };
      
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'singer':
        return <Mic className="w-4 h-4" />;
      case 'music-director':
        return <Music className="w-4 h-4" />;
      case 'sound-engineer':
        return <Headphones className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-saffron border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!id || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-gradient-to-r from-saffron/10 to-amber-500/10 border border-saffron/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32 border-4 border-saffron/30">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                <AvatarFallback className="text-2xl bg-saffron/20">
                  {profile.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className={cn(culturalStyles.typography.header, "text-3xl mb-2")}>
                  {profile.full_name}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                  {profile.professional_roles?.map((role, index) => (
                    <Badge key={index} variant="secondary" className="bg-saffron/20 text-saffron-foreground">
                      {getRoleIcon(role)}
                      <span className="ml-2 capitalize">{role.replace('-', ' ')}</span>
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-muted-foreground mb-4 justify-center md:justify-start">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 max-w-2xl">
                  {profile.bio || 'No bio available'}
                </p>

                <div className="flex gap-3 justify-center md:justify-start">
                  <Button className="bg-saffron hover:bg-saffron/90">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Collaborate
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-saffron/10 to-amber-500/10 border border-saffron/20">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-saffron" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    )) || <p className="text-muted-foreground">No skills listed</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-saffron" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Projects Completed</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Collaborations</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-saffron text-saffron" />
                        <span>4.9</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {profile.portfolio_items?.length ? (
                    profile.portfolio_items.map((item, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Play className="w-8 h-8 text-saffron" />
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.type}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-3 text-center py-8">
                      No portfolio items to display
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Collaborations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.collaborations?.length ? (
                    profile.collaborations.map((collab, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Avatar>
                          <AvatarFallback>
                            {collab.partner_name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{collab.project_title}</h4>
                          <p className="text-sm text-muted-foreground">
                            with {collab.partner_name}
                          </p>
                        </div>
                        <Badge variant="outline">{collab.status}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No collaborations to display
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.reviews?.length ? (
                    profile.reviews.map((review, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < review.rating
                                    ? "fill-saffron text-saffron"
                                    : "text-muted-foreground"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            by {review.reviewer_name}
                          </span>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No reviews to display
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicProfile;
