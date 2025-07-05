
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Music, Mic, Video, Camera, Headphones, Star, Users, ArrowLeft, CheckCircle } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    location: ''
  });

  const initialMode = searchParams.get('mode') || 'signin';
  const suggestedRole = searchParams.get('role');

  const roles = [
    { id: 'singer', name: 'Singer', icon: Mic, color: 'from-pink-500 to-rose-500', description: 'Vocal artist, playback singer' },
    { id: 'music-director', name: 'Music Director', icon: Music, color: 'from-purple-500 to-indigo-500', description: 'Composer, music producer' },
    { id: 'video-editor', name: 'Video Editor', icon: Video, color: 'from-blue-500 to-cyan-500', description: 'Video editing, post-production' },
    { id: 'sound-engineer', name: 'Sound Engineer', icon: Headphones, color: 'from-green-500 to-emerald-500', description: 'Audio mixing, mastering' },
    { id: 'actor-model', name: 'Actor/Model', icon: Camera, color: 'from-orange-500 to-red-500', description: 'Acting, modeling, performance' },
    { id: 'producer', name: 'Producer', icon: Star, color: 'from-yellow-500 to-orange-500', description: 'Film producer, executive' },
    { id: 'lyricist', name: 'Lyricist', icon: Users, color: 'from-teal-500 to-green-500', description: 'Songwriter, poet' },
    { id: 'choreographer', name: 'Choreographer', icon: Users, color: 'from-indigo-500 to-purple-500', description: 'Dance choreography' }
  ];

  useEffect(() => {
    if (suggestedRole) {
      const role = roles.find(r => r.id === suggestedRole);
      if (role && !selectedRoles.includes(role.id)) {
        setSelectedRoles([role.id]);
      }
    }
  }, [suggestedRole]);

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication logic would go here
    console.log('Form submitted:', { ...formData, roles: selectedRoles });
    
    // For demo, navigate to profile setup
    navigate('/profile-setup', { 
      state: { 
        user: formData, 
        roles: selectedRoles 
      } 
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
          <Button 
            variant="ghost" 
            className="text-white/70 hover:text-white mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gold-shimmer rounded-xl flex items-center justify-center">
              <Music className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gradient">SoundConnect</span>
          </div>
          <p className="text-white/70 text-lg">Join the music community</p>
        </div>

        <Card className="glass-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">
              {initialMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={initialMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass">
                <TabsTrigger value="signin" className="data-[state=active]:bg-cosmic-600">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-cosmic-600">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6 mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="glass border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="glass border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full btn-cosmic">
                    Sign In to SoundConnect
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6 mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold text-lg">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="glass border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="glass border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="glass border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                      <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="glass border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="glass border-white/20 text-white placeholder:text-white/50"
                      />
                      <Input
                        type="text"
                        name="location"
                        placeholder="Location (City, State)"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="glass border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-lg">Your Professional Roles</h3>
                      <Badge variant="secondary" className="bg-cosmic-600/50 text-white">
                        {selectedRoles.length} selected
                      </Badge>
                    </div>
                    <p className="text-white/70 text-sm">Select all that apply to you</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                      {roles.map((role) => (
                        <div
                          key={role.id}
                          onClick={() => handleRoleToggle(role.id)}
                          className={`
                            relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300
                            ${selectedRoles.includes(role.id)
                              ? 'border-gold-400 bg-gold-400/10 scale-105' 
                              : 'border-white/20 hover:border-white/40 glass'
                            }
                          `}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0`}>
                              <role.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-sm">{role.name}</h4>
                              <p className="text-white/60 text-xs mt-1">{role.description}</p>
                            </div>
                          </div>
                          {selectedRoles.includes(role.id) && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-5 h-5 text-gold-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-cosmic"
                    disabled={selectedRoles.length === 0}
                  >
                    Create Account & Continue
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Social Login Alternative */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-center text-white/60 text-sm mb-4">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
