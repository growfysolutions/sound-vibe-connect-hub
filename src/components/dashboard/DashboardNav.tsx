import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, Search, Upload, User as UserIcon, Settings, LogOut, ShoppingBag } from 'lucide-react';
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

  return (
    <nav className="nav-premium sticky top-0 z-50 border-b border-border/20 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Brand and Search Section */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 hover-scale">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center transition-all duration-300 hover:from-primary/30 hover:to-primary/20">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">SoundVibe Connect</span>
            </div>
            
            <div className="hidden lg:flex relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <Input
                type="text"
                placeholder="Search professionals, projects, or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 w-96 h-11 input-premium text-sm font-medium placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="btn-glass hidden sm:flex h-10 px-4 font-semibold hover:bg-primary/10 hover:border-primary/20" 
              onClick={() => navigate('/marketplace')}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Marketplace
            </Button>
            
            <Button 
              className="btn-premium h-10 px-6 font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" 
              onClick={handleOpenModal}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <NotificationBell />
            </div>

            {/* Profile Dropdown */}
            {loading ? (
              <Skeleton className="h-11 w-11 rounded-2xl" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-11 h-11 cursor-pointer border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 rounded-2xl shadow-lg hover:shadow-xl">
                    {profile?.avatar_url && (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || ''} 
                        className="w-full h-full object-cover rounded-2xl" 
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm rounded-2xl">
                      {profile?.full_name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-2 shadow-2xl" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold leading-none">{profile?.full_name ?? user?.email ?? 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile?.role || 'Music Professional'}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>Level {profile?.level || 1}</span>
                        <span>•</span>
                        <span>2 Projects</span>
                        <span>•</span>
                        <span>12 Connections</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem 
                    className="rounded-xl p-3 hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate(`/profile/${user?.id}`)}
                  >
                    <UserIcon className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-medium">View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="rounded-xl p-3 hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-medium">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem 
                    className="rounded-xl p-3 hover:bg-destructive/10 text-destructive transition-colors duration-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Logout</span>
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
