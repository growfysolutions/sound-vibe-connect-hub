import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Edit, CheckCircle, Clock } from 'lucide-react';

import { useProfile } from '@/contexts/ProfileContext';
import { useCulturalProfile } from '@/hooks/useCulturalProfile';
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

const UserProfileCard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { profile, loading: profileLoading, refetchProfile } = useProfile();
  const { culturalProfile, loading: culturalLoading } = useCulturalProfile();
  const [projectCount, setProjectCount] = useState(0);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [collaborationsCount, setCollaborationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        const { count, error: countError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (countError) {
          toast.error('Could not fetch project count.');
        } else {
          setProjectCount(count || 0);
        }

        const { count: connectionsCount, error: connectionsError } = await supabase
          .from('connections')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'accepted')
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

        if (connectionsError) {
          toast.error('Could not fetch connections count.');
        } else {
          setConnectionsCount(connectionsCount || 0);
        }

        const { count: collaborationsCount, error: collaborationsError } = await supabase
          .from('project_collaborators')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (collaborationsError) {
          toast.error('Could not fetch collaborations count.');
        } else {
          setCollaborationsCount(collaborationsCount || 0);
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate, profile, refetchProfile]);

  if (loading || profileLoading || culturalLoading) {
    return (
      <Card className="floating-card">
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  const getVerificationIcon = () => {
    const status = culturalProfile?.verification_status || 'pending';
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="floating-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Avatar className="w-20 h-20 border-4 border-primary">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User avatar'} />
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
              {profile?.full_name?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="icon" onClick={() => navigate('/settings')}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">
            {profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'New User'}
          </h2>
          {getVerificationIcon()}
        </div>
        
        <p className="text-muted-foreground mb-2">{profile?.role || 'Role not set'}</p>
        
        {culturalProfile?.preferred_language && (
          <Badge variant="outline" className="mb-2">
            {culturalProfile.preferred_language === 'both' ? 'Bilingual' : 
             culturalProfile.preferred_language.charAt(0).toUpperCase() + culturalProfile.preferred_language.slice(1)}
          </Badge>
        )}

        {culturalProfile?.cultural_specialties && culturalProfile.cultural_specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {culturalProfile.cultural_specialties.slice(0, 3).map(specialty => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {culturalProfile.cultural_specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{culturalProfile.cultural_specialties.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-center text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {profile?.location || 'Location not set'}
        </div>
        
        <div className="flex justify-center space-x-4 mb-4">
          <div className="text-center">
            <p className="font-bold text-lg">{profile?.rating || 'N/A'}</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{profile?.reviews || 0}</p>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2.5 mb-2">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(profile?.level || 1) * 10}%` }}></div>
        </div>
        <p className="text-center text-xs text-muted-foreground">Level {profile?.level || 1}</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around text-center p-4 bg-muted/50 rounded-lg">
          <div>
            <h4 className="font-bold text-lg">{projectCount}</h4>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
          <div>
            <h4 className="font-bold text-lg">{connectionsCount}</h4>
            <p className="text-xs text-muted-foreground">Connections</p>
          </div>
          <div>
            <h4 className="font-bold text-lg">{collaborationsCount}</h4>
            <p className="text-xs text-muted-foreground">Collaborations</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
