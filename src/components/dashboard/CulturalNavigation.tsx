import { cn } from '@/lib/utils';
import { getCulturalNavigationStyle, culturalStyles } from '@/lib/cultural-design';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface CulturalNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
}

const navigationItems: NavigationItem[] = [
  { id: 'feed', label: 'Feed', icon: '📜', description: 'Latest updates and stories' },
  { id: 'discover', label: 'Discover', icon: '🔍🎵', description: 'Find new talents and opportunities' },
  { id: 'projects', label: 'My Projects', icon: '🎹', description: 'Your musical creations' },
  { id: 'network', label: 'Network', icon: '🤝', description: 'Connect with artists' },
  { id: 'progress', label: 'Progress', icon: '📈', description: 'Track your journey' },
  { id: 'contracts', label: 'Contracts', icon: '📋', description: 'Manage your agreements' },
  { id: 'recommendations', label: 'Recommendations', icon: '✨', description: 'Personalized suggestions' },
  { id: 'analytics', label: 'Analytics', icon: '📊', description: 'Performance insights' },
];

export function CulturalNavigation({ activeTab, onTabChange, collapsed }: CulturalNavigationProps) {
  return (
    <nav className="flex-1 px-2 py-4">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full group relative flex items-center transition-all duration-300 transform hover:scale-105",
                collapsed ? "justify-center p-3" : "justify-start px-4 py-3",
                getCulturalNavigationStyle(isActive)
              )}
            >
              {/* Cultural pattern background */}
              <div className={cn(
                "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                isActive 
                  ? culturalStyles.patterns.phulkari
                  : "bg-gradient-to-r from-muted/20 to-transparent"
              )} />
              
              <div className={cn(
                "relative flex items-center transition-all duration-300",
                collapsed ? "justify-center" : "justify-start"
              )}>
                <span className={cn(
                  "text-xl transition-all duration-300 group-hover:scale-110",
                  isActive && "animate-pulse"
                )}>
                  {item.icon}
                </span>
                
                {!collapsed && (
                  <div className="ml-3 flex-1">
                    <span className={cn(
                      culturalStyles.typography.label,
                      "transition-all duration-300 group-hover:translate-x-1",
                      isActive && "font-semibold"
                    )}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className={cn(culturalStyles.typography.caption, 'mt-0.5 opacity-75')}>
                        {item.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Active indicator with cultural styling */}
              {isActive && (
                <div className="absolute right-2 w-2 h-2 bg-saffron rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
        
        {/* Messages with special cultural styling */}
        <button
          className={cn(
            "w-full group relative flex items-center transition-all duration-300 transform hover:scale-105 text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30",
            collapsed ? "justify-center p-3" : "justify-start px-4 py-3",
            getCulturalNavigationStyle(false)
          )}
        >
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-muted/20 to-transparent" />
          
          <div className={cn(
            "relative flex items-center transition-all duration-300",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <span className="text-xl transition-all duration-300 group-hover:scale-110">
              💬
            </span>
            
            {!collapsed && (
              <div className="ml-3 flex-1">
                <span className={cn(culturalStyles.typography.label, 'transition-all duration-300 group-hover:translate-x-1')}>
                  Messages
                </span>
                <div className="text-xs" style={{ fontFamily: 'serif' }}>
                  ਸੁਨੇਹੇ
                </div>
              </div>
            )}
          </div>
          
          {/* Cultural notification badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-background">
            3
          </div>
        </button>
      </div>
    </nav>
  );
}
