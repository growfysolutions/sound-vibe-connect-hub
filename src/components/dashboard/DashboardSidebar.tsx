
import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Search, FolderOpen, Users, BarChart3, FileText, Sparkles, LineChart, MessageSquare, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/contexts/ProfileContext';
import { cn } from '@/lib/utils';
import { ProfileHeader } from './ProfileHeader';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNavigateToMessages: () => void;
}

export function DashboardSidebar({ activeTab, onTabChange, onNavigateToMessages }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    {
      id: 'feed',
      icon: TrendingUp,
      label: 'Feed',
      sublabel: 'Latest updates and stories'
    },
    {
      id: 'discover',
      icon: Search,
      label: 'Discover',
      sublabel: 'Find new artists'
    },
    {
      id: 'projects',
      icon: FolderOpen,
      label: 'My Projects',
      sublabel: 'Your creative work'
    },
    {
      id: 'network',
      icon: Users,
      label: 'Network',
      sublabel: 'Your connections'
    },
    {
      id: 'progress',
      icon: BarChart3,
      label: 'Progress',
      sublabel: 'Skills & achievements'
    },
    {
      id: 'contracts',
      icon: FileText,
      label: 'My Contracts',
      sublabel: 'Active agreements'
    },
    {
      id: 'recommendations',
      icon: Sparkles,
      label: 'Recommendations',
      sublabel: 'Suggested for you'
    },
    {
      id: 'analytics',
      icon: LineChart,
      label: 'Analytics',
      sublabel: 'Performance insights'
    }
  ];

  const statsData = [
    { label: 'Projects', value: 2, icon: FolderOpen },
    { label: 'Connections', value: 12, icon: Users },
    { label: 'Level', value: 1, icon: Star }
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen transition-all duration-500 z-40",
      "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900",
      "border-r border-slate-700/50",
      collapsed ? "w-20" : "w-80"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 z-50 text-slate-300 hover:text-white transition-all duration-300"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="h-full flex flex-col overflow-y-auto">
        {/* Profile Header */}
        <ProfileHeader collapsed={collapsed} />

        {collapsed ? (
          // Collapsed Navigation
          <div className="flex-1 px-2 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full p-3 rounded-lg transition-all duration-300 group flex items-center justify-center",
                    activeTab === item.id
                      ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
            <button
              onClick={onNavigateToMessages}
              className="w-full p-3 rounded-lg transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-800/50 flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            {/* Level Progress Section */}
            <div className="px-4 pb-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                <div className="space-y-2">
                  <h3 className="text-white font-semibold text-sm">Level 1: Rising Star</h3>
                  <p className="text-slate-400 text-xs" style={{ fontFamily: 'serif' }}>
                    ਪੱਚ 1: ਨਵਾਂ ਸਿਤਾਰਾ
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">0 / 1000 XP</span>
                      <div className="flex items-center text-orange-400">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-1"></div>
                        3 Day Streak
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-slate-500 text-xs">Next: Rising Star Pro</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-3 gap-2">
                {statsData.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-slate-800/40 rounded-lg p-3 text-center border border-slate-700/20">
                      <Icon className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                      <div className="text-white font-semibold text-sm">{stat.value}</div>
                      <div className="text-slate-400 text-xs">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 px-4 pb-4">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={cn(
                        "w-full py-3 px-4 rounded-lg transition-all duration-300 group text-left",
                        activeTab === item.id
                          ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={cn(
                          "w-5 h-5 transition-colors",
                          activeTab === item.id ? "text-blue-400" : "text-slate-400 group-hover:text-white"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "font-medium text-sm",
                            activeTab === item.id ? "text-blue-400" : "text-slate-300 group-hover:text-white"
                          )}>
                            {item.label}
                          </div>
                          <div className="text-xs text-slate-500 group-hover:text-slate-400 truncate">
                            {item.sublabel}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Messages Button */}
                <button
                  onClick={onNavigateToMessages}
                  className="w-full py-3 px-4 rounded-lg transition-all duration-300 group text-left text-slate-400 hover:text-white hover:bg-slate-800/50"
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-slate-300 group-hover:text-white">Messages</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-400">Chat & collaborate</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700/30 p-4 space-y-2">
              <button className="w-full flex items-center px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-300 group">
                <Info className="w-4 h-4 mr-3 group-hover:text-blue-400 transition-colors" />
                About SoundVibe
              </button>
              <button 
                onClick={onNavigateToMessages}
                className="w-full flex items-center px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-300 group"
              >
                <MessageSquare className="w-4 h-4 mr-3 group-hover:text-blue-400 transition-colors" />
                <div className="flex flex-col items-start">
                  <span>Feedback</span>
                  <span className="text-xs" style={{ fontFamily: 'serif' }}>ਸੁਝਾਅ</span>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Cultural pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full" />
      </div>
    </div>
  );
}
