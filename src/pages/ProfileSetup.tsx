
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Upload, Star, MapPin, Phone, Mail, Camera, CheckCircle } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, roles } = location.state || {};
  
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    bio: '',
    experience: '',
    specialization: '',
    hourlyRate: '',
    availability: '',
    equipment: '',
    portfolio: [],
    socialLinks: {
      instagram: '',
      youtube: '',
      spotify: ''
    }
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const experienceLevels = [
    'Beginner (0-2 years)',
    'Intermediate (2-5 years)', 
    'Professional (5-10 years)',
    'Expert (10+ years)'
  ];

  const genres = [
    'Punjabi Folk', 'Modern Punjabi', 'Bhangra', 'Sufi', 'Bollywood',
    'Hip-Hop', 'Classical', 'Devotional', 'Fusion', 'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete setup and navigate to dashboard
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-purple-cosmic relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gold-shimmer rounded-xl flex items-center justify-center">
              <Music className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gradient">SoundConnect</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-white/70">Step {step} of {totalSteps} - Let's showcase your talent</p>
          
          <div className="mt-4 max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              {step === 1 && '🎯 Professional Details'}
              {step === 2 && '💼 Skills & Experience'}
              {step === 3 && '🌟 Portfolio & Links'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                {/* Selected Roles */}
                <div>
                  <label className="text-white font-medium mb-3 block">Your Selected Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {roles?.map((roleId: string) => (
                      <Badge key={roleId} className="bg-cosmic-600 text-white px-3 py-1">
                        {roleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-white font-medium mb-2 block">Professional Bio</label>
                  <Textarea
                    placeholder="Tell us about yourself, your musical journey, and what makes you unique..."
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="glass border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                  />
                </div>

                {/* Location & Contact */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-medium mb-2 block flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </label>
                    <Input
                      placeholder="City, State, Country"
                      defaultValue={user?.location}
                      className="glass border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="text-white font-medium mb-2 block flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Number
                    </label>
                    <Input
                      placeholder="Professional contact"
                      defaultValue={user?.phone}
                      className="glass border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Experience Level */}
                <div>
                  <label className="text-white font-medium mb-2 block">Experience Level</label>
                  <Select onValueChange={(value) => handleInputChange('experience', value)}>
                    <SelectTrigger className="glass border-white/20 text-white">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level} className="text-white focus:bg-cosmic-600">
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specialization */}
                <div>
                  <label className="text-white font-medium mb-2 block">Genre Specialization</label>
                  <Select onValueChange={(value) => handleInputChange('specialization', value)}>
                    <SelectTrigger className="glass border-white/20 text-white">
                      <SelectValue placeholder="Select your primary genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre} className="text-white focus:bg-cosmic-600">
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rates & Availability */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-medium mb-2 block">Hourly Rate (USD)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 50"
                      value={profileData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                      className="glass border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="text-white font-medium mb-2 block">Availability</label>
                    <Select onValueChange={(value) => handleInputChange('availability', value)}>
                      <SelectTrigger className="glass border-white/20 text-white">
                        <SelectValue placeholder="Your availability" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-white/20">
                        <SelectItem value="full-time" className="text-white focus:bg-cosmic-600">Full-time</SelectItem>
                        <SelectItem value="part-time" className="text-white focus:bg-cosmic-600">Part-time</SelectItem>
                        <SelectItem value="project-based" className="text-white focus:bg-cosmic-600">Project-based</SelectItem>
                        <SelectItem value="weekends" className="text-white focus:bg-cosmic-600">Weekends only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <label className="text-white font-medium mb-2 block">Equipment & Tools</label>
                  <Textarea
                    placeholder="List your professional equipment, software, instruments, studio access..."
                    value={profileData.equipment}
                    onChange={(e) => handleInputChange('equipment', e.target.value)}
                    className="glass border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {/* Portfolio Upload */}
                <div>
                  <label className="text-white font-medium mb-2 block">Portfolio Samples</label>
                  <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center glass">
                    <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70 mb-2">Upload your best work samples</p>
                    <p className="text-white/50 text-sm mb-4">MP3, WAV, MP4, MOV (Max 100MB each)</p>
                    <Button className="btn-cosmic">
                      <Camera className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <label className="text-white font-medium mb-3 block">Social Media Links</label>
                  <div className="space-y-3">
                    <div>
                      <Input
                        placeholder="Instagram Profile URL"
                        value={profileData.socialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        className="glass border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="YouTube Channel URL"
                        value={profileData.socialLinks.youtube}
                        onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                        className="glass border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Spotify Artist Profile"
                        value={profileData.socialLinks.spotify}
                        onChange={(e) => handleSocialLinkChange('spotify', e.target.value)}
                        className="glass border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Badge Info */}
                <Card className="glass border-gold-400/30">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Star className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-white font-medium mb-1">Get Verified</h4>
                        <p className="text-white/70 text-sm">
                          Complete your profile and upload portfolio samples to qualify for verification. 
                          Verified profiles get 3x more visibility and collaboration requests.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                className={step === totalSteps ? "btn-gold" : "btn-cosmic"}
              >
                {step === totalSteps ? (
                  <>
                    Complete Setup
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  'Next Step'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
