import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Camera, CheckCircle, File, Trash2, Loader2, Music, Video, Mic, User as UserIcon, Clapperboard, Star, PenSquare, Sparkles } from 'lucide-react';

const professionalRoles = [
  { name: 'Singer', description: 'Vocal artist, playback singer', icon: <Mic /> },
  { name: 'Music Director', description: 'Composer, music producer', icon: <Music /> },
  { name: 'Video Editor', description: 'Video editing, post-production', icon: <Video /> },
  { name: 'Sound Engineer', description: 'Audio mixing, mastering', icon: <Sparkles /> },
  { name: 'Actor/Model', description: 'Acting, modeling, performance', icon: <UserIcon /> },
  { name: 'Producer', description: 'Film producer, executive', icon: <Star /> },
  { name: 'Lyricist', description: 'Songwriter, poet', icon: <PenSquare /> },
  { name: 'Choreographer', description: 'Dance choreography', icon: <Clapperboard /> },
];

const musicGenres = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Folk', 'Country', 'Metal', 'Indie', 'Bollywood'
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    avatarUrl: user?.user_metadata?.avatar_url || '',
    displayName: user?.user_metadata?.full_name || '',
    bio: '',
    location: '',
    genres: [] as string[],
    specialization: [] as string[],
    portfolio: [] as { name: string; url: string }[],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleGenreSelect = (genre: string) => {
    setProfileData(prev => {
      const newGenres = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres: newGenres };
    });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !['png', 'jpg', 'jpeg'].includes(fileExt)) {
      alert('Only PNG, JPG, and JPEG files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('File size cannot exceed 5MB.');
      return;
    }

    const filePath = `${user.id}/${Date.now()}.${fileExt}`;
    setIsUploading(true);
    try {
      const { data, error } = await supabase.storage.from('avatars').upload(filePath, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
      const newAvatarUrl = `${publicUrl}?t=${new Date().getTime()}`;

      setProfileData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
      await supabase.auth.updateUser({ data: { avatar_url: newAvatarUrl } });
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePortfolioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const files = Array.from(event.target.files);
    setIsUploadingPortfolio(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!fileExt || !['mp3', 'wav', 'mp4', 'mov'].includes(fileExt)) {
          console.warn(`Skipping unsupported file type: ${file.name}`);
          return null;
        }
        if (file.size > 100 * 1024 * 1024) { // 100MB
          console.warn(`Skipping file larger than 100MB: ${file.name}`);
          return null;
        }

        const filePath = `${user.id}/portfolio/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('portfolios').upload(filePath, file);
        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from('portfolios').getPublicUrl(data.path);
        return { name: file.name, url: publicUrl };
      });

      const results = await Promise.all(uploadPromises);
      const uploadedFiles = results.filter(Boolean) as { name: string; url: string }[];
      setProfileData(prev => ({ ...prev, portfolio: [...prev.portfolio, ...uploadedFiles] }));
    } catch (error) {
      console.error('Error uploading portfolio files:', error);
    } finally {
      setIsUploadingPortfolio(false);
    }
  };

  const handleRoleSelect = useCallback((role: string) => {
    setProfileData(prev => {
      const specialization = prev.specialization.includes(role)
        ? prev.specialization.filter(r => r !== role)
        : [...prev.specialization, role];
      return { ...prev, specialization };
    });
  }, []);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.displayName,
          avatar_url: profileData.avatarUrl,
          bio: profileData.bio,
          location: profileData.location,
          genres: profileData.genres,
          professional_roles: profileData.specialization,
          portfolio: profileData.portfolio,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 onAvatarUpload={handleAvatarUpload} avatarUrl={profileData.avatarUrl} isUploading={isUploading} />;
      case 2:
        return <Step2 data={profileData} setData={setProfileData} onRoleSelect={handleRoleSelect} onGenreSelect={handleGenreSelect} />;
      case 3: return <Step3 data={profileData} setData={setProfileData} onPortfolioUpload={handlePortfolioUpload} isUploading={isUploadingPortfolio} />;
      case 4: return <Step4 />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Progress value={currentStep * 25} className="mb-4" />
          <CardTitle className="text-center text-3xl font-bold">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[450px]">
          {renderStep()}
        </CardContent>
        <div className="flex justify-between p-6 border-t">
          <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1 || isSubmitting}>Back</Button>
          {currentStep < 4 ? (
            <Button onClick={handleNextStep}>Next</Button>
          ) : (
            <Button onClick={handleFinish} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Finishing...' : 'Finish & Go to Dashboard'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

// Step Components
const Step1 = ({ onAvatarUpload, avatarUrl, isUploading }: any) => (
  <div className="flex flex-col items-center text-center pt-8">
    <h2 className="text-2xl font-semibold mb-4">Upload a Profile Picture</h2>
    <Avatar className="w-32 h-32 mb-4">
      <AvatarImage src={avatarUrl} />
      <AvatarFallback><Camera className="w-12 h-12" /></AvatarFallback>
    </Avatar>
    <Input id="avatar-upload" type="file" accept="image/png, image/jpeg" onChange={onAvatarUpload} className="hidden" />
    <Button asChild>
      <label htmlFor="avatar-upload" className="cursor-pointer">
        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} 
        {isUploading ? 'Uploading...' : 'Choose Photo'}
      </label>
    </Button>
    <p className="text-sm text-muted-foreground mt-2">PNG or JPG, up to 5MB</p>
  </div>
);

const Step2 = ({ data, setData, onRoleSelect, onGenreSelect }: any) => (
  <div>
    <h2 className="text-2xl font-semibold mb-6 text-center">Tell Us About Yourself</h2>
    <div className="space-y-4">
      <div>
        <label htmlFor="displayName" className="font-medium">Display Name</label>
        <Input id="displayName" value={data.displayName} onChange={e => setData({ ...data, displayName: e.target.value })} className="mt-1"/>
      </div>
      <div>
        <label htmlFor="bio" className="font-medium">Bio</label>
        <Textarea id="bio" value={data.bio} onChange={e => setData({ ...data, bio: e.target.value })} placeholder="Tell us about your skills and passion..." className="mt-1"/>
      </div>
      <div>
        <label htmlFor="location" className="font-medium">Location</label>
        <Input id="location" value={data.location} onChange={e => setData({ ...data, location: e.target.value })} placeholder="e.g., Mumbai, India" className="mt-1"/>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">Your Professional Roles</label>
          <span className="text-sm font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full">{data.specialization.length} selected</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Select all that apply to you.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {professionalRoles.map(role => (
            <div
              key={role.name}
              onClick={() => onRoleSelect(role.name)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-4 ${
                data.specialization.includes(role.name)
                  ? 'border-primary bg-primary/10 ring-2 ring-primary'
                  : 'border-border hover:border-primary/50'
              }`}>
              <div className="text-primary">{role.icon}</div>
              <div>
                <h4 className="font-semibold">{role.name}</h4>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">Music Genres</label>
          <span className="text-sm font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full">{data.genres.length} selected</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">What genres do you specialize in?</p>
        <div className="flex flex-wrap gap-2">
          {musicGenres.map(genre => (
            <button
              key={genre}
              type="button"
              onClick={() => onGenreSelect(genre)}
              className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${ 
                data.genres.includes(genre)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent hover:bg-secondary'
              }`}>
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Step3 = ({ data, setData, onPortfolioUpload, isUploading }: any) => (
  <div>
    <h2 className="text-2xl font-semibold mb-6 text-center">Showcase Your Work</h2>
    <div className="p-6 border-2 border-dashed rounded-lg text-center bg-secondary/50">
      <Input id="portfolio-upload" type="file" multiple accept="audio/mpeg, audio/wav, video/mp4, video/quicktime" onChange={onPortfolioUpload} className="hidden" />
      <Button asChild>
        <label htmlFor="portfolio-upload" className="cursor-pointer">
          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} 
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </label>
      </Button>
      <p className="text-sm text-muted-foreground mt-2">MP3, WAV, MP4, MOV - up to 100MB each</p>
    </div>
    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
      {data.portfolio.length === 0 && <p className="text-center text-sm text-muted-foreground">No files uploaded yet.</p>}
      {data.portfolio.map((file: {name: string}, index: number) => (
        <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
          <div className="flex items-center space-x-3 overflow-hidden">
            <File className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm truncate" title={file.name}>{file.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setData((prev: any) => ({ ...prev, portfolio: prev.portfolio.filter((_: any, i: number) => i !== index) }))}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  </div>
);

const Step4 = () => (
  <div className="flex flex-col items-center text-center pt-12">
    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
    <h2 className="text-3xl font-bold mb-2">You're All Set!</h2>
    <p className="text-muted-foreground text-lg">Your profile is complete. Click finish to enter the hub.</p>
  </div>
);

export default ProfileSetup;
