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

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const { profile } = useProfile();

  const navigationItems = [
    { 
      id: 'feed', 
      label: 'Feed', 
      icon: Home, 
      punjabi: 'ਫੀਡ',
      color: 'text-orange-500',
      badge: '12'
    },
    { 
      id: 'discover', 
      label: 'Discover', 
      icon: Search, 
      punjabi: 'ਖੋਜ',
      color: 'text-blue-500',
      badge: 'NEW'
    },
    { 
      id: 'network', 
      label: 'Network', 
      icon: Users, 
      punjabi: 'ਨੈੱਟਵਰਕ',
      color: 'text-green-500',
      badge: '3'
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MessageCircle, 
      punjabi: 'ਸੁਨੇਹੇ',
      color: 'text-purple-500',
      badge: '8'
    },
    { 
      id: 'projects', 
      label: 'My Projects', 
      icon: FileMusic, 
      punjabi: 'ਪ੍ਰੋਜੈਕਟ',
      color: 'text-pink-500'
    },
    { 
      id: 'gigs', 
      label: 'Gigs', 
      icon: Briefcase, 
      punjabi: 'ਗਿਗਸ',
      color: 'text-yellow-500',
      badge: '5'
    }
  ];

  const secondaryItems = [
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: Trophy, 
      punjabi: 'ਪ੍ਰਾਪਤੀਆਂ',
      color: 'text-amber-500'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: TrendingUp, 
      punjabi: 'ਵਿਸ਼ਲੇਸ਼ਣ',
      color: 'text-cyan-500'
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: Calendar, 
      punjabi: 'ਕੈਲੰਡਰ',
      color: 'text-red-500'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      punjabi: 'ਸੈਟਿੰਗਜ਼',
      color: 'text-gray-500'
    }
  ];

  const quickActions = [
    { 
      id: 'live', 
      label: 'Go Live', 
      icon: Radio, 
      punjabi: 'ਲਾਈਵ ਜਾਓ',
      color: 'text-red-500'
    },
    { 
      id: 'record', 
      label: 'Record', 
      icon: Mic, 
      punjabi: 'ਰਿਕਾਰਡ',
      color: 'text-green-500'
    },
    { 
      id: 'collab', 
      label: 'Collaborate', 
      icon: Users, 
      punjabi: 'ਸਹਿਯੋਗ',
      color: 'text-blue-500'
    }
  ];

  return (
    <>
      <style>
        {`
          .dashboard-sidebar {
            background: #1a1f2e;
            border-right: 1px solid #374151;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #374151 transparent;
          }
          
          .dashboard-sidebar::-webkit-scrollbar {
            width: 6px;
          }
          
          .dashboard-sidebar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .dashboard-sidebar::-webkit-scrollbar-thumb {
            background: #374151;
            border-radius: 3px;
          }
          
          .dashboard-sidebar::-webkit-scrollbar-thumb:hover {
            background: #4b5563;
          }
          
          .nav-section {
            margin-bottom: 32px;
          }
          
          .nav-section-title {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            padding: 0 20px;
          }
          
          .nav-item {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: #9ca3af;
            text-decoration: none;
            transition: all 0.2s ease;
            border-radius: 0;
            margin: 0;
            position: relative;
            cursor: pointer;
            border-left: 3px solid transparent;
          }
          
          .nav-item:hover {
            background: rgba(255, 149, 0, 0.1);
            color: #ff9500;
          }
          
          .nav-item.active {
            background: rgba(255, 149, 0, 0.15);
            color: #ffffff;
            border-left: 3px solid #ff9500;
          }
          
          .nav-item.active .nav-icon {
            color: #ff9500;
          }
          
          .nav-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            flex-shrink: 0;
          }
          
          .nav-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
          }
          
          .nav-label {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 2px;
          }
          
          .nav-punjabi {
            font-size: 11px;
            opacity: 0.7;
            font-family: serif;
          }
          
          .nav-badge {
            background: #ff9500;
            color: white;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: 8px;
          }
          
          .nav-badge.new {
            background: #10b981;
          }
          
          .quick-actions {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin: 16px 20px;
          }
          
          .quick-action {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 12px 8px;
            background: #1e2936;
            border: 1px solid #374151;
            border-radius: 8px;
            color: #9ca3af;
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;
          }
          
          .quick-action:hover {
            background: rgba(255, 149, 0, 0.1);
            border-color: #ff9500;
            color: #ff9500;
          }
          
          .quick-action-icon {
            width: 16px;
            height: 16px;
            margin-bottom: 4px;
          }
          
          .quick-action-label {
            font-size: 10px;
            font-weight: 500;
            text-align: center;
            line-height: 1.2;
          }
          
          .sidebar-footer {
            padding: 20px;
            border-top: 1px solid #374151;
            margin-top: auto;
          }
          
          .upgrade-card {
            background: linear-gradient(135deg, #ff9500 0%, #d97706 100%);
            padding: 16px;
            border-radius: 12px;
            color: white;
            text-align: center;
          }
          
          .upgrade-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .upgrade-description {
            font-size: 11px;
            opacity: 0.9;
            margin-bottom: 12px;
          }
          
          .upgrade-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          
          .upgrade-btn:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}
      </style>
      
      <div className="dashboard-sidebar h-full flex flex-col">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-12 h-12 border-2 border-orange-500/30">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">
                {profile?.full_name || 'Music Enthusiast'}
              </h3>
              <p className="text-gray-400 text-xs truncate">
                {profile?.role || 'Aspiring Artist'}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Level {profile?.level || 1}</span>
              <span className="text-xs text-orange-500">75% to next</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6">
          <div className="nav-section">
            <div className="nav-section-title">Main Menu</div>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="nav-icon" />
                  <div className="nav-content">
                    <div className="nav-label">{item.label}</div>
                    <div className="nav-punjabi">{item.punjabi}</div>
                  </div>
                  {item.badge && (
                    <div className={`nav-badge ${item.badge === 'NEW' ? 'new' : ''}`}>
                      {item.badge}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Tools & Analytics</div>
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="nav-icon" />
                  <div className="nav-content">
                    <div className="nav-label">{item.label}</div>
                    <div className="nav-punjabi">{item.punjabi}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="nav-section">
            <div className="nav-section-title">Quick Actions</div>
            <div className="quick-actions">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div key={action.id} className="quick-action">
                    <Icon className="quick-action-icon" />
                    <div className="quick-action-label">{action.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="upgrade-card">
            <div className="upgrade-title">Upgrade to Pro</div>
            <div className="upgrade-description">
              Unlock premium features and expand your musical journey
            </div>
            <button className="upgrade-btn">
              <Zap className="w-4 h-4 inline mr-1" />
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
