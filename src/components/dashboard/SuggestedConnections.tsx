import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/types';
import { UserPlus, Info, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SuggestedProfile extends Profile {
  compatibility: number;
  matchReason: string;
}

export function SuggestedConnections() {
  const [suggestions, setSuggestions] = useState<SuggestedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingConnections, setPendingConnections] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's profile to compare
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get existing connections
      const { data: connections } = await supabase
        .from('connections')
        .select('requester_id, addressee_id')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .in('status', ['accepted', 'pending']);

      const connectedIds = connections?.flatMap(c => [c.requester_id, c.addressee_id]) || [];
      const excludeIds = [...connectedIds, user.id];

      // Get potential connections
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .limit(20);

      if (!profiles || !userProfile) {
        setLoading(false);
        return;
      }

      // Calculate compatibility and reasons
      const suggestionsWithCompatibility = profiles.map(profile => {
        const compatibility = calculateCompatibility(userProfile, profile);
        const matchReason = getMatchReason(userProfile, profile);
        
        return {
          ...profile,
          compatibility,
          matchReason
        };
      }).sort((a, b) => b.compatibility - a.compatibility).slice(0, 4);

      setSuggestions(suggestionsWithCompatibility);
      
      // Get pending connection requests
      const { data: pending } = await supabase
        .from('connections')
        .select('addressee_id')
        .eq('requester_id', user.id)
        .eq('status', 'pending');
        
      setPendingConnections(pending?.map(p => p.addressee_id) || []);
      
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompatibility = (user: Profile, other: Profile): number => {
    let score = 0;
    let factors = 0;

    // Shared skills
    if (user.skills && other.skills) {
      const sharedSkills = user.skills.filter(skill => other.skills?.includes(skill));
      score += (sharedSkills.length / Math.max(user.skills.length, other.skills.length)) * 30;
      factors++;
    }

    // Complementary roles
    if (user.professional_roles && other.professional_roles) {
      const complementaryRoles = ['Producer', 'Vocalist', 'Songwriter', 'Mixer'];
      const userRoles = user.professional_roles;
      const otherRoles = other.professional_roles;
      
      const hasComplementary = userRoles.some(role => 
        complementaryRoles.includes(role) && !otherRoles.includes(role)
      );
      
      if (hasComplementary) score += 25;
      factors++;
    }

    // Same location
    if (user.location && other.location && user.location === other.location) {
      score += 20;
    }
    factors++;

    // Similar genres
    if (user.genres && other.genres) {
      const sharedGenres = user.genres.filter(genre => other.genres?.includes(genre));
      score += (sharedGenres.length / Math.max(user.genres.length, other.genres.length)) * 20;
      factors++;
    }

    // Experience level compatibility
    if (user.experience && other.experience) {
      const levels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
      const userLevel = levels.indexOf(user.experience);
      const otherLevel = levels.indexOf(other.experience);
      
      if (Math.abs(userLevel - otherLevel) <= 1) score += 15;
      factors++;
    }

    return Math.min(Math.round(score), 99);
  };

  const getMatchReason = (user: Profile, other: Profile): string => {
    // Shared skills
    if (user.skills && other.skills) {
      const sharedSkills = user.skills.filter(skill => other.skills?.includes(skill));
      if (sharedSkills.length > 0) {
        return `Shared skills: ${sharedSkills.slice(0, 2).join(', ')}`;
      }
    }

    // Complementary roles
    if (user.professional_roles && other.professional_roles) {
      const complementaryPairs = {
        'Producer': 'Songwriter',
        'Songwriter': 'Vocalist',
        'Vocalist': 'Producer',
        'Mixer': 'Producer'
      };
      
      for (const userRole of user.professional_roles) {
        if (complementaryPairs[userRole] && other.professional_roles.includes(complementaryPairs[userRole])) {
          return `Complementary roles: ${userRole} + ${complementaryPairs[userRole]}`;
        }
      }
    }

    // Same location
    if (user.location && other.location && user.location === other.location) {
      return `Same location: ${user.location}`;
    }

    // Similar genres
    if (user.genres && other.genres) {
      const sharedGenres = user.genres.filter(genre => other.genres?.includes(genre));
      if (sharedGenres.length > 0) {
        return `Shared genres: ${sharedGenres.slice(0, 2).join(', ')}`;
      }
    }

    return 'Similar profile and interests';
  };

  const handleConnect = async (profileId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to connect.');
      return;
    }

    setPendingConnections(prev => [...prev, profileId]);

    const { error } = await supabase.from('connections').insert({
      requester_id: user.id,
      addressee_id: profileId,
      status: 'pending',
    });

    if (error) {
      toast.error(error.message);
      setPendingConnections(prev => prev.filter(id => id !== profileId));
    } else {
      toast.success('Connection request sent!');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Suggested Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Suggested Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Complete your profile to get personalized suggestions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Suggested Connections
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard?tab=discover')}
              className="text-primary hover:text-primary/80"
            >
              See All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((profile) => (
              <div key={profile.id} className="flex items-center space-x-3 group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback>{profile.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{profile.full_name}</h4>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {profile.compatibility}% match
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-1">
                    {profile.role || 'Music Professional'}
                  </p>
                  
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{profile.matchReason}</p>
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-xs text-muted-foreground truncate">
                      {profile.matchReason}
                    </span>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConnect(profile.id)}
                  disabled={pendingConnections.includes(profile.id)}
                  className="shrink-0 h-8"
                >
                  {pendingConnections.includes(profile.id) ? (
                    'Sent'
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3 mr-1" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}