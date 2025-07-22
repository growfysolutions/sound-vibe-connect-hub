
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotice(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineNotice(true);
      setTimeout(() => setShowOfflineNotice(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isMobile || isOnline) return null;

  return (
    <div className={cn(
      "fixed top-20 left-4 right-4 z-50 transition-all duration-500",
      showOfflineNotice ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
    )}>
      <div className="bg-gradient-to-r from-amber-500/90 to-orange-600/90 backdrop-blur-xl rounded-lg p-4 border border-amber-400/30">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <WifiOff className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">Offline Mode</p>
                <p className="text-white/80 text-xs" style={{ fontFamily: 'serif' }}>
                  ਔਫਲਾਈਨ ਮੋਡ • No internet connection
                </p>
              </div>
              <Download className="w-5 h-5 text-white/80" />
            </div>
          </div>
        </div>
        
        <div className="mt-3 bg-white/10 rounded-lg p-2">
          <p className="text-white/90 text-xs text-center">
            You can still view downloaded content and sync when back online
          </p>
        </div>
        
        {/* Traditional pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-transparent via-white/20 to-transparent rounded-lg" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
                 backgroundSize: '20px 20px'
               }} 
          />
        </div>
      </div>
    </div>
  );
}
