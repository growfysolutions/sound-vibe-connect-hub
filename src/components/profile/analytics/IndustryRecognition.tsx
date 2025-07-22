import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Trophy, Star, ExternalLink, Newspaper, Music } from 'lucide-react';

interface IndustryRecognitionProps {
  profileId: string;
  timeRange: string;
}

export function IndustryRecognition({ profileId, timeRange }: IndustryRecognitionProps) {
  // Mock data - in real app, this would come from API
  const awards = [
    {
      id: 1,
      title: 'Best Traditional Fusion Artist 2024',
      organization: 'Punjab Music Awards',
      type: 'Winner',
      date: '2024-06-15',
      category: 'Folk Fusion',
      description: 'Recognized for innovative blend of traditional Punjabi folk with contemporary elements'
    },
    {
      id: 2,
      title: 'Rising Star in World Music',
      organization: 'Global Music Coalition',
      type: 'Nomination',
      date: '2024-05-20',
      category: 'World Music',
      description: 'Nominated for outstanding contribution to world music preservation'
    },
    {
      id: 3,
      title: 'Cultural Ambassador Award',
      organization: 'Punjab Cultural Society',
      type: 'Winner',
      date: '2024-03-10',
      category: 'Cultural Impact',
      description: 'Honored for promoting Punjabi culture through music internationally'
    }
  ];

  const mediaFeatures = [
    {
      id: 1,
      outlet: 'BBC Asian Network',
      title: 'The New Voice of Punjab: Traditional Meets Modern',
      type: 'Interview',
      date: '2024-07-02',
      reach: '2.3M listeners',
      url: '#'
    },
    {
      id: 2,
      outlet: 'Rolling Stone India',
      title: 'Folk Fusion: Artists Reshaping Indian Music',
      type: 'Feature Article',
      date: '2024-06-18',
      reach: '1.8M readers',
      url: '#'
    },
    {
      id: 3,
      outlet: 'Spotify Editorial',
      title: 'Punjabi Pride: New Generation of Artists',
      type: 'Playlist Feature',
      date: '2024-05-30',
      reach: '500K+ streams',
      url: '#'
    }
  ];

  const playlistPlacements = [
    {
      platform: 'Spotify',
      playlist: 'Punjabi Pop',
      followers: '2.1M',
      track: 'ਮਾਵਾਂ ਦੀ ਦੁਆ',
      position: 7,
      streams: '1.2M'
    },
    {
      platform: 'Apple Music',
      playlist: 'Desi Hits',
      followers: '850K',
      track: 'ਸੱਚਾ ਇਸ਼ਕ',
      position: 12,
      streams: '680K'
    },
    {
      platform: 'YouTube Music',
      playlist: 'Folk Fusion India',
      followers: '1.5M',
      track: 'ਪੰਜਾਬੀ ਤੇ ਮਾਣ',
      position: 4,
      streams: '920K'
    }
  ];

  const endorsements = [
    {
      name: 'Gurdas Maan',
      role: 'Legendary Punjabi Singer',
      quote: 'A fresh voice that honors our traditions while embracing the future.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    {
      name: 'Dr. Gurnam Singh',
      role: 'Music Producer & Composer',
      quote: 'Exceptional talent with deep understanding of Punjabi musical heritage.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Awards & Nominations */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Awards & Nominations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {awards.map((award) => (
            <div key={award.id} className="p-4 rounded-lg border border-border/50 hover:border-saffron/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    award.type === 'Winner' 
                      ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' 
                      : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
                  }`}>
                    {award.type === 'Winner' ? (
                      <Trophy className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Star className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{award.title}</h3>
                    <p className="text-sm text-muted-foreground">{award.organization}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={award.type === 'Winner' ? 'default' : 'secondary'} className="mb-1">
                    {award.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{new Date(award.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{award.description}</p>
              <Badge variant="outline" className="mt-2 text-xs">
                {award.category}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Media Coverage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-500" />
            Media Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mediaFeatures.map((feature) => (
            <div key={feature.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-sm">{feature.outlet}</h4>
                  <p className="text-xs text-muted-foreground">{feature.type}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm font-medium mb-1">{feature.title}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{new Date(feature.date).toLocaleDateString()}</span>
                <Badge variant="secondary" className="text-xs">
                  {feature.reach}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Playlist Placements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-green-500" />
            Playlist Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {playlistPlacements.map((placement, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-sm">{placement.playlist}</h4>
                  <p className="text-xs text-muted-foreground">{placement.platform}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  #{placement.position}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{placement.track}</p>
              <div className="flex items-center justify-between text-xs">
                <span>{placement.followers} followers</span>
                <span className="font-medium">{placement.streams} streams</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Industry Endorsements */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Industry Endorsements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {endorsements.map((endorsement, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={endorsement.avatar} 
                    alt={endorsement.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{endorsement.name}</h4>
                    <p className="text-sm text-muted-foreground">{endorsement.role}</p>
                  </div>
                </div>
                <blockquote className="text-sm italic">"{endorsement.quote}"</blockquote>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recognition Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recognition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
              <div className="text-2xl font-bold text-amber-600">12</div>
              <div className="text-sm text-muted-foreground">Total Awards</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <div className="text-2xl font-bold text-blue-600">28</div>
              <div className="text-sm text-muted-foreground">Media Features</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <div className="text-2xl font-bold text-green-600">47</div>
              <div className="text-sm text-muted-foreground">Playlist Features</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="text-2xl font-bold text-purple-600">15</div>
              <div className="text-sm text-muted-foreground">Industry Endorsements</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
