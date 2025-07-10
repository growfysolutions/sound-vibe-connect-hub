import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Edit } from 'lucide-react';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  role: string;
  location: string;
  rating: number;
  reviews: number;
  level: number;
  experience?: string;
  is_verified?: boolean;
  is_online?: boolean;
  specialization?: string;
  tags?: string[];
}

const UserProfileCard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile not found, create one with some default professional data for testing
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.email ? user.email.split('@')[0] : `user-${user.id.slice(0, 8)}`,
              full_name: user.email ? user.email.split('@')[0] : 'New User',
              role: 'Producer',
              location: 'Los Angeles, CA',
              experience: '5-10 years',
              is_verified: true,
              is_online: true,
              specialization: 'Hip Hop, R&B',
              tags: ['mixing', 'mastering', 'beatmaking'],
            })
            .select()
            .single();

          if (insertError) {
            toast.error('Failed to create user profile.');
            console.error('Error creating profile:', insertError);
          } else {
            setProfile(newProfile as Profile);
          }
        } else if (profileError) {
          toast.error('Could not fetch user profile.');
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData as Profile);
        }

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
  }, [navigate]);

  if (loading) {
    return (
      <Card className="floating-card">
        <CardHeader>
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="rounded-full bg-muted h-20 w-20"></div>
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="floating-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Avatar className="w-20 h-20 border-4 border-primary">
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
              {profile?.full_name?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="icon" onClick={() => navigate('/settings')}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
        <h2 className="text-xl font-bold">{profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'New User'}</h2>
        <p className="text-muted-foreground mb-2">{profile?.role || 'Role not set'}</p>
        <div className="flex items-center justify-center text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {profile?.location || 'Location not set'}
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <div className="text-center">
            <p className="font-bold text-lg">{profile?.rating?.toFixed(1) || '0.0'}</p>
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

