
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Search, 
  Users, 
  FolderOpen, 
  Trophy, 
  BarChart3, 
  Calendar, 
  MessageSquare,
  Settings, 
  LogOut, 
  Plus,
  Briefcase,
  GitBranch
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { ProjectSelectionModal } from '@/components/modals/ProjectSelectionModal';

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navigationItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const externalItems = [
    { id: 'gigs', label: 'Gigs', icon: Briefcase, route: '/gig-management' },
    { id: 'collaboration', label: 'Collaborate', icon: GitBranch, modal: true },
    { id: 'settings', label: 'Settings', icon: Settings, route: '/unified-settings' },
  ];

  const handleItemClick = (item: typeof navigationItems[0]) => {
    if ('route' in item && item.route) {
      navigate(item.route);
    } else if ('modal' in item && item.modal) {
      if (item.id === 'collaboration') {
        setIsProjectModalOpen(true);
      }
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col bg-card">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {profile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.role || 'Artist'}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              L{profile?.level || 1}
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleItemClick(item)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}

          <Separator className="my-4" />

          {/* External Items */}
          {externalItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleItemClick(item)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <ProjectSelectionModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </>
  );
}
