
import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, Search, Upload, User as UserIcon, Settings, LogOut, ShoppingBag, Radio, Calendar, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import NotificationBell from './NotificationBell';

interface DashboardNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleOpenModal: () => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ searchQuery, setSearchQuery, handleOpenModal }) => {
  const { profile, loading } = useProfile();
  const [user, setUser] = useState<User | null>(null);
  const [searchPlaceholder, setSearchPlaceholder] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const searchPlaceholders = [
    'Search for tabla players in Punjab...',
    'ਗਾਇਕ ਲੱਭੋ... (Find singers)',
    'Discover dhol masters nearby...',
    'Find bhangra choreographers...',
    'Search harmonium teachers...'
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    // Rotate search placeholders
    const interval = setInterval(() => {
      setSearchPlaceholder(searchPlaceholders[Math.floor(Math.random() * searchPlaceholders.length)]);
    }, 3000);

    setSearchPlaceholder(searchPlaceholders[0]);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // TODO: Implement real-time search suggestions
  };

  return (
    <div className="w-full h-full flex items-center justify-between px-6 gap-4">
      {/* Logo Section - Always visible */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <div className="flex items-center space-x-2 group">
          <div className="relative">
            <Music className="w-6 h-6 text-saffron transition-all duration-300 group-hover:rotate-12" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-saffron to-amber-500 rounded-full animate-pulse" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-saffron via-amber-500 to-orange-600 bg-clip-text text-transparent">
              SoundVibe
            </span>
            <span className="text-xs text-muted-foreground leading-none" style={{ fontFamily: 'serif' }}>
              ਸੰਗੀਤ ਦਾ ਸੰਸਾਰ
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar - Responsive */}
      <div className="hidden md:flex flex-1 max-w-md relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-saffron/70 group-hover:text-saffron transition-colors" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 w-full bg-gradient-to-r from-background/50 to-muted/30 border-saffron/30 focus:border-saffron transition-all duration-300"
        />
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden lg:flex items-center space-x-2">
        <Button 
          variant="outline"
          size="sm"
          className="group border-saffron/30 hover:bg-saffron/10" 
          onClick={() => navigate('/marketplace')}
        >
          <ShoppingBag className="w-4 h-4 mr-1 group-hover:animate-bounce" />
          <span className="text-sm">Market</span>
        </Button>
        
        <Button 
          size="sm"
          className="bg-gradient-to-r from-saffron to-amber-500 hover:from-saffron/90 hover:to-amber-500/90 group" 
          onClick={handleOpenModal}
        >
          <Upload className="w-4 h-4 mr-1 group-hover:animate-pulse" />
          <span className="text-sm">Share</span>
        </Button>

        <Button 
          variant="outline" 
          size="sm"
          className="group border-red-500/50 hover:bg-red-500/10 text-red-600 hover:text-red-500"
        >
          <Radio className="w-4 h-4 mr-1 group-hover:animate-pulse" />
          <span className="text-sm">Live</span>
        </Button>

        <Button 
          variant="outline" 
          size="sm"
          className="group border-green-500/50 hover:bg-green-500/10 text-green-600 hover:text-green-500"
        >
          <Calendar className="w-4 h-4 mr-1 group-hover:animate-bounce" />
          <span className="text-sm">Events</span>
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/marketplace')}>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Marketplace
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenModal}>
              <Upload className="w-4 h-4 mr-2" />
              Share Art
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Radio className="w-4 h-4 mr-2" />
              Go Live
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Section - Theme, Notifications, Profile */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <ThemeToggle />
        <NotificationBell />

        {loading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer border-2 border-saffron hover:border-amber-500 transition-all duration-300 hover:scale-105">
                {profile?.avatar_url && <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover rounded-full" />}
                <AvatarFallback className="bg-gradient-to-r from-saffron to-amber-500 text-white font-semibold text-sm">
                  {profile?.full_name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border-saffron/20" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.full_name ?? user?.email ?? 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Welcome! ਜੀ ਆਇਆਂ ਨੂੰ
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-saffron/20" />
              <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)} className="hover:bg-saffron/10">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-saffron/10">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-saffron/20" />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-500/10 text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default DashboardNav;
