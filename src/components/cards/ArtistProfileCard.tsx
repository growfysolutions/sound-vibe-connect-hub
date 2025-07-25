
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Music, Users } from 'lucide-react';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { CulturalIconButton } from '@/components/ui/CulturalIconButton';
import { cn } from '@/lib/utils';

interface ArtistProfileCardProps {
  artist: {
    id: string;
    name: string;
    role: string;
    location: string;
    experience: string;
    rating: number;
    reviewCount: number;
    recentWork: string;
    skills: string[];
    avatar: string;
    isVerified: boolean;
    collaborations: number;
  };
  onConnect?: (artistId: string) => void;
  onViewProfile?: (artistId: string) => void;
  onSave?: (artistId: string) => void;
  onShare?: (artistId: string) => void;
}

export const ArtistProfileCard: React.FC<ArtistProfileCardProps> = ({
  artist,
  onConnect,
  onViewProfile,
  onSave,
  onShare
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(artist.id);
  };

  const handleShare = () => {
    onShare?.(artist.id);
  };

  return (
    <Card 
      className={cn(
        "w-80 h-auto p-4 bg-white relative overflow-hidden transition-all duration-300",
        "shadow-[0_4px_12px_rgba(30,64,175,0.1)] rounded-xl",
        "hover:shadow-[0_8px_24px_rgba(30,64,175,0.2)] hover:-translate-y-1",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-ocean-blue/5 before:to-teal/5 before:opacity-50",
        "border border-ocean-blue/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cultural pattern watermark */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-ocean-blue">
          <pattern id="phulkari" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M10,5 L15,10 L10,15 L5,10 Z" />
          </pattern>
          <rect width="100" height="100" fill="url(#phulkari)" />
        </svg>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-ocean-blue/30 ring-2 ring-ocean-blue/20">
                <AvatarImage src={artist.avatar} alt={artist.name} />
                <AvatarFallback className="bg-ocean-blue/20 text-ocean-blue font-semibold">
                  {artist.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {artist.isVerified && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{artist.name}</h3>
              <p className="text-sm text-muted-foreground">{artist.role}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <CulturalIconButton
              icon={isSaved ? "heart" : "heart"}
              variant={isSaved ? "liked" : "default"}
              size="sm"
              onClick={handleSave}
            />
            <CulturalIconButton
              icon="share"
              size="sm"
              onClick={handleShare}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location and Experience */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-ocean-blue" />
            {artist.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Music className="w-4 h-4 mr-2 text-ocean-blue" />
            {artist.experience}
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(artist.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{artist.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({artist.reviewCount} reviews)</span>
        </div>

        {/* Recent Work */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Recent Work</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{artist.recentWork}</p>
            </div>
            {isHovered && (
              <CulturalIconButton
                icon="play"
                size="sm"
                variant="playing"
              />
            )}
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-sm font-medium mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {artist.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {artist.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{artist.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Collaboration Count */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2 text-ocean-blue" />
          {artist.collaborations} successful collaborations
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <CulturalButton
            variant="primary"
            size="sm"
            onClick={() => onConnect?.(artist.id)}
            className="flex-1"
          >
            Connect
          </CulturalButton>
          <CulturalButton
            variant="secondary"
            size="sm"
            onClick={() => onViewProfile?.(artist.id)}
            className="flex-1"
          >
            View Profile
          </CulturalButton>
        </div>
      </CardContent>
    </Card>
  );
};
