
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/contexts/ProfileContext';
import { cn } from '@/lib/utils';
import { ProfileHeader } from './ProfileHeader';
import { LevelProgressRing } from './LevelProgressRing';
import { EnhancedStatsCards } from './EnhancedStatsCards';
import { CulturalNavigation } from './CulturalNavigation';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNavigateToMessages: () => void;
}

export function DashboardSidebar({ activeTab, onTabChange, onNavigateToMessages }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { profile } = useProfile();

  const userLevel = profile?.level || 1;
  const projectsCount = 2; // This would come from your data
  const connectionsCount = 12; // This would come from your data

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen transition-all duration-500 z-40",
      "bg-gradient-to-b from-card/98 to-background/95 backdrop-blur-xl",
      "border-r border-gradient-to-b border-saffron/10 to-border/50",
      collapsed ? "w-20" : "w-80"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-background border border-border/50 hover:bg-muted z-50 hover:border-saffron/50 transition-all duration-300"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="h-full flex flex-col overflow-hidden">
        {/* Profile Header */}
        <ProfileHeader collapsed={collapsed} />

        {/* Level Progress Ring */}
        <LevelProgressRing collapsed={collapsed} />

        {/* Enhanced Stats Cards */}
        <EnhancedStatsCards 
          collapsed={collapsed}
          projectsCount={projectsCount}
          connectionsCount={connectionsCount}
          userLevel={userLevel}
        />

        {/* Cultural Navigation */}
        <CulturalNavigation 
          activeTab={activeTab}
          onTabChange={onTabChange}
          collapsed={collapsed}
        />

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-border/30 p-4 space-y-2 bg-gradient-to-t from-muted/20 to-transparent">
            <button className="w-full flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-300 group">
              <Info className="w-4 h-4 mr-3 group-hover:text-saffron transition-colors" />
              About SoundVibe
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-300 group">
              <MessageCircle className="w-4 h-4 mr-3 group-hover:text-saffron transition-colors" />
              <div className="flex flex-col items-start">
                <span>Feedback</span>
                <span className="text-xs" style={{ fontFamily: 'serif' }}>ਸੁਝਾਅ</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Seasonal theme overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-saffron/5 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-tr-full" />
      </div>
    </div>
  );
}
