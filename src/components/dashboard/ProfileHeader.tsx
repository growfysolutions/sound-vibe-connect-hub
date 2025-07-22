
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Music } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

export function ProfileHeader({ collapsed }: { collapsed: boolean }) {
  const { profile } = useProfile();

  if (collapsed) {
    return (
      <div className="flex flex-col items-center p-2">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-saffron to-orange-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm transition-all duration-300"></div>
          <Avatar className="relative w-10 h-10 border-2 border-background">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User avatar'} />
            <AvatarFallback className="bg-gradient-to-br from-saffron/20 to-amber-500/20 text-saffron font-bold">
              {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Elaborate Profile Card */}
      <div className="relative group">
        {/* Phulkari-inspired border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-saffron via-orange-500 to-red-500 rounded-xl opacity-75 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
        
        <div className="relative bg-card/95 backdrop-blur-xl rounded-xl p-4 border border-border/50">
          {/* Avatar with glow effect */}
          <div className="flex items-start space-x-3 mb-3">
            <div className="relative group/avatar">
              <div className="absolute -inset-2 bg-gradient-to-r from-saffron to-amber-500 rounded-full opacity-60 group-hover/avatar:opacity-80 blur transition-all duration-300"></div>
              <Avatar className="relative w-16 h-16 border-3 border-background ring-2 ring-saffron/30">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User avatar'} />
                <AvatarFallback className="bg-gradient-to-br from-saffron/20 to-amber-500/20 text-saffron font-bold text-xl">
                  {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {/* Music note animation on hover */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center group-hover/avatar:animate-bounce">
                <Music className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Bilingual name */}
              <div className="space-y-1">
                <h3 className="font-bold text-lg bg-gradient-to-r from-saffron to-amber-600 bg-clip-text text-transparent">
                  {profile?.full_name || 'Saksham Agarwal'}
                </h3>
                <p className="text-sm text-muted-foreground font-medium" style={{ fontFamily: 'serif' }}>
                  ਸਕਸ਼ਮ ਅਗਰਵਾਲ
                </p>
              </div>
              
              {/* Dynamic role badge */}
              <Badge variant="secondary" className="mt-2 bg-gradient-to-r from-saffron/20 to-amber-500/20 text-saffron border-saffron/30 hover:from-saffron/30 hover:to-amber-500/30 transition-all duration-300">
                🎤 {profile?.role || 'Aspiring Artist'}
              </Badge>
            </div>
          </div>
          
          {/* Location with Punjab flag */}
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="w-3 h-3 mr-1 text-saffron" />
            <span>📍 Punjab, India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
