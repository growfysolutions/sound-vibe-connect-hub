import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';

export function ProfileCompletionCard() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!profile) return 0;
    let completed = 0;
    let total = 4;

    if (profile.role && profile.role !== 'Aspiring Artist') completed++;
    if (profile.location && profile.location !== 'Not specified') completed++;
    if (profile.bio) completed++;
    if (profile.skills && profile.skills.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();
  const shouldShow = completionPercentage < 75 && !isDismissed;

  useEffect(() => {
    // Check if user has dismissed this card recently
    const dismissedUntil = localStorage.getItem('profileCompletionDismissed');
    const sessionCount = parseInt(localStorage.getItem('sessionCount') || '0') + 1;
    localStorage.setItem('sessionCount', sessionCount.toString());

    if (dismissedUntil) {
      const dismissTime = new Date(dismissedUntil);
      const now = new Date();
      
      // Reappear after 3 sessions
      if (sessionCount >= 3) {
        localStorage.removeItem('profileCompletionDismissed');
        localStorage.setItem('sessionCount', '0');
      } else if (now < dismissTime) {
        setIsDismissed(true);
        return;
      }
    }

    if (shouldShow) {
      setTimeout(() => setIsVisible(true), 300);
    }
  }, [shouldShow]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsDismissed(true);
      // Set dismissal for a period
      const dismissUntil = new Date();
      dismissUntil.setHours(dismissUntil.getHours() + 24);
      localStorage.setItem('profileCompletionDismissed', dismissUntil.toISOString());
    }, 300);
  };

  const handleCompleteProfile = () => {
    navigate('/profile-setup');
  };

  if (!shouldShow || isDismissed) return null;

  return (
    <Card 
      className={`relative overflow-hidden bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border-2 border-transparent bg-clip-padding transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
      style={{
        backgroundImage: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
        backgroundClip: 'border-box',
        border: '2px solid transparent',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 animate-pulse" />
      <div className="absolute inset-[2px] bg-card rounded-[calc(var(--radius)-2px)]" />
      
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <h3 className="text-lg font-semibold text-card-foreground">
                Complete your profile to unlock collaborations
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              A complete profile increases your chances of being discovered by 85%
            </p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profile Progress</span>
                <span className="font-medium text-primary">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-1 ${profile?.role && profile.role !== 'Aspiring Artist' ? 'text-green-500' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${profile?.role && profile.role !== 'Aspiring Artist' ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
                  Professional Role
                </div>
                <div className={`flex items-center gap-1 ${profile?.location && profile.location !== 'Not specified' ? 'text-green-500' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${profile?.location && profile.location !== 'Not specified' ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
                  Location
                </div>
                <div className={`flex items-center gap-1 ${profile?.bio ? 'text-green-500' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${profile?.bio ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
                  Bio
                </div>
                <div className={`flex items-center gap-1 ${profile?.skills && profile.skills.length > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${profile?.skills && profile.skills.length > 0 ? 'bg-green-500' : 'bg-muted-foreground/50'}`} />
                  Skills
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleCompleteProfile}
              className="bg-primary hover:bg-primary/90 text-primary-foreground group transition-all duration-200"
            >
              Complete Profile
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}