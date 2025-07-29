
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Briefcase, 
  Settings, 
  FileMusic,
  GitBranch
} from 'lucide-react';
import { ProjectSelectionModal } from '@/components/modals/ProjectSelectionModal';

interface DashboardNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardNavigation({ activeTab, setActiveTab }: DashboardNavigationProps) {
  const navigate = useNavigate();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const navigationItems = [
    { id: 'feed', label: 'Feed', icon: Home, type: 'tab' },
    { id: 'discover', label: 'Discover', icon: Users, type: 'tab' },
    { id: 'network', label: 'Network', icon: Users, type: 'tab' },
    { id: 'projects', label: 'Projects', icon: FileMusic, type: 'tab' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, type: 'tab' },
    { id: 'gigs', label: 'Gigs', icon: Briefcase, type: 'route', route: '/gig-management' },
    { id: 'collaboration', label: 'Collaborate', icon: GitBranch, type: 'modal' },
    { id: 'settings', label: 'Settings', icon: Settings, type: 'route', route: '/unified-settings' },
  ];

  const handleItemClick = (item: typeof navigationItems[0]) => {
    if (item.type === 'route' && item.route) {
      navigate(item.route);
    } else if (item.type === 'modal' && item.id === 'collaboration') {
      setIsProjectModalOpen(true);
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handleItemClick(item)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </div>

      <ProjectSelectionModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </>
  );
}
