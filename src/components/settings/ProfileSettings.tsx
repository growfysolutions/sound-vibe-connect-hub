
import React, { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Upload, User, MapPin, Music, Briefcase, X } from 'lucide-react';

const ProfileSettings = () => {
  const { profile, updateProfile } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    genres: profile?.genres || [],
    professional_roles: profile?.professional_roles || [],
  });

  const musicGenres = [
    'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Folk', 'Country', 'Metal', 'Indie', 'Bollywood'
  ];

  const professionalRoles = [
    'Singer', 'Music Director', 'Video Editor', 'Sound Engineer', 'Actor/Model', 'Producer', 'Lyricist', 'Choreographer'
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setProfileData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleRoleToggle = (role: string) => {
    setProfileData(prev => ({
      ...prev,
      professional_roles: prev.professional_roles.includes(role)
        ? prev.professional_roles.filter(r => r !== role)
        : [...prev.professional_roles, role]
    }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExt || !['png', 'jpg', 'jpeg'].includes(fileExt)) {
      toast.error('Only PNG, JPG, and JPEG files are allowed.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size cannot exceed 5MB.');
      return;
    }

    const filePath = `${profile?.id}/${Date.now()}.${fileExt}`;
    
    try {
      const { data, error } = await supabase.storage.from('avatars').upload(filePath, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
      
      await updateProfile({ avatar_url: publicUrl });
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture.');
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile?.id) return;

    setIsUpdating(true);
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Picture
          </CardTitle>
          <CardDescription>
            Upload a profile picture to personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-lg">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <Button asChild variant="outline">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Change Picture
                </label>
              </Button>
              <p className="text-sm text-muted-foreground mt-1">
                PNG or JPG, up to 5MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Update your basic profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profileData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself and your musical journey..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </Label>
            <Input
              id="location"
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Mumbai, India"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Professional Roles
          </CardTitle>
          <CardDescription>
            Select your professional roles in the music industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {professionalRoles.map(role => (
              <Badge
                key={role}
                variant={profileData.professional_roles.includes(role) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleRoleToggle(role)}
              >
                {role}
                {profileData.professional_roles.includes(role) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Music Genres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Music Genres
          </CardTitle>
          <CardDescription>
            Select the music genres you specialize in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {musicGenres.map(genre => (
              <Badge
                key={genre}
                variant={profileData.genres.includes(genre) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleGenreToggle(genre)}
              >
                {genre}
                {profileData.genres.includes(genre) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={handleUpdateProfile} disabled={isUpdating} className="w-full">
            {isUpdating ? 'Updating...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
