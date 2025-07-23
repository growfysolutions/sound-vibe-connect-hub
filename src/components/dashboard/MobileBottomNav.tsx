
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const mobileNavItems = [
  { id: 'feed', icon: '📜', label: 'Feed', punjabi: 'ਫੀਡ', route: '/dashboard/feed' },
  { id: 'discover', icon: '🔍', label: 'Discover', punjabi: 'ਖੋਜ', route: '/dashboard/discover' },
  { id: 'projects', icon: '🎹', label: 'Projects', punjabi: 'ਪ੍ਰੋਜੈਕਟ', route: '/dashboard/projects' },
  { id: 'network', icon: '🤝', label: 'Network', punjabi: 'ਨੈਟਵਰਕ', route: '/dashboard/network' },
  { id: 'progress', icon: '📈', label: 'Progress', punjabi: 'ਤਰੱਕੀ', route: '/dashboard/progress' },
];

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isMobile) return null;

  const handleTabChange = (item: typeof mobileNavItems[0]) => {
    onTabChange(item.id);
    navigate(item.route);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-card/98 to-background/95 backdrop-blur-xl border-t border-saffron/20">
      <div className="flex items-center justify-around px-4 py-2 safe-area-pb">
        {mobileNavItems.map((item) => {
          const isActive = activeTab === item.id || location.pathname.includes(item.route);
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item)}
              className={cn(
                "flex flex-col items-center min-w-0 flex-1 py-2 px-1 rounded-xl transition-all duration-300 transform active:scale-95",
                isActive 
                  ? "bg-gradient-to-t from-saffron/20 to-amber-500/20 text-saffron" 
                  : "text-muted-foreground active:bg-muted/30"
              )}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div className={cn(
                "text-xl mb-1 transition-all duration-300",
                isActive && "animate-pulse scale-110"
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-300 truncate",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
              <span className="text-xs opacity-60 truncate" style={{ fontFamily: 'serif' }}>
                {item.punjabi}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-saffron rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
