
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Music, Users } from 'lucide-react';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { CulturalIconButton } from '@/components/ui/CulturalIconButton';
import { CulturalCard } from '@/components/cards/CulturalCard';
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
    <CulturalCard 
      variant="profile"
      className={cn(
        "w-full max-w-80 transition-all duration-300 hover:-translate-y-1",
        "shadow-modern-ocean hover:shadow-ocean-glow",
        "bg-gradient-to-br from-card via-card to-hsl(var(--ocean-blue))/5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-hsl(var(--ocean-blue))/30 ring-2 ring-hsl(var(--ocean-blue))/20 shadow-lg">
              <AvatarImage src={artist.avatar} alt={artist.name} />
              <AvatarFallback className="bg-gradient-to-br from-hsl(var(--ocean-blue))/20 to-hsl(var(--teal))/20 text-hsl(var(--ocean-blue)) font-semibold">
                {artist.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {artist.isVerified && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-hsl(var(--teal)) to-hsl(var(--teal-dark)) rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-foreground">{artist.name}</h3>
            <p className="text-sm text-muted-foreground font-medium">{artist.role}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
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

      {/* Details Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2 text-hsl(var(--ocean-blue))" />
          <span>{artist.location}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Music className="w-4 h-4 mr-2 text-hsl(var(--ocean-blue))" />
          <span>{artist.experience}</span>
        </div>
      </div>

      {/* Rating Section */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(artist.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">{artist.rating}</span>
        </div>
        <span className="text-sm text-muted-foreground">({artist.reviewCount} reviews)</span>
      </div>

      {/* Recent Work Section */}
      <div className="bg-gradient-to-br from-hsl(var(--ocean-blue))/10 to-hsl(var(--teal))/10 rounded-lg p-3 mb-4 border border-hsl(var(--ocean-blue))/20">
        <div className="flex items-center justify-between">
          <div className="flex-1">
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

      {/* Skills Section */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2 text-foreground">Skills</p>
        <div className="flex flex-wrap gap-1">
          {artist.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-hsl(var(--ocean-blue))/10 text-hsl(var(--ocean-blue)) border-hsl(var(--ocean-blue))/20">
              {skill}
            </Badge>
          ))}
          {artist.skills.length > 4 && (
            <Badge variant="outline" className="text-xs border-hsl(var(--ocean-blue))/30 text-hsl(var(--ocean-blue))">
              +{artist.skills.length - 4} more
            </Badge>
          )}
        </div>
      </div>

      {/* Collaborations */}
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Users className="w-4 h-4 mr-2 text-hsl(var(--teal))" />
        <span>{artist.collaborations} successful collaborations</span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
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
    </CulturalCard>
  );
};
