
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
import { NotificationBadge } from './RealTimeIndicators';

interface DashboardNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleOpenModal: () => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ searchQuery, setSearchQuery, handleOpenModal }) => {
  const { profile, loading } = useProfile();
  const [user, setUser] = useState<User | null>(null);
  const [searchPlaceholder, setSearchPlaceholder] = useState('');
  const navigate = useNavigate();

  const searchPlaceholders = [
    'Search artists, songs, or projects...',
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
    <div className="w-full h-full flex items-center justify-between px-6 gap-4 bg-gradient-to-r from-background/95 to-muted/50 backdrop-blur-xl border-b border-saffron/20">
      {/* Logo Section with Cultural Elements */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <div className="flex items-center space-x-2 group">
          <div className="relative">
            <Music className="w-7 h-7 text-saffron transition-all duration-300 group-hover:rotate-12" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-saffron to-amber-500 rounded-full animate-pulse" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-saffron via-amber-500 to-orange-600 bg-clip-text text-transparent">
              SoundVibe
            </span>
            <span className="text-xs text-muted-foreground leading-none" style={{ fontFamily: 'serif' }}>
              ਸੰਗੀਤ ਦਾ ਸੰਸਾਰ
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="hidden md:flex flex-1 max-w-lg relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-saffron/70 group-hover:text-saffron transition-colors" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={handleSearch}
          className="pl-12 pr-4 w-full h-12 bg-gradient-to-r from-background/80 to-muted/50 border-saffron/30 focus:border-saffron transition-all duration-300 rounded-xl"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
          Press '/' to search
        </div>
      </div>

      {/* Desktop Action Buttons with Real-time Indicators */}
      <div className="hidden lg:flex items-center space-x-2">
        <div className="relative">
          <Button 
            variant="outline"
            size="sm"
            className="group border-saffron/30 hover:bg-saffron/10" 
            onClick={() => navigate('/marketplace')}
          >
            <ShoppingBag className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            <span className="text-sm">Market</span>
          </Button>
          <NotificationBadge count={3} variant="success" />
        </div>
        
        <Button 
          size="sm"
          className="bg-gradient-to-r from-saffron to-amber-500 hover:from-saffron/90 hover:to-amber-500/90 group" 
          onClick={handleOpenModal}
        >
          <Upload className="w-4 h-4 mr-2 group-hover:animate-pulse" />
          <span className="text-sm">Share</span>
        </Button>

        <div className="relative">
          <Button 
            variant="outline" 
            size="sm"
            className="group border-red-500/50 hover:bg-red-500/10 text-red-600 hover:text-red-500"
          >
            <Radio className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            <span className="text-sm">Live</span>
          </Button>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </div>

        <Button 
          variant="outline" 
          size="sm"
          className="group border-green-500/50 hover:bg-green-500/10 text-green-600 hover:text-green-500"
        >
          <Calendar className="w-4 h-4 mr-2 group-hover:animate-bounce" />
          <span className="text-sm">Events</span>
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Menu className="w-4 h-4" />
              <NotificationBadge count={5} variant="cultural" />
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

      {/* Enhanced User Profile Section */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <ThemeToggle />
        <NotificationBell />

        {loading ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative cursor-pointer">
                <Avatar className="w-10 h-10 border-2 border-saffron hover:border-amber-500 transition-all duration-300 hover:scale-105">
                  {profile?.avatar_url && <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover rounded-full" />}
                  <AvatarFallback className="bg-gradient-to-r from-saffron to-amber-500 text-white font-semibold">
                    {profile?.full_name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-card/95 backdrop-blur-xl border-saffron/20" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.full_name ?? user?.email ?? 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Level 7 • 75% Complete
                  </p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div className="bg-gradient-to-r from-saffron to-amber-500 h-1.5 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-saffron/20" />
              <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)} className="hover:bg-saffron/10">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Profile</span>
                <span className="ml-auto text-xs text-muted-foreground">85% Complete</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-saffron/10">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-saffron/20" />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-500/10 text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default DashboardNav;
