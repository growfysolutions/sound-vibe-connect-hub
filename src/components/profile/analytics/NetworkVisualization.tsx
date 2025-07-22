import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Globe, BookOpen, MessageCircle } from 'lucide-react';

interface NetworkVisualizationProps {
  profileId: string;
  timeRange: string;
}

export function NetworkVisualization({}: NetworkVisualizationProps) {
  // Mock data - in real app, this would come from API
  const networkStats = {
    totalConnections: 247,
    qualityScore: 8.6,
    influenceRating: 7.8,
    crossCulturalDiversity: 65,
    mentorshipRelations: 12
  };

  const topInfluencers = [
    {
      id: 1,
      name: 'Simran Kaur',
      role: 'Traditional Vocalist',
      connections: 156,
      influence: 9.2,
      mutualConnections: 23,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b132?w=150',
      categories: ['Vocals', 'Traditional']
    },
    {
      id: 2,
      name: 'Arjun Singh',
      role: 'Music Producer',
      connections: 203,
      influence: 8.9,
      mutualConnections: 18,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      categories: ['Production', 'Modern']
    },
    {
      id: 3,
      name: 'Preet Kaur',
      role: 'Cultural Researcher',
      connections: 124,
      influence: 8.7,
      mutualConnections: 31,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      categories: ['Research', 'Academia']
    }
  ];

  const culturalDiversity = [
    { region: 'Punjab (India)', percentage: 45, count: 111 },
    { region: 'UK Punjabi Community', percentage: 22, count: 54 },
    { region: 'Canadian Punjabi', percentage: 18, count: 44 },
    { region: 'US Diaspora', percentage: 10, count: 25 },
    { region: 'Australia/NZ', percentage: 5, count: 13 }
  ];

  const collaborationCircles = [
    {
      name: 'Traditional Preservationists',
      members: 34,
      activity: 92,
      focus: 'Maintaining authentic Punjabi musical traditions'
    },
    {
      name: 'Fusion Innovators',
      members: 28,
      activity: 87,
      focus: 'Blending traditional with contemporary styles'
    },
    {
      name: 'Cultural Educators',
      members: 19,
      activity: 78,
      focus: 'Teaching and spreading Punjabi musical heritage'
    },
    {
      name: 'Industry Professionals',
      members: 42,
      activity: 95,
      focus: 'Commercial music production and distribution'
    }
  ];

  const mentorshipNetwork = [
    {
      type: 'Mentoring',
      count: 8,
      description: 'Upcoming artists you are guiding',
      recent: 'Guided 2 new artists this month'
    },
    {
      type: 'Being Mentored',
      count: 4,
      description: 'Experienced professionals mentoring you',
      recent: 'Regular sessions with industry veterans'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Network Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Network Quality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <div className="text-3xl font-bold text-blue-600">{networkStats.qualityScore}/10</div>
            <div className="text-sm text-muted-foreground">Overall Quality Score</div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Connection Quality</span>
                <span>{networkStats.qualityScore}/10</span>
              </div>
              <Progress value={networkStats.qualityScore * 10} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Influence Rating</span>
                <span>{networkStats.influenceRating}/10</span>
              </div>
              <Progress value={networkStats.influenceRating * 10} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Cultural Diversity</span>
                <span>{networkStats.crossCulturalDiversity}%</span>
              </div>
              <Progress value={networkStats.crossCulturalDiversity} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Influencers in Network */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Key Network Influencers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topInfluencers.map((influencer) => (
            <div key={influencer.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={influencer.avatar} alt={influencer.name} />
                  <AvatarFallback>{influencer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{influencer.name}</h4>
                  <p className="text-sm text-muted-foreground">{influencer.role}</p>
                  <div className="flex gap-1 mt-1">
                    {influencer.categories.map((cat) => (
                      <Badge key={cat} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Influence: {influencer.influence}/10</div>
                <div className="text-xs text-muted-foreground">{influencer.connections} connections</div>
                <div className="text-xs text-muted-foreground">{influencer.mutualConnections} mutual</div>
                <Button variant="outline" size="sm" className="mt-2">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cultural Diversity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-500" />
            Cultural Diversity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {culturalDiversity.map((region) => (
            <div key={region.region} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{region.region}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{region.count}</span>
                  <Badge variant="secondary" className="text-xs">
                    {region.percentage}%
                  </Badge>
                </div>
              </div>
              <Progress value={region.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Collaboration Circles */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Collaboration Circles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborationCircles.map((circle, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{circle.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {circle.members} members
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {circle.activity}% active
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{circle.focus}</p>
                <Progress value={circle.activity} className="h-1.5 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mentorship Network */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            Mentorship Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentorshipNetwork.map((relation, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-rose-500/10 to-pink-500/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{relation.type}</h4>
                  <div className="text-2xl font-bold text-rose-600">{relation.count}</div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{relation.description}</p>
                <p className="text-xs text-muted-foreground italic">{relation.recent}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Growth Summary */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Network Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <div className="text-2xl font-bold text-blue-600">{networkStats.totalConnections}</div>
              <div className="text-sm text-muted-foreground">Total Connections</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="text-2xl font-bold text-purple-600">{networkStats.qualityScore}/10</div>
              <div className="text-sm text-muted-foreground">Quality Score</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <div className="text-2xl font-bold text-green-600">{networkStats.crossCulturalDiversity}%</div>
              <div className="text-sm text-muted-foreground">Cultural Diversity</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
              <div className="text-2xl font-bold text-amber-600">{networkStats.influenceRating}/10</div>
              <div className="text-sm text-muted-foreground">Influence Rating</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-rose-500/10 to-red-500/10">
              <div className="text-2xl font-bold text-rose-600">{networkStats.mentorshipRelations}</div>
              <div className="text-sm text-muted-foreground">Mentorship Links</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
