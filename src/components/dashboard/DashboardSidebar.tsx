
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Briefcase, 
  Settings, 
  Trophy,
  Calendar,
  TrendingUp,
  Search,
  Mic,
  Radio,
  FileMusic,
  Zap
} from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const { profile } = useProfile();
  const navigate = useNavigate();

  const navigationItems = [
    { 
      id: 'feed', 
      label: 'Feed', 
      icon: Home, 
      punjabi: 'ਫੀਡ',
      color: 'text-ocean-blue',
      badge: '12',
      type: 'tab'
    },
    { 
      id: 'discover', 
      label: 'Discover', 
      icon: Search, 
      punjabi: 'ਖੋਜ',
      color: 'text-teal',
      badge: 'NEW',
      type: 'tab'
    },
    { 
      id: 'network', 
      label: 'Network', 
      icon: Users, 
      punjabi: 'ਨੈੱਟਵਰਕ',
      color: 'text-ocean-blue-light',
      badge: '3',
      type: 'tab'
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MessageCircle, 
      punjabi: 'ਸੁਨੇਹੇ',
      color: 'text-teal-light',
      badge: '8',
      type: 'route',
      route: '/messages'
    },
    { 
      id: 'projects', 
      label: 'My Projects', 
      icon: FileMusic, 
      punjabi: 'ਪ੍ਰੋਜੈਕਟ',
      color: 'text-ocean-blue-dark',
      type: 'tab'
    },
    { 
      id: 'gigs', 
      label: 'Gigs', 
      icon: Briefcase, 
      punjabi: 'ਗਿਗਸ',
      color: 'text-teal-dark',
      badge: '5',
      type: 'route',
      route: '/gig-management'
    }
  ];

  const secondaryItems = [
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: Trophy, 
      punjabi: 'ਪ੍ਰਾਪਤੀਆਂ',
      color: 'text-ocean-blue',
      type: 'tab'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: TrendingUp, 
      punjabi: 'ਵਿਸ਼ਲੇਸ਼ਣ',
      color: 'text-teal',
      type: 'tab'
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: Calendar, 
      punjabi: 'ਕੈਲੰਡਰ',
      color: 'text-ocean-blue-light',
      type: 'tab'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      punjabi: 'ਸੈਟਿੰਗਜ਼',
      color: 'text-muted-foreground',
      type: 'route',
      route: '/settings'
    }
  ];

  const quickActions = [
    { 
      id: 'live', 
      label: 'Go Live', 
      icon: Radio, 
      punjabi: 'ਲਾਈਵ ਜਾਓ',
      color: 'text-ocean-blue'
    },
    { 
      id: 'record', 
      label: 'Record', 
      icon: Mic, 
      punjabi: 'ਰਿਕਾਰਡ',
      color: 'text-teal'
    },
    { 
      id: 'collab', 
      label: 'Collaborate', 
      icon: Users, 
      punjabi: 'ਸਹਿਯੋਗ',
      color: 'text-ocean-blue-light'
    }
  ];

  const handleItemClick = (item: typeof navigationItems[0] | typeof secondaryItems[0]) => {
    if (item.type === 'route' && item.route) {
      navigate(item.route);
    } else {
      setActiveTab(item.id);
    }
  };

  const renderNavItem = (item: typeof navigationItems[0] | typeof secondaryItems[0]) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    
    return (
      <button
        key={item.id}
        className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
          isActive && item.type === 'tab'
            ? 'bg-ocean-blue/10 text-ocean-blue border-r-2 border-ocean-blue'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
        onClick={() => handleItemClick(item)}
      >
        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <div className="flex-1 text-left">
          <div className="font-medium">{item.label}</div>
          <div className="text-xs opacity-70">{item.punjabi}</div>
        </div>
        {item.badge && (
          <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
            item.badge === 'NEW' 
              ? 'bg-teal text-white' 
              : 'bg-ocean-blue text-white'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card text-card-foreground">
      {/* Profile Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-12 h-12 border-2 border-ocean-blue/30">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-ocean-gradient text-white font-semibold">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground font-semibold text-sm truncate">
              {profile?.full_name || 'Music Enthusiast'}
            </h3>
            <p className="text-muted-foreground text-xs truncate">
              {profile?.role || 'Aspiring Artist'}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-teal rounded-full"></div>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
        
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Level {profile?.level || 1}</span>
            <span className="text-xs text-ocean-blue">75% to next</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-ocean-gradient h-2 rounded-full transition-all duration-300"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 overflow-y-auto">
        <div className="mb-8">
          <div className="px-6 mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Main Menu
            </h3>
          </div>
          {navigationItems.map(renderNavItem)}
        </div>

        <div className="mb-8">
          <div className="px-6 mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tools & Analytics
            </h3>
          </div>
          {secondaryItems.map(renderNavItem)}
        </div>

        {/* Quick Actions */}
        <div className="px-6">
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className="flex flex-col items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <div className="bg-ocean-gradient p-4 rounded-lg text-white text-center">
          <div className="text-sm font-semibold mb-1">Upgrade to Pro</div>
          <div className="text-xs opacity-90 mb-3">
            Unlock premium features and expand your musical journey
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center w-full">
            <Zap className="w-4 h-4 mr-1" />
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
