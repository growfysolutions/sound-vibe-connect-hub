
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, Search, Upload, Users, Star, Play, Heart, Share2, 
  MessageCircle, TrendingUp, Bell, Settings, LogOut, Filter,
  Mic, Video, Headphones, Camera, MapPin, Clock, Gamepad2
} from 'lucide-react';

// Import new components
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import GameficationPanel from '@/components/dashboard/GameficationPanel';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const mockProjects = [
    {
      id: 1,
      title: 'Punjabi Folk Fusion Album',
      artist: 'Simran Kaur',
      role: 'Singer',
      thumbnail: '🎤',
      plays: '12.5K',
      likes: '892',
      duration: '3:45',
      genre: 'Punjabi Folk',
      isCollaborative: true
    },
    {
      id: 2,
      title: 'Modern Bhangra Beat',
      artist: 'Arjun Singh',
      role: 'Music Director',
      thumbnail: '🎵',
      plays: '8.2K',
      likes: '543',
      duration: '4:12',
      genre: 'Bhangra',
      isCollaborative: false
    },
    {
      id: 3,
      title: 'Sufi Soul Music Video',
      artist: 'Priya Sharma',
      role: 'Video Editor',
      thumbnail: '🎬',
      plays: '15.3K',
      likes: '1.2K',
      duration: '5:20',
      genre: 'Sufi',
      isCollaborative: true
    }
  ];

  const mockNotifications = [
    { id: 1, type: 'collaboration', message: 'Armaan Singh wants to collaborate on a new track', time: '2h ago' },
    { id: 2, type: 'like', message: 'Your track "Dil Da Mamla" received 50 new likes', time: '4h ago' },
    { id: 3, type: 'message', message: 'New message from Priya Kaur about the upcoming project', time: '6h ago' }
  ];

  const mockProfessionals = [
    {
      id: 1,
      name: 'Armaan Singh',
      role: 'Singer',
      location: 'Punjab, India',
      rating: 4.9,
      experience: 'Professional (7 years)',
      isVerified: true,
      isOnline: true,
      specialization: 'Punjabi Folk'
    },
    {
      id: 2,
      name: 'Priya Kaur',
      role: 'Music Director',
      location: 'Mumbai, India',
      rating: 4.8,
      experience: 'Expert (12 years)',
      isVerified: true,
      isOnline: false,
      specialization: 'Bollywood'
    },
    {
      id: 3,
      name: 'Ravi Sharma',
      role: 'Sound Engineer',
      location: 'Toronto, Canada',
      rating: 4.7,
      experience: 'Professional (5 years)',
      isVerified: false,
      isOnline: true,
      specialization: 'Mixing & Mastering'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'singer': return <Mic className="w-4 h-4" />;
      case 'music director': return <Music className="w-4 h-4" />;
      case 'video editor': return <Video className="w-4 h-4" />;
      case 'sound engineer': return <Headphones className="w-4 h-4" />;
      default: return <Music className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="nav-premium sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="icon-premium">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-gradient-primary">SoundConnect</span>
              </div>
              
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search professionals, projects, or genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 input-premium"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button className="btn-premium">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Bell className="w-5 h-5" />
                </Button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
              </div>

              <Avatar className="w-10 h-10 cursor-pointer border-2 border-primary">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  JS
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UserProfileCard />
            <ActivityFeed />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="bg-card/80 backdrop-blur-md mb-8 w-full justify-start border border-border/50">
                <TabsTrigger value="feed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Feed
                </TabsTrigger>
                <TabsTrigger value="discover" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Search className="w-4 h-4 mr-2" />
                  Discover
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Music className="w-4 h-4 mr-2" />
                  My Projects
                </TabsTrigger>
                <TabsTrigger value="network" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  Network
                </TabsTrigger>
                <TabsTrigger value="gamification" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Progress
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Latest from Your Network</h2>
                  <Button variant="outline" className="hover-scale">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                {mockProjects.map((project) => (
                  <Card key={project.id} className="floating-card group hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                          {project.thumbnail}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-muted-foreground">by {project.artist}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {project.role}
                                </Badge>
                                {project.isCollaborative && (
                                  <Badge className="bg-primary/20 text-primary text-xs">
                                    Collaborative
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button size="icon" className="btn-premium opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {project.duration}
                            </span>
                            <span>{project.genre}</span>
                            <span>{project.plays} plays</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                                <Heart className="w-4 h-4 mr-2" />
                                {project.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Comment
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="discover" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Discover Professionals</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="hover-scale">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {mockProfessionals.map((professional) => (
                    <Card key={professional.id} className="floating-card group hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="w-12 h-12 border-2 border-primary">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {professional.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {professional.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{professional.name}</h3>
                                {professional.isVerified && (
                                  <Star className="w-4 h-4 text-primary fill-current" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {getRoleIcon(professional.role)}
                                <span className="text-muted-foreground text-sm">{professional.role}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center text-primary text-sm mb-1">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {professional.rating}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-muted-foreground text-sm">
                            <MapPin className="w-3 h-3 mr-2" />
                            {professional.location}
                          </div>
                          <p className="text-sm">{professional.specialization}</p>
                          <p className="text-muted-foreground text-xs">{professional.experience}</p>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" className="btn-premium flex-1">
                            Connect
                          </Button>
                          <Button size="sm" variant="outline" className="hover-scale">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Projects</h2>
                  <Button className="btn-premium">
                    <Upload className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="floating-card border-dashed border-border">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-2">Upload Your First Project</h3>
                      <p className="text-muted-foreground text-sm mb-4">Share your music, videos, or creative work with the community</p>
                      <Button className="btn-premium">
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="network" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Network</h2>
                  <Button className="btn-premium">
                    <Users className="w-4 h-4 mr-2" />
                    Find Connections
                  </Button>
                </div>

                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Build Your Network</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Connect with other music professionals to collaborate, learn, and grow your career together.
                  </p>
                  <Button className="btn-premium">
                    Discover Professionals
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="gamification" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Your Progress Journey</h2>
                  <Badge className="bg-primary text-primary-foreground">
                    Level 3 • Rising Star
                  </Badge>
                </div>

                <GameficationPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
