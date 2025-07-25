
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Briefcase, 
  TrendingUp,
  Search,
  FileMusic,
  Zap,
  BarChart3,
  Lightbulb,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { NotificationBadge, OnlineStatus, MessageIndicator } from './RealTimeIndicators';
import { cn } from '@/lib/utils';

interface EnhancedSidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  description?: string;
  color: string;
  route?: string;
  subItems?: NavigationItem[];
}

export function EnhancedSidebarNav({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  onToggleCollapse 
}: EnhancedSidebarNavProps) {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    { 
      id: 'feed', 
      label: 'Feed', 
      icon: Home, 
      color: 'text-orange-500',
      description: 'Community updates and new releases',
      badge: 12,
      route: '/dashboard/feed'
    },
    { 
      id: 'discover', 
      label: 'Discover', 
      icon: Search, 
      color: 'text-blue-500',
      description: 'AI-recommended artists and opportunities',
      badge: 'NEW',
      route: '/dashboard/discover'
    },
    { 
      id: 'projects', 
      label: 'My Projects', 
      icon: FileMusic, 
      color: 'text-pink-500',
      description: '3 active, 12 completed',
      badge: 3,
      route: '/dashboard/projects'
    },
    { 
      id: 'network', 
      label: 'Network', 
      icon: Users, 
      color: 'text-green-500',
      description: '47 connections, 12 pending requests',
      badge: 12,
      route: '/dashboard/network'
    },
    { 
      id: 'marketplace', 
      label: 'Marketplace', 
      icon: Briefcase, 
      color: 'text-purple-500',
      description: 'Advanced gig management with escrow',
      badge: 'NEW',
      route: '/marketplace'
    },
    { 
      id: 'platform_expansion', 
      label: 'Platform Hub', 
      icon: Zap, 
      color: 'text-yellow-500',
      description: 'Next-gen features and integrations',
      badge: 'BETA',
      route: '/platform-expansion'
    },
    { 
      id: 'progress', 
      label: 'Progress', 
      icon: TrendingUp, 
      color: 'text-purple-500',
      description: 'XP: 2,847 • Level 7: "Recognized Artist"',
      route: '/dashboard/progress'
    },
    { 
      id: 'contracts', 
      label: 'Contracts', 
      icon: Briefcase, 
      color: 'text-yellow-500',
      description: '2 pending approval, 5 active agreements',
      badge: 2,
      route: '/dashboard/contracts'
    },
    { 
      id: 'recommendations', 
      label: 'Recommendations', 
      icon: Lightbulb, 
      color: 'text-cyan-500',
      description: 'Based on your genre and skills',
      badge: 'NEW',
      route: '/dashboard/recommendations'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      color: 'text-indigo-500',
      description: 'Profile views, collaboration success rate',
      route: '/dashboard/analytics'
    }
  ];

  const handleNavigation = (item: NavigationItem) => {
    setActiveTab(item.id);
    if (item.route) {
      navigate(item.route);
    }
  };

  const handleMessagesNavigation = () => {
    navigate('/messages');
  };

  const currentLevel = 7;
  const currentXP = 2847;
  const progressPercentage = ((currentXP % 1000) / 1000) * 100;

  return (
    <div className={cn(
      "h-full bg-gradient-to-b from-card to-muted/30 border-r border-saffron/20 transition-all duration-300",
      collapsed ? "w-20" : "w-80"
    )}>
      {/* Header with Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-saffron/20">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Online
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="hover:bg-saffron/10"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Profile Section */}
      <div className={cn(
        "p-4 border-b border-saffron/20",
        collapsed && "p-2"
      )}>
        <div className="flex items-center space-x-3 mb-4 cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="relative">
            <Avatar className={cn(
              "border-2 border-orange-500/30",
              collapsed ? "w-8 h-8" : "w-12 h-12"
            )}>
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <OnlineStatus isOnline={true} className="absolute -bottom-1 -right-1" />
          </div>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">
                {profile?.full_name || 'Music Enthusiast'}
              </h3>
              <p className="text-gray-400 text-xs truncate">
                Level {currentLevel} • Recognized Artist
              </p>
            </div>
          )}
        </div>
        
        {!collapsed && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">XP: {currentXP.toLocaleString()}</span>
              <span className="text-xs text-orange-500">{Math.round(progressPercentage)}% to Level {currentLevel + 1}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || location.pathname.includes(item.route || '');
          
          return (
            <div key={item.id} className="relative">
              <button
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full group relative flex items-center rounded-xl transition-all duration-300 transform hover:scale-[1.02]",
                  collapsed ? "justify-center p-3" : "justify-start px-4 py-3",
                  isActive 
                    ? "bg-gradient-to-r from-saffron/20 to-amber-500/20 text-saffron border border-saffron/30 shadow-lg shadow-saffron/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30"
                )}
              >
                <div className={cn(
                  "relative flex items-center transition-all duration-300",
                  collapsed ? "justify-center" : "justify-start"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-300 group-hover:scale-110",
                    isActive ? "animate-pulse" : "",
                    item.color
                  )} />
                  
                  {!collapsed && (
                    <div className="ml-3 flex-1 text-left">
                      <span className={cn(
                        "font-medium transition-all duration-300 group-hover:translate-x-1",
                        isActive && "font-semibold"
                      )}>
                        {item.label}
                      </span>
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-0.5 opacity-75">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Badge */}
                {item.badge && (
                  <NotificationBadge 
                    count={typeof item.badge === 'number' ? item.badge : 0}
                    variant={item.badge === 'NEW' ? 'success' : item.badge === 'BETA' ? 'warning' : 'cultural'}
                    className={cn(
                      collapsed ? "top-1 right-1" : "top-2 right-2"
                    )}
                  />
                )}
              </button>
            </div>
          );
        })}
        
        {/* Messages with Special Styling */}
        <div className="relative">
          <button 
            onClick={handleMessagesNavigation}
            className={cn(
              "w-full group relative flex items-center rounded-xl transition-all duration-300 transform hover:scale-[1.02] text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30",
              collapsed ? "justify-center p-3" : "justify-start px-4 py-3",
              location.pathname.startsWith('/messages') && "bg-gradient-to-r from-saffron/20 to-amber-500/20 text-saffron border border-saffron/30 shadow-lg shadow-saffron/20"
            )}
          >
            <div className={cn(
              "relative flex items-center transition-all duration-300",
              collapsed ? "justify-center" : "justify-start"
            )}>
              <MessageCircle className="w-5 h-5 text-purple-500 transition-all duration-300 group-hover:scale-110" />
              
              {!collapsed && (
                <div className="ml-3 flex-1 text-left">
                  <span className="font-medium transition-all duration-300 group-hover:translate-x-1">
                    Messages
                  </span>
                  <div className="text-xs text-muted-foreground mt-0.5 opacity-75">
                    ਸੁਨੇਹੇ • Direct conversations
                  </div>
                </div>
              )}
            </div>
            
            <MessageIndicator
              hasUnread={true}
              messageCount={8}
              className={cn(
                collapsed ? "top-1 right-1" : "top-2 right-2"
              )}
            />
          </button>
        </div>
      </nav>

      {/* Upgrade Section */}
      {!collapsed && (
        <div className="p-4 border-t border-saffron/20">
          <div className="bg-gradient-to-r from-saffron to-amber-500 p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">Upgrade to Pro</h4>
              <Zap className="w-4 h-4" />
            </div>
            <p className="text-xs opacity-90 mb-3">
              Unlock premium features and expand your musical journey
            </p>
            <Button 
              size="sm" 
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
