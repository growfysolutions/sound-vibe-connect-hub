
import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, Search, Upload, User as UserIcon, Settings, LogOut, ShoppingBag, Radio, Calendar } from 'lucide-react';
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

  return (
    <nav className="nav-premium sticky top-0 z-50 bg-gradient-to-r from-card/98 to-background/95 backdrop-blur-xl border-b border-saffron/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 group">
              <div className="icon-premium relative">
                <Music className="w-6 h-6 text-saffron transition-all duration-300 group-hover:rotate-12" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-saffron to-amber-500 rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-saffron via-amber-500 to-orange-600 bg-clip-text text-transparent">
                  SoundVibe
                </span>
                <span className="text-xs text-muted-foreground" style={{ fontFamily: 'serif' }}>
                  ਸੰਗੀਤ ਦਾ ਸੰਸਾਰ | Where Music Meets Culture
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-saffron/70 group-hover:text-saffron transition-colors" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-96 input-premium bg-gradient-to-r from-background/50 to-muted/30 border-saffron/30 focus:border-saffron transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              className="btn-premium hidden sm:flex group" 
              onClick={() => navigate('/marketplace')}
            >
              <ShoppingBag className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              <div className="flex flex-col items-start">
                <span>Marketplace</span>
                <span className="text-xs opacity-75" style={{ fontFamily: 'serif' }}>ਬਾਜ਼ਾਰ</span>
              </div>
            </Button>
            
            <Button className="btn-premium group" onClick={handleOpenModal}>
              <Upload className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              <div className="flex flex-col items-start">
                <span>Share Art</span>
                <span className="text-xs opacity-75" style={{ fontFamily: 'serif' }}>ਕਲਾ ਸਾਂਝੀ ਕਰੋ</span>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="hidden lg:flex group border-red-500/50 hover:bg-red-500/10 text-red-600 hover:text-red-500"
            >
              <Radio className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              <div className="flex flex-col items-start">
                <span>Go Live</span>
                <span className="text-xs opacity-75" style={{ fontFamily: 'serif' }}>ਲਾਈਵ ਆਓ</span>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="hidden lg:flex group border-indian-green/50 hover:bg-indian-green/10"
            >
              <Calendar className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              <div className="flex flex-col items-start">
                <span>Events</span>
                <span className="text-xs opacity-75" style={{ fontFamily: 'serif' }}>ਸਮਾਗਮ</span>
              </div>
            </Button>

            <ThemeToggle />
            <NotificationBell />

            {loading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 cursor-pointer border-2 border-saffron hover:border-amber-500 transition-all duration-300 hover:scale-105">
                    {profile?.avatar_url && <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover rounded-full" />}
                    <AvatarFallback className="bg-gradient-to-r from-saffron to-amber-500 text-white font-semibold">
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
      </div>
    </nav>
  );
};

export default DashboardNav;
