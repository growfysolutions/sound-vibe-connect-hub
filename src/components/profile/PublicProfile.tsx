
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  MessageCircle, 
  UserPlus, 
  MapPin, 
  Star, 
  Verified, 
  Calendar,
  Music,
  Headphones,
  Award,
  TrendingUp,
  Users,
  Radio
} from 'lucide-react';

const PublicProfile = () => {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const [expandedBio, setExpandedBio] = useState(false);

  const tracks = [
    {
      id: 1,
      title: "ਮਾਵਾਂ ਦੀ ਦੁਆ",
      titleEng: "Mavan Di Dua",
      duration: "4:23",
      genre: "Sufi Folk",
      likes: 1240,
      plays: 45600
    },
    {
      id: 2,
      title: "ਸੱਚਾ ਇਸ਼ਕ",
      titleEng: "Sacha Ishq", 
      duration: "3:45",
      genre: "Qawwali Fusion",
      likes: 2890,
      plays: 78900
    },
    {
      id: 3,
      title: "ਪੰਜਾਬੀ ਤੇ ਮਾਣ",
      titleEng: "Punjabi Te Maan",
      duration: "5:12",
      genre: "Folk Fusion",
      likes: 980,
      plays: 34500
    }
  ];

  const skills = [
    { name: "Sufi Music", level: 5, endorsements: 23 },
    { name: "Qawwali", level: 5, endorsements: 19 },
    { name: "Folk Fusion", level: 4, endorsements: 31 },
    { name: "Traditional Vocals", level: 5, endorsements: 28 },
    { name: "Modern Arrangement", level: 4, endorsements: 15 },
    { name: "Harmonium", level: 4, endorsements: 12 }
  ];

  const recentActivity = [
    {
      type: "collaboration",
      text: "Collaborated with Simran Kaur on 'ਰੱਬ ਦੇ ਨਾਮ'",
      time: "2 days ago",
      icon: Users
    },
    {
      type: "achievement", 
      text: "Reached 1M+ total streams milestone",
      time: "1 week ago",
      icon: Award
    },
    {
      type: "release",
      text: "Released new track 'ਮਾਵਾਂ ਦੀ ਦੁਆ'",
      time: "2 weeks ago",
      icon: Music
    }
  ];

  const togglePlay = (trackId: number) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-deep-blue via-cosmic-purple to-space-black">
      {/* Cover Photo Header */}
      <div className="relative h-80 bg-gradient-to-r from-cosmic-purple to-nebula-pink overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay opacity-30" />
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white/20 shadow-cosmic-glow">
                <AvatarImage src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3" alt="Jasbir Singh" />
                <AvatarFallback className="text-2xl">JS</AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                <Verified className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
            </div>
            
            {/* Name and Info */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">
                ਜਸਬੀਰ ਸਿੰਘ
                <span className="block text-2xl font-normal text-white/80">Jasbir Singh</span>
              </h1>
              <p className="text-lg text-white/90">Traditional Folk meets Modern Arrangement</p>
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <MapPin className="w-3 h-3 mr-1" />
                  Amritsar, Punjab
                </Badge>
                <Badge variant="secondary" className="bg-gold-500/20 text-gold-400 border-gold-500/30">
                  <Music className="w-3 h-3 mr-1" />
                  Level 4 - Established Creator
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Bar */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-aurora-cyan">2.5K</div>
                    <div className="text-sm text-white/60">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-electric-blue">47</div>
                    <div className="text-sm text-white/60">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold-400">1.2M+</div>
                    <div className="text-sm text-white/60">Streams</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-gold-400 fill-current" />
                      <span className="text-2xl font-bold text-gold-400">4.8</span>
                    </div>
                    <div className="text-sm text-white/60">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Portfolio */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Radio className="w-6 h-6 text-aurora-cyan" />
                  Featured Tracks
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {tracks.map((track) => (
                  <div key={track.id} className="glass-card border-white/5 p-4 hover:border-aurora-cyan/30 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => togglePlay(track.id)}
                        className="w-12 h-12 rounded-full bg-aurora-cyan/20 hover:bg-aurora-cyan/40 text-aurora-cyan"
                      >
                        {playingTrack === track.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-white">{track.title}</h3>
                            <p className="text-sm text-white/60">{track.titleEng}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-white/80">{track.duration}</div>
                            <Badge variant="outline" className="text-xs border-electric-blue/50 text-electric-blue">
                              {track.genre}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Waveform Placeholder */}
                        <div className="h-8 bg-gradient-to-r from-aurora-cyan/20 to-electric-blue/20 rounded-full mb-2 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan to-electric-blue opacity-30 rounded-full" style={{ width: '60%' }} />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-white/60">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Headphones className="w-3 h-3" />
                              {track.plays.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {track.likes.toLocaleString()}
                            </span>
                          </div>
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-white/60 hover:text-white">
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <h2 className="text-2xl font-bold text-white">About</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-white/80 leading-relaxed">
                  <p>
                    Jasbir Singh is a passionate artist who bridges the gap between traditional Punjabi folk music and contemporary arrangements. 
                    Born and raised in Amritsar, the spiritual heart of Punjab, his music carries the essence of Sufi traditions while embracing modern production techniques.
                  </p>
                  {expandedBio && (
                    <div className="mt-4 space-y-3">
                      <p>
                        With over 8 years of experience in music production and vocal performance, Jasbir has collaborated with renowned artists 
                        across the Indian subcontinent. His expertise in Qawwali and Sufi music has earned him recognition in both traditional and fusion music circles.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Musical Influences</h4>
                          <ul className="text-sm text-white/70 space-y-1">
                            <li>• Ustad Nusrat Fateh Ali Khan</li>
                            <li>• Gurdas Maan</li>
                            <li>• Arijit Singh</li>
                            <li>• Traditional Sikh Kirtan</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-2">Equipment & Software</h4>
                          <ul className="text-sm text-white/70 space-y-1">
                            <li>• Pro Tools, Logic Pro X</li>
                            <li>• Neumann U87 Microphone</li>
                            <li>• Yamaha P-515 Piano</li>
                            <li>• Traditional Harmonium</li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Languages</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="border-aurora-cyan/50 text-aurora-cyan">Punjabi (Native)</Badge>
                          <Badge variant="outline" className="border-electric-blue/50 text-electric-blue">Hindi (Fluent)</Badge>
                          <Badge variant="outline" className="border-gold-400/50 text-gold-400">English (Conversational)</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setExpandedBio(!expandedBio)}
                  className="text-aurora-cyan hover:text-electric-blue"
                >
                  {expandedBio ? 'Show Less' : 'Read More'}
                </Button>
              </CardContent>
            </Card>

            {/* Skills & Genres */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <h2 className="text-2xl font-bold text-white">Skills & Expertise</h2>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30">
                          {skill.name}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < skill.level ? 'text-gold-400 fill-current' : 'text-white/20'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-white/60">
                        {skill.endorsements} endorsements
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-6 space-y-3">
                <Button className="w-full bg-aurora-cyan hover:bg-electric-blue text-black font-semibold">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Connect & Collaborate
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full border-gold-400/50 text-gold-400 hover:bg-gold-400/10">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book for Project
                </Button>
                <Button variant="ghost" className="w-full text-white/60 hover:text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-aurora-cyan" />
                  Recent Activity
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-aurora-cyan/20 flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-aurora-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80">{activity.text}</p>
                      <p className="text-xs text-white/50 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Profile Views</span>
                  <span className="text-aurora-cyan font-semibold">12.4K this month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Collaboration Rate</span>
                  <span className="text-green-400 font-semibold">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Response Time</span>
                  <span className="text-gold-400 font-semibold">< 2 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Member Since</span>
                  <span className="text-white/80">March 2021</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
