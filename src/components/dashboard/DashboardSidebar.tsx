import { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Music, 
  Users, 
  Gamepad2, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  MessageCircle,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/contexts/ProfileContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNavigateToMessages: () => void;
}

const navigationItems = [
  { id: 'feed', label: 'Feed', icon: TrendingUp },
  { id: 'discover', label: 'Discover', icon: Search },
  { id: 'projects', label: 'My Projects', icon: Music },
  { id: 'network', label: 'Network', icon: Users },
  { id: 'progress', label: 'Progress', icon: Gamepad2 },
  { id: 'contracts', label: 'My Contracts', icon: Briefcase },
  { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export function DashboardSidebar({ activeTab, onTabChange, onNavigateToMessages }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { profile } = useProfile();

  // Calculate user progress
  const userXp = (profile as any)?.xp || 0;
  const userLevel = profile?.level || 1;
  const xpForCurrentLevel = (userLevel - 1) * 1000;
  const progressPercentage = Math.min(((userXp - xpForCurrentLevel) / 1000) * 100, 100);

  // Get level name based on level
  const getLevelName = (level: number) => {
    if (level <= 2) return 'Rising Star';
    if (level <= 5) return 'Creative';
    if (level <= 10) return 'Professional';
    if (level <= 20) return 'Expert';
    return 'Master';
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen bg-gradient-to-b from-card/95 to-background/95 backdrop-blur-xl border-r border-border/50 transition-all duration-300 z-40",
      collapsed ? "w-20" : "w-80"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-background border border-border/50 hover:bg-muted z-50"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="p-6 h-full flex flex-col">
        {/* User Profile Section */}
        <div className={cn(
          "flex flex-col items-center space-y-4 pb-6 border-b border-border/30",
          collapsed && "items-center"
        )}>
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border-2 border-primary/30">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || 'User'} 
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-primary">
                  {profile?.full_name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            {/* Completion Ring */}
            <div className="absolute -inset-1">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${progressPercentage * 2.95} 295`}
                  strokeLinecap="round"
                  className="rotate-[-90deg] origin-center transition-all duration-500"
                />
              </svg>
            </div>
          </div>
          
          {!collapsed && (
            <>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{profile?.full_name || 'User'}</h3>
                <p className="text-sm text-muted-foreground">{profile?.role || 'Aspiring Artist'}</p>
              </div>
              
              {/* XP Progress Bar */}
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Level {userLevel}: {getLevelName(userLevel)}</span>
                  <Badge variant="secondary" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    {userXp} XP
                  </Badge>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{userXp - xpForCurrentLevel} / 1000</span>
                  <span>Next: Level {userLevel + 1}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 w-full">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-sm font-semibold">2</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-sm font-semibold">12</div>
                  <div className="text-xs text-muted-foreground">Connections</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-sm font-semibold">{userLevel}</div>
                  <div className="text-xs text-muted-foreground">Level</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group",
                    collapsed ? "justify-center" : "justify-start",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <IconComponent className={cn(
                    "flex-shrink-0 transition-all duration-200",
                    collapsed ? "w-5 h-5" : "w-5 h-5 mr-3",
                    isActive && "scale-110"
                  )} />
                  {!collapsed && (
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Messages Button */}
            <button
              onClick={onNavigateToMessages}
              className={cn(
                "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group text-muted-foreground hover:text-foreground hover:bg-muted/50",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <MessageSquare className={cn(
                "flex-shrink-0 transition-all duration-200",
                collapsed ? "w-5 h-5" : "w-5 h-5 mr-3"
              )} />
              {!collapsed && (
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  Messages
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-border/30 pt-6 space-y-2">
            <button className="w-full flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
              <Info className="w-4 h-4 mr-3" />
              About Us
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4 mr-3" />
              Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}