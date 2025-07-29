
import { 
  Home, 
  Search, 
  Users, 
  FolderOpen, 
  MessageSquare,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className="flex-1 flex-col h-16 rounded-none"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
