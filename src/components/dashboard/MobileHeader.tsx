
import { useState } from 'react';
import { Search, Bell, Menu, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/contexts/ProfileContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuToggle: () => void;
}

export function MobileHeader({ searchQuery, setSearchQuery, onMenuToggle }: MobileHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { profile } = useProfile();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  if (isSearchExpanded) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-card/98 to-background/95 backdrop-blur-xl border-b border-saffron/20 safe-area-pt">
        <div className="flex items-center px-4 py-3 space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchExpanded(false)}
            className="p-2"
          >
            ←
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-saffron/70" />
            <Input
              type="text"
              placeholder="ਸੰਗੀਤਕਾਰ ਲੱਭੋ... Search musicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gradient-to-r from-background/50 to-muted/30 border-saffron/30 focus:border-saffron"
              autoFocus
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-card/98 to-background/95 backdrop-blur-xl border-b border-saffron/20 safe-area-pt">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8 border-2 border-saffron/30">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-to-r from-saffron to-amber-500 text-white text-sm font-semibold">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold bg-gradient-to-r from-saffron via-amber-500 to-orange-600 bg-clip-text text-transparent">
              SoundVibe
            </span>
            <span className="text-xs text-muted-foreground" style={{ fontFamily: 'serif' }}>
              ਸੰਗੀਤ ਦਾ ਸੰਸਾਰ
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchExpanded(true)}
            className="p-2 hover:bg-saffron/10"
          >
            <Search className="w-5 h-5 text-saffron" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-saffron/10 relative"
          >
            <Bell className="w-5 h-5 text-saffron" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </div>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="p-2 hover:bg-saffron/10"
          >
            <Menu className="w-5 h-5 text-saffron" />
          </Button>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="px-4 pb-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-left border-saffron/30 hover:bg-saffron/10"
        >
          <MapPin className="w-4 h-4 mr-2 text-saffron" />
          <div className="flex flex-col items-start">
            <span className="text-sm">Find Musicians Near Me</span>
            <span className="text-xs opacity-60" style={{ fontFamily: 'serif' }}>
              ਨੇੜੇ ਸੰਗੀਤਕਾਰ ਲੱਭੋ
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
}
