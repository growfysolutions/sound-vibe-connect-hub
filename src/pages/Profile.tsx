import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, Mail, Briefcase, MapPin, Star, Award } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          toast.error('Failed to fetch profile.');
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } else {
        toast.error('You must be logged in to view this page.');
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!profile || !user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        username: profile.username,
        bio: profile.bio,
        location: profile.location,
        role: profile.role,
        experience: profile.experience,
        specialization: profile.specialization,
        skills: profile.skills,
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to update profile.');
      console.error('Error updating profile:', error);
    } else {
      toast.success('Profile updated successfully!');
      setEditMode(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setProfile({ ...profile, skills });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center h-screen">Could not load profile.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-primary to-secondary" />
          <CardHeader className="-mt-20 flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-background bg-muted">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || ''} />
              <AvatarFallback className="text-4xl">{profile.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow pt-20">
              {editMode ? (
                <Input name="full_name" value={profile.full_name || ''} onChange={handleInputChange} className="text-3xl font-bold" />
              ) : (
                <h1 className="text-3xl font-bold text-foreground">{profile.full_name}</h1>
              )}
              {editMode ? (
                <Input name="username" value={profile.username || ''} onChange={handleInputChange} className="text-lg text-muted-foreground" />
              ) : (
                <p className="text-lg text-muted-foreground">@{profile.username}</p>
              )}
            </div>
            <div className="pt-20">
              {editMode ? (
                <Button onClick={handleUpdateProfile}><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
              ) : (
                <Button variant="outline" onClick={() => setEditMode(true)}><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              {editMode ? (
                <Textarea name="bio" value={profile.bio || ''} onChange={handleInputChange} rows={4} />
              ) : (
                <p className="text-muted-foreground">{profile.bio || 'No bio provided.'}</p>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Details</h3>
                <div className="flex items-center gap-4"><Mail className="w-5 h-5 text-muted-foreground" /> <span>{user?.email}</span></div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  {editMode ? <Input name="location" value={profile.location || ''} onChange={handleInputChange} /> : <span>{profile.location || 'Not specified'}</span>}
                </div>
                 <div className="flex items-center gap-4">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  {editMode ? <Input name="role" value={profile.role || ''} onChange={handleInputChange} /> : <span>{profile.role || 'Not specified'}</span>}
                </div>
                <div className="flex items-center gap-4">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  {editMode ? <Input name="experience" value={profile.experience || ''} onChange={handleInputChange} /> : <span>{profile.experience || 'Not specified'}</span>}
                </div>
                <div className="flex items-center gap-4">
                  <Star className="w-5 h-5 text-muted-foreground" />
                  {editMode ? <Input name="specialization" value={profile.specialization || ''} onChange={handleInputChange} /> : <span>{profile.specialization || 'Not specified'}</span>}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Skills</h3>
                {editMode ? (
                  <Input name="skills" value={profile.skills?.join(', ') || ''} onChange={handleSkillsChange} placeholder="e.g. Guitar, Mixing, Songwriting" />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map(skill => <Badge key={skill}>{skill}</Badge>)
                    ) : (
                      <p className="text-sm text-muted-foreground">No skills listed.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
