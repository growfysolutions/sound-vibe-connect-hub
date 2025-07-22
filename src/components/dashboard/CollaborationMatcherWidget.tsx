
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MapPin, Music, Star, MessageCircle, Heart } from 'lucide-react';

interface CollaborationMatch {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  distance: string;
  compatibility: number;
  skills: string[];
  style: string;
  lookingFor: string;
  matchReasons: string[];
  isOnline: boolean;
}

export function CollaborationMatcherWidget() {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const matches: CollaborationMatch[] = [
    {
      id: '1',
      name: 'Arjun Dhaliwal',
      location: 'Vancouver, BC',
      distance: '2.1 km',
      compatibility: 92,
      skills: ['Tabla', 'Vocals', 'Composition'],
      style: 'Traditional-Modern Fusion',
      lookingFor: 'Harmonium player for EP',
      matchReasons: ['Complementary skills', 'Similar style', 'Same city', 'High ratings'],
      isOnline: true
    },
    {
      id: '2',
      name: 'Simrat Kaur',
      location: 'Brampton, ON',
      distance: '15.3 km',
      compatibility: 87,
      skills: ['Sitar', 'Classical Vocals', 'Music Theory'],
      style: 'Classical Punjabi',
      lookingFor: 'Producer for traditional album',
      matchReasons: ['Experience level match', 'Cultural alignment', 'Available schedule'],
      isOnline: false
    },
    {
      id: '3',
      name: 'The Beats Collective',
      location: 'Mississauga, ON',
      distance: '8.7 km',
      compatibility: 85,
      skills: ['Production', 'Mixing', 'Electronic'],
      style: 'Electronic Bhangra',
      lookingFor: 'Dhol player for live shows',
      matchReasons: ['Genre compatibility', 'Professional setup', 'Tour experience'],
      isOnline: true
    }
  ];

  const currentMatch = matches[currentMatchIndex];

  const handleNext = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
  };

  const handlePrevious = () => {
    setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
  };

  const handleConnect = () => {
    // Connect logic would go here
    console.log('Connecting with:', currentMatch.name);
  };

  const handlePass = () => {
    handleNext();
  };

  return (
    <Card className="border-saffron/20 bg-gradient-to-br from-card/95 to-background/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Users className="w-5 h-5 text-saffron" />
          <span>Perfect Matches</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Match Card */}
        <div className="relative p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border border-border/50">
          {/* Compatibility Score */}
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-amber-600">{currentMatch.compatibility}%</span>
          </div>

          {/* Profile Section */}
          <div className="flex items-start space-x-3 mb-3">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-saffron/30">
                <AvatarImage src={currentMatch.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-saffron to-amber-500 text-white font-semibold">
                  {currentMatch.name.split(' ').map(n => n.charAt(0)).join('')}
                </AvatarFallback>
              </Avatar>
              {currentMatch.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{currentMatch.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentMatch.location} • {currentMatch.distance}
              </p>
              <p className="text-xs text-saffron mt-1">{currentMatch.style}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2 mb-3">
            <div className="flex flex-wrap gap-1">
              {currentMatch.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Looking For */}
          <div className="space-y-2 mb-3">
            <div className="flex items-start gap-2">
              <Music className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium">Looking for:</p>
                <p className="text-xs text-muted-foreground">{currentMatch.lookingFor}</p>
              </div>
            </div>
          </div>

          {/* Match Reasons */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium">Why you match:</p>
            <div className="flex flex-wrap gap-1">
              {currentMatch.matchReasons.map((reason, index) => (
                <span key={index} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                  {reason}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handlePass} className="flex-1">
              Pass
            </Button>
            <Button size="sm" onClick={handleConnect} className="flex-1">
              <MessageCircle className="w-3 h-3 mr-1" />
              Connect
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button size="sm" variant="ghost" onClick={handlePrevious}>
            ← Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            {currentMatchIndex + 1} of {matches.length}
          </span>
          <Button size="sm" variant="ghost" onClick={handleNext}>
            Next →
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/30">
          <div className="text-center">
            <p className="text-xs font-medium">15</p>
            <p className="text-xs text-muted-foreground">New matches</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium">8</p>
            <p className="text-xs text-muted-foreground">Connected</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium">3</p>
            <p className="text-xs text-muted-foreground">Collaborating</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
