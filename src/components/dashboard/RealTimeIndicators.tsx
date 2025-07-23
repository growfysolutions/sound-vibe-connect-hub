
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  variant?: 'default' | 'cultural' | 'success' | 'warning';
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  variant = 'default',
  className,
}) => {
  if (count === 0) return null;

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'cultural':
        return 'bg-gradient-to-r from-saffron to-amber-500 text-white border-saffron/30';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500/30';
      case 'warning':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500/30';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <Badge
      className={cn(
        "absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
        "border-2 border-background shadow-lg",
        "animate-pulse",
        getVariantStyles(variant),
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};

interface OnlineStatusProps {
  isOnline: boolean;
  className?: string;
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({ isOnline, className }) => {
  return (
    <div
      className={cn(
        "w-3 h-3 rounded-full border-2 border-background",
        isOnline 
          ? "bg-green-500 animate-pulse" 
          : "bg-gray-400",
        className
      )}
    />
  );
};

interface MessageIndicatorProps {
  hasUnread: boolean;
  messageCount: number;
  className?: string;
}

export const MessageIndicator: React.FC<MessageIndicatorProps> = ({
  hasUnread,
  messageCount,
  className,
}) => {
  return (
    <div className={cn("relative", className)}>
      {hasUnread && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" />
          <div className="absolute w-2 h-2 bg-white rounded-full animate-bounce" />
        </div>
      )}
      {messageCount > 0 && (
        <NotificationBadge count={messageCount} variant="cultural" className="top-0 right-0" />
      )}
    </div>
  );
};

interface SoundVisualizationProps {
  isActive: boolean;
  className?: string;
}

export const SoundVisualization: React.FC<SoundVisualizationProps> = ({
  isActive,
  className,
}) => {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-gradient-to-t from-saffron to-amber-500 rounded-full",
            isActive ? "animate-pulse" : "",
            i === 0 && "h-2",
            i === 1 && "h-3",
            i === 2 && "h-4",
            i === 3 && "h-2"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </div>
  );
};
