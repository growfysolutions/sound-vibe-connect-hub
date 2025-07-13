import { useState, useEffect, useCallback } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useParams } from 'react-router-dom';
import ReviewCard from '@/components/profile/ReviewCard';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { ReviewWithReviewer } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, Briefcase, MapPin, Star, Award, Link, Twitter, Instagram, Github, Linkedin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database } from '@/integrations/supabase/types';
import Testimonials from '@/components/profile/Testimonials';
import PortfolioManager from '@/components/profile/PortfolioManager';
import Reviews from '@/components/profile/Reviews';

// Correctly infer types from the Database definition
type ProfileType = Database['public']['Tables']['profiles']['Row'];

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { profile: globalProfile, setProfileDirectly } = useProfile();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewWithReviewer[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const isOwner = currentUser?.id === profile?.id;

  const fetchProfileData = useCallback(async (profileId: string) => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) {
      toast.error('Failed to fetch profile.');
      console.error('Error fetching profile:', error);
      return null;
    }
    return profileData;
  }, []);

  const fetchReviews = useCallback(async (profileId: string) => {
    const { data, error } = await supabase.from('reviews')
      .select('*, reviewer:reviewer_id(id, full_name, avatar_url)')
      .eq('reviewee_id', profileId);

    if (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Could not fetch reviews.');
      return [];
    }
    return data as unknown as ReviewWithReviewer[];
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (!id) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const profileData = await fetchProfileData(id);
      setProfile(profileData);

      if (profileData) {
        const reviewsData = await fetchReviews(id);
        setReviews(reviewsData);
      }

      setLoading(false);
    };

    loadData();
  }, [id, fetchProfileData, fetchReviews]);

  useEffect(() => {
    // Sync local state with global profile context
    if (globalProfile && globalProfile.id === id) {
      setProfile(globalProfile as ProfileType);
    }
  }, [globalProfile, id]);

  const handleUpdateProfile = async () => {
    if (!profile || !currentUser) return;
    setUploading(true);

    try {
      let avatarUrlToSave = profile.avatar_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${currentUser.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrlToSave = publicUrlData.publicUrl;
      }

      const updatePayload: Partial<ProfileType> = {
        full_name: profile.full_name,
        username: profile.username,
        website: profile.website,
        bio: profile.bio,
        location: profile.location,
        skills: profile.skills,
        professional_roles: profile.professional_roles,
        avatar_url: avatarUrlToSave,
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      const updatedProfile = {
        ...profile,
        ...updatePayload,
        avatar_url: `${avatarUrlToSave}?t=${new Date().getTime()}`,
      } as ProfileType;

      // Update the global context for an app-wide change
      setProfileDirectly(updatedProfile);
      
      // Also update the local state for an immediate re-render on this page
      setProfile(updatedProfile);

      toast('Profile updated successfully!');
      setEditMode(false);
      setAvatarFile(null);

    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setUploading(false);
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      // Create a temporary URL to preview the new avatar
      const reader = new FileReader();
      reader.onloadend = () => {
        if (profile) {
          setProfile({ ...profile, avatar_url: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">Profile not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              {editMode && isOwner ? (
                <label htmlFor="avatar-upload" className="cursor-pointer relative group">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
                    <AvatarFallback className="text-4xl">{profile.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="w-8 h-8 text-white" />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
                  <AvatarFallback className="text-4xl">{profile.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}

              <div className="text-center space-y-2">
                {editMode && isOwner ? (
                  <>
                    <Input
                      name="full_name"
                      value={profile.full_name || ''}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="text-2xl font-bold text-center h-auto p-2"
                    />
                    <Input
                      name="username"
                      value={profile.username || ''}
                      onChange={handleInputChange}
                      placeholder="Username"
                      className="text-lg text-muted-foreground text-center h-auto p-1"
                    />
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                    <p className="text-lg text-muted-foreground">@{profile.username}</p>
                  </>
                )}
              </div>

              {isOwner && (
                <Button onClick={editMode ? handleUpdateProfile : () => setEditMode(true)} variant={editMode ? 'default' : 'outline'} disabled={uploading}>
                  {uploading ? 'Saving...' : (editMode ? <><Save className="w-4 h-4 mr-2" /> Save Profile</> : <><Edit className="w-4 h-4 mr-2" /> Edit Profile</>)}
                </Button>
              )}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* About Card */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-lg">About</h3>
                </CardHeader>
                <CardContent>
                  {editMode && isOwner ? (
                    <Textarea name="bio" value={profile.bio || ''} onChange={handleInputChange} placeholder="Your bio" className="min-h-[100px]" />
                  ) : (
                    <p className="text-muted-foreground">{profile.bio || 'No bio provided.'}</p>
                  )}
                </CardContent>
              </Card>

              {/* Details Card */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-lg">Details</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    {editMode && isOwner ? <Input name="role" value={profile.role || ''} onChange={handleInputChange} placeholder="Role" /> : <span>{profile.role || 'N/A'}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {editMode && isOwner ? <Input name="location" value={profile.location || ''} onChange={handleInputChange} placeholder="Location" /> : <span>{profile.location || 'N/A'}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    {editMode && isOwner ? <Input name="experience" value={profile.experience || ''} onChange={handleInputChange} placeholder="Experience" /> : <span>{profile.experience || 'N/A'}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    {editMode && isOwner ? <Input name="specialization" value={profile.specialization || ''} onChange={handleInputChange} placeholder="Specialization" /> : <span>{profile.specialization || 'N/A'}</span>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Links Card */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Links</h3>
              </CardHeader>
              <CardContent>
                {editMode && isOwner ? (
                  <div className="space-y-2">
                    <Input name="portfolio_url" value={profile.portfolio_url || ''} onChange={handleInputChange} placeholder="Portfolio URL" />
                    <Input name="twitter_url" value={profile.twitter_url || ''} onChange={handleInputChange} placeholder="Twitter URL" />
                    <Input name="instagram_url" value={profile.instagram_url || ''} onChange={handleInputChange} placeholder="Instagram URL" />
                    <Input name="github_url" value={profile.github_url || ''} onChange={handleInputChange} placeholder="GitHub URL" />
                    <Input name="linkedin_url" value={profile.linkedin_url || ''} onChange={handleInputChange} placeholder="LinkedIn URL" />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"><Link className="w-6 h-6 text-muted-foreground hover:text-primary" /></a>}
                    {profile.twitter_url && <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"><Twitter className="w-6 h-6 text-muted-foreground hover:text-primary" /></a>}
                    {profile.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer"><Instagram className="w-6 h-6 text-muted-foreground hover:text-primary" /></a>}
                    {profile.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer"><Github className="w-6 h-6 text-muted-foreground hover:text-primary" /></a>}
                    {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"><Linkedin className="w-6 h-6 text-muted-foreground hover:text-primary" /></a>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Skills</h3>
              </CardHeader>
              <CardContent>
                {editMode && isOwner ? (
                  <Input name="skills" value={profile.skills?.join(', ') || ''} onChange={handleSkillsChange} placeholder="e.g. Guitar, Mixing, Songwriting" />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill: string) => <Badge key={skill}>{skill}</Badge>)
                    ) : (
                      <p className="text-sm text-muted-foreground">No skills listed.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>

          <Separator />

          <Tabs defaultValue="portfolio" className="w-full p-4 md:p-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="portfolio">
              {/* Portfolio Media Section */}
              <div className="mt-4">
                {id && <PortfolioManager profileId={id} />}
              </div>
            </TabsContent>
            <TabsContent value="testimonials">
              {/* Testimonials Section - Now using the dedicated component */}
              <div className="mt-4">
                {id ? <Testimonials profileId={id} /> : <p>Could not load testimonials.</p>}
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              {/* Reviews Section */}
              <div className="mt-4">
                {id ? <Reviews profileId={id} /> : <p>Could not load reviews.</p>}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {reviews.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
