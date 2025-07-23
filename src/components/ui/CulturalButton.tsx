
import React, { useState } from 'react';
import { Loader2, Heart, Share2, Play, Pause, Menu, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CulturalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  soundFeedback?: boolean;
}

export const CulturalButton = React.forwardRef<HTMLButtonElement, CulturalButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    children, 
    soundFeedback = true,
    className,
    onClick,
    disabled,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

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

      // Sound feedback simulation (placeholder - would integrate with actual audio)
      if (soundFeedback) {
        console.log('🥁 Tabla beat sound effect');
      }

      onClick?.(e);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsPressed(false);

    const baseClasses = cn(
      'relative overflow-hidden font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:ring-offset-2',
      'transform active:scale-[0.98]',
      // Size variants
      size === 'sm' && 'px-4 py-2 text-sm rounded-md',
      size === 'md' && 'px-6 py-3 text-base rounded-lg',
      size === 'lg' && 'px-8 py-4 text-lg rounded-xl',
      // Disabled state
      (disabled || loading) && 'opacity-40 cursor-not-allowed grayscale',
      // Pressed state
      isPressed && 'scale-[0.98]'
    );

    const variantClasses = cn(
      variant === 'primary' && [
        'bg-gradient-to-r from-saffron to-gold-600 text-white shadow-lg',
        'hover:shadow-xl hover:scale-[1.02] hover:shadow-saffron/25',
        'active:shadow-inner active:from-saffron/90 active:to-gold-700',
        'tracking-wide'
      ],
      variant === 'secondary' && [
        'bg-transparent border-2 border-blue-700 text-blue-700',
        'hover:bg-blue-700/10 hover:border-blue-600',
        'active:bg-blue-700/20'
      ],
      variant === 'destructive' && [
        'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg',
        'hover:shadow-xl hover:scale-[1.02] hover:shadow-red-500/25',
        'active:shadow-inner active:from-red-700 active:to-red-900'
      ]
    );

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses, className)}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        disabled={disabled || loading}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute pointer-events-none rounded-full animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              backgroundColor: variant === 'primary' ? '#FFD700' : 
                             variant === 'secondary' ? '#1E40AF' : '#DC2626',
              opacity: 0.6,
            }}
          />
        ))}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {children}
        </span>

        {/* Glow effect for primary buttons */}
        {variant === 'primary' && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-saffron to-gold-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
        )}
      </button>
    );
  }
);

CulturalButton.displayName = 'CulturalButton';
