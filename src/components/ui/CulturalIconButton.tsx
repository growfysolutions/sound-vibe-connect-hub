
import React, { useState } from 'react';
import { Heart, Share2, Play, Pause, Menu, Music, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CulturalIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: 'heart' | 'share' | 'play' | 'pause' | 'menu' | 'music' | 'volume';
  variant?: 'default' | 'liked' | 'playing';
  size?: 'sm' | 'md' | 'lg';
  showBeat?: boolean;
  soundFeedback?: boolean;
}

export const CulturalIconButton = React.forwardRef<HTMLButtonElement, CulturalIconButtonProps>(
  ({ 
    icon, 
    variant = 'default', 
    size = 'md', 
    showBeat = false,
    soundFeedback = true,
    className,
    onClick,
    disabled,
    ...props 
  }, ref) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      // Create ripple effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };

      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);

      // Icon-specific animations
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      // Sound feedback simulation
      if (soundFeedback) {
        console.log(`🎵 ${icon} sound effect`);
      }

      onClick?.(e);
    };

    const IconComponent = {
      heart: Heart,
      share: Share2,
      play: Play,
      pause: Pause,
      menu: Menu,
      music: Music,
      volume: Volume2,
    }[icon];

    const sizeClasses = cn(
      size === 'sm' && 'w-8 h-8',
      size === 'md' && 'w-10 h-10',
      size === 'lg' && 'w-12 h-12'
    );

    const iconSizeClasses = cn(
      size === 'sm' && 'w-4 h-4',
      size === 'md' && 'w-5 h-5',
      size === 'lg' && 'w-6 h-6'
    );

    const baseClasses = cn(
      'relative overflow-hidden rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:ring-offset-2',
      'flex items-center justify-center',
      'hover:scale-110 active:scale-95',
      disabled && 'opacity-40 cursor-not-allowed',
      sizeClasses
    );

    const variantClasses = cn(
      // Default state
      variant === 'default' && [
        'bg-white/10 backdrop-blur-sm text-muted-foreground',
        'hover:bg-saffron/20 hover:text-saffron',
        'border border-white/20'
      ],
      // Liked state for heart
      variant === 'liked' && icon === 'heart' && [
        'bg-red-500/20 text-red-500',
        'hover:bg-red-500/30',
        showBeat && 'animate-pulse'
      ],
      // Playing state for play/pause
      variant === 'playing' && (icon === 'play' || icon === 'pause') && [
        'bg-saffron/20 text-saffron',
        'hover:bg-saffron/30',
        'shadow-lg shadow-saffron/25'
      ]
    );

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses, className)}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute pointer-events-none rounded-full animate-ping"
            style={{
              left: ripple.x - 8,
              top: ripple.y - 8,
              width: 16,
              height: 16,
              backgroundColor: variant === 'liked' ? '#EF4444' : '#FF9500',
              opacity: 0.6,
            }}
          />
        ))}

        {/* Icon with animations */}
        <IconComponent 
          className={cn(
            iconSizeClasses,
            'transition-all duration-300',
            // Heart beat animation
            icon === 'heart' && variant === 'liked' && showBeat && 'animate-pulse',
            // Play button waveform effect
            icon === 'play' && variant === 'playing' && 'animate-bounce',
            // General click animation
            isAnimating && 'animate-ping',
            // Fill for liked heart
            icon === 'heart' && variant === 'liked' && 'fill-current'
          )}
        />

        {/* Menu pattern texture overlay */}
        {icon === 'menu' && (
          <div className="absolute inset-0 rounded-full opacity-20 bg-gradient-to-br from-saffron/20 to-transparent" />
        )}
      </button>
    );
  }
);

CulturalIconButton.displayName = 'CulturalIconButton';
