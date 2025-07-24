
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <div className="flex items-center space-x-2 group cursor-pointer">
          <Music className="w-6 h-6 text-music-purple transition-opacity duration-200 group-hover:opacity-80" />
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-music-purple">
              SoundVibe
            </span>
          </div>
        </div>
      </div>

      {/* Modern Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search artists, songs, projects..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 pr-4 w-full h-10 bg-gray-50 border-gray-200 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 rounded-lg transition-all duration-200"
        />
      </div>

      {/* Navigation Section */}
      <div className="hidden lg:flex items-center space-x-3">
        <div className="relative">
          <Button 
            variant="outline"
            size="sm"
            className="h-9 px-4 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all duration-200" 
            onClick={() => navigate('/marketplace')}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            <span className="text-sm">Market</span>
          </Button>
          <NotificationBadge count={3} variant="success" />
        </div>
        
        <Button 
          size="sm"
          className="h-9 px-4 bg-music-purple hover:bg-music-purple-dark text-white transition-all duration-200" 
          onClick={handleOpenModal}
        >
          <Upload className="w-4 h-4 mr-2" />
          <span className="text-sm">Share</span>
        </Button>

        <div className="relative">
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 px-4 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 transition-all duration-200"
          >
            <Radio className="w-4 h-4 mr-2" />
            <span className="text-sm">Live</span>
          </Button>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </div>

        <Button 
          variant="outline" 
          size="sm"
          className="h-9 px-4 border-green-200 hover:bg-green-50 hover:border-green-300 text-green-600 transition-all duration-200"
        >
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">Events</span>
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-9 w-9">
              <Menu className="w-5 h-5" />
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

      {/* User Section */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <ThemeToggle />
        <NotificationBell />

        {loading ? (
          <Skeleton className="h-9 w-9 rounded-full" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative cursor-pointer">
                <Avatar className="w-9 h-9 border-2 border-gray-200 hover:border-music-purple transition-all duration-200">
                  {profile?.avatar_url && <img src={profile.avatar_url} alt={profile.full_name || ''} className="w-full h-full object-cover rounded-full" />}
                  <AvatarFallback className="bg-music-purple text-white font-semibold text-sm">
                    {profile?.full_name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-vibrant-green rounded-full border-2 border-white" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white border-gray-200" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900">{profile?.full_name ?? user?.email ?? 'User'}</p>
                  <p className="text-xs leading-none text-gray-500">
                    Level 7 • 75% Complete
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-music-purple h-1.5 rounded-full transition-all duration-300" style={{ width: '75%' }} />
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)} className="hover:bg-gray-50">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Profile</span>
                <span className="ml-auto text-xs text-gray-500">85% Complete</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-gray-50">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50 text-red-600">
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
