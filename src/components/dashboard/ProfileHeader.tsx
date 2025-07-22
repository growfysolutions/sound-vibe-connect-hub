
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Mic, Music } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

export function ProfileHeader({ collapsed }: { collapsed: boolean }) {
  const { profile } = useProfile();

  if (collapsed) {
    return (
      <div className="flex flex-col items-center p-3">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
          <Avatar className="relative w-12 h-12 border-2 border-slate-600">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User avatar'} />
            <AvatarFallback className="bg-slate-700 text-blue-400 font-bold text-lg">
              {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'S'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
            <Music className="w-2 h-2 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Profile Card */}
      <div className="relative">
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50">
          {/* Avatar and Info */}
          <div className="flex items-start space-x-4">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 blur transition-all duration-300"></div>
              <Avatar className="relative w-16 h-16 border-2 border-slate-600 ring-2 ring-blue-500/20">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User avatar'} />
                <AvatarFallback className="bg-slate-700 text-blue-400 font-bold text-xl">
                  {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <Music className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0 space-y-2">
              {/* Names */}
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-white truncate">
                  {profile?.full_name || 'Saksham Agarwal'}
                </h3>
                <p className="font-normal text-sm text-slate-300" style={{ fontFamily: 'serif' }}>
                  ਸਕਸ਼ਮ ਅਗਰਵਾਲ
                </p>
              </div>
              
              {/* Role Badge */}
              <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-700 transition-all duration-300 text-xs">
                <Mic className="w-3 h-3 mr-1" />
                {profile?.role || 'Aspiring Artist'}
              </Badge>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center mt-3 text-sm text-slate-400">
            <MapPin className="w-3 h-3 mr-1" />
            <span>📍 Punjab, India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
