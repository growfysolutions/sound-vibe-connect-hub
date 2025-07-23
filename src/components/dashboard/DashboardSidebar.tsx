
import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Search, FolderOpen, Users, BarChart3, FileText, Sparkles, LineChart, MessageSquare, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      "sidebar-unified-theme",
      collapsed ? "w-20" : "w-80"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full sidebar-toggle-btn z-50"
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
                    "w-full p-3 rounded-lg transition-all duration-300 group flex items-center justify-center nav-item",
                    activeTab === item.id ? "nav-item-active" : "nav-item-inactive"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
            <button
              onClick={onNavigateToMessages}
              className="w-full p-3 rounded-lg transition-all duration-300 nav-item nav-item-inactive flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            {/* Level Progress Section */}
            <div className="px-4 pb-4">
              <div className="level-progress-card">
                <div className="space-y-2">
                  <h3 className="level-title">Level 1: Rising Star</h3>
                  <p className="level-subtitle" style={{ fontFamily: 'serif' }}>
                    ਪੱਚ 1: ਨਵਾਂ ਸਿਤਾਰਾ
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="level-xp-text">0 / 1000 XP</span>
                      <div className="flex items-center streak-indicator">
                        <div className="streak-dot"></div>
                        3 Day Streak
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '0%' }}></div>
                    </div>
                    <p className="level-next-text">Next: Rising Star Pro</p>
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
                    <div key={stat.label} className="stat-card">
                      <Icon className="stat-icon" />
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
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
                        "w-full py-3 px-4 rounded-lg transition-all duration-300 group text-left nav-item",
                        activeTab === item.id ? "nav-item-active" : "nav-item-inactive"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div className="flex-1 min-w-0">
                          <div className="nav-item-title">{item.label}</div>
                          <div className="nav-item-subtitle">{item.sublabel}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Messages Button */}
                <button
                  onClick={onNavigateToMessages}
                  className="w-full py-3 px-4 rounded-lg transition-all duration-300 group text-left nav-item nav-item-inactive"
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5" />
                    <div className="flex-1 min-w-0">
                      <div className="nav-item-title">Messages</div>
                      <div className="nav-item-subtitle">Chat & collaborate</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
              <button className="footer-button">
                <Info className="footer-icon" />
                About SoundVibe
              </button>
              <button 
                onClick={onNavigateToMessages}
                className="footer-button"
              >
                <MessageSquare className="footer-icon" />
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
      <div className="sidebar-overlay"></div>

      <style jsx>{`
        .sidebar-unified-theme {
          background: var(--secondary-bg, #1a1f2e);
          border-right: 1px solid var(--border-color, #374151);
        }

        .sidebar-toggle-btn {
          background: var(--card-bg, #1e2936);
          border: 1px solid var(--border-color, #374151);
          color: var(--text-secondary, #9ca3af);
        }

        .sidebar-toggle-btn:hover {
          background: var(--accent-orange, #ff9500);
          color: white;
        }

        .level-progress-card {
          background: var(--card-bg, #1e2936);
          border: 1px solid var(--border-color, #374151);
          border-radius: 12px;
          padding: 16px;
        }

        .level-title {
          color: var(--text-primary, #ffffff);
          font-weight: 600;
          font-size: 14px;
          margin: 0;
        }

        .level-subtitle {
          color: var(--text-secondary, #9ca3af);
          font-size: 12px;
          margin: 0;
        }

        .level-xp-text {
          color: var(--text-secondary, #9ca3af);
        }

        .streak-indicator {
          color: var(--accent-orange, #ff9500);
        }

        .streak-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-orange, #ff9500);
          border-radius: 50%;
          margin-right: 4px;
        }

        .level-next-text {
          color: var(--text-secondary, #9ca3af);
          font-size: 11px;
          margin: 0;
        }

        .stat-card {
          background: var(--card-bg, #1e2936);
          border: 1px solid var(--border-color, #374151);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          border-color: rgba(255, 149, 0, 0.3);
        }

        .stat-icon {
          width: 16px;
          height: 16px;
          margin: 0 auto 8px;
          color: var(--accent-orange, #ff9500);
        }

        .stat-value {
          color: var(--text-primary, #ffffff);
          font-weight: 600;
          font-size: 14px;
        }

        .stat-label {
          color: var(--text-secondary, #9ca3af);
          font-size: 11px;
        }

        .nav-item {
          padding: 12px 16px;
          border-radius: 8px;
          margin: 4px 0;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .nav-item-inactive {
          color: var(--text-secondary, #9ca3af);
        }

        .nav-item-inactive:hover {
          background: rgba(255, 149, 0, 0.1);
          color: var(--accent-orange, #ff9500);
        }

        .nav-item-active {
          background: rgba(255, 149, 0, 0.15);
          border-left: 3px solid var(--accent-orange, #ff9500);
          color: var(--text-primary, #ffffff);
        }

        .nav-item-title {
          font-weight: 500;
          font-size: 14px;
        }

        .nav-item-subtitle {
          font-size: 11px;
          color: var(--text-secondary, #9ca3af);
          margin-top: 2px;
        }

        .nav-item-active .nav-item-subtitle {
          color: rgba(255, 255, 255, 0.7);
        }

        .sidebar-footer {
          border-top: 1px solid var(--border-color, #374151);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-button {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 8px 12px;
          font-size: 14px;
          color: var(--text-secondary, #9ca3af);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .footer-button:hover {
          background: rgba(255, 149, 0, 0.1);
          color: var(--accent-orange, #ff9500);
        }

        .footer-icon {
          width: 16px;
          height: 16px;
          margin-right: 12px;
        }

        .footer-button:hover .footer-icon {
          color: var(--accent-orange, #ff9500);
        }

        .sidebar-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.05;
        }

        .sidebar-overlay::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 128px;
          height: 128px;
          background: radial-gradient(circle, rgba(255, 149, 0, 0.2) 0%, transparent 70%);
          border-radius: 0 0 0 100%;
        }

        .sidebar-overlay::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 128px;
          height: 128px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          border-radius: 0 100% 0 0;
        }
      `}</style>
    </div>
  );
}
