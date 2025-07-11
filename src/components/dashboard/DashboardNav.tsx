import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Music, Search, Upload, User as UserIcon, Settings, LogOut } from 'lucide-react';
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
import { Profile } from './UserProfileCard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface ConnectionRequest {
  id: number;
  requester: Profile;
}

interface DashboardNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleOpenModal: () => void;
  onConnectionUpdate: () => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ searchQuery, setSearchQuery, handleOpenModal, onConnectionUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchConnectionRequests = async (userId: string) => {
    const { data, error } = await supabase
      .from('connections')
      .select('id, requester:requester_id(*)')
      .eq('addressee_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching connection requests:', error);
    } else {
      setConnectionRequests(data as any);
    }
  };

  const fetchUser = async () => {
            const { data, error: _error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchConnectionRequests(data.user.id);
      }
    };
    fetchUser();
  }, []);

  

  const handleConnectionAction = async (connectionId: number, newStatus: 'accepted' | 'declined') => {
    const { error } = await supabase
      .from('connections')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', connectionId);

    if (error) {
      console.error(`Error ${newStatus === 'accepted' ? 'accepting' : 'declining'} connection:`, error);
    } else {
      setConnectionRequests(connectionRequests.filter(req => req.id !== connectionId));
      if (newStatus === 'accepted') {
        onConnectionUpdate();
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="nav-premium sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="icon-premium">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">SoundConnect</span>
            </div>
            
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search professionals, projects, or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 input-premium"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button className="btn-premium" onClick={handleOpenModal}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>

            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="w-5 h-5" />
                  {connectionRequests.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-destructive"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {connectionRequests.length > 0 ? (
                  connectionRequests.map((req) => (
                    <DropdownMenuItem key={req.id} onSelect={(e) => e.preventDefault()} className="flex flex-col items-start p-2">
                      <p className="text-sm whitespace-normal">
                        Connection request from <span className="font-semibold">{req.requester.full_name || req.requester.username}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" onClick={() => handleConnectionAction(req.id, 'accepted')}>Accept</Button>
                        <Button size="sm" variant="outline" onClick={() => handleConnectionAction(req.id, 'declined')}>Decline</Button>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem className="text-center text-muted-foreground p-4">No new notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-10 h-10 cursor-pointer border-2 border-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {user?.email?.charAt(0).toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email ?? 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Welcome!
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
