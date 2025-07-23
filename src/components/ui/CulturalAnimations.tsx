
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CulturalAnimationProps {
  children: React.ReactNode;
  variant?: 'hover' | 'entrance' | 'success' | 'transition';
  className?: string;
  disabled?: boolean;
}

export const CulturalAnimation: React.FC<CulturalAnimationProps> = ({
  children,
  variant = 'hover',
  className,
  disabled = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const animationClasses = {
    hover: cn(
      "transition-all duration-200 ease-out",
      "hover:scale-105 hover:shadow-lg hover:shadow-saffron/20",
      "hover:bg-gradient-to-r hover:from-saffron/5 hover:to-amber-500/5",
      !disabled && "cursor-pointer"
    ),
    entrance: cn(
      "animate-fade-in",
      "transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
      "transform translate-y-4 opacity-0",
      "animate-[slideUp_0.3s_ease-out_forwards]"
    ),
    success: cn(
      "transition-all duration-250 ease-out",
      isAnimating && "animate-pulse bg-gradient-to-r from-green-500/20 to-emerald-500/20"
    ),
    transition: cn(
      "transition-all duration-300 ease-out",
      "transform-gpu"
    )
  };

  const handleSuccess = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div 
      className={cn(animationClasses[variant], className)}
      onAnimationEnd={variant === 'success' ? handleSuccess : undefined}
    >
      {children}
    </div>
  );
};

export const ConfettiAnimation: React.FC<{
  trigger: boolean;
  colors?: string[];
  className?: string;
}> = ({ trigger, colors = ['#ff6b35', '#ffb347', '#f4a460'], className }) => {
  if (!trigger) return null;

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-50", className)}>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 3 + 2}s`
          }}
        />
      ))}
    </div>
  );
};

export const PulseRing: React.FC<{
  active?: boolean;
  color?: string;
  className?: string;
}> = ({ active = false, color = 'saffron', className }) => {
  if (!active) return null;

  return (
    <div className={cn("absolute inset-0 rounded-full", className)}>
      <div className={cn(
        "absolute inset-0 rounded-full animate-ping",
        `bg-${color}/20`
      )} />
      <div className={cn(
        "absolute inset-2 rounded-full animate-ping animation-delay-200",
        `bg-${color}/30`
      )} />
      <div className={cn(
        "absolute inset-4 rounded-full animate-ping animation-delay-400",
        `bg-${color}/40`
      )} />
    </div>
  );
};

// Cultural easing curves
export const culturalEasing = {
  traditional: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  gentle: 'cubic-bezier(0.16, 1, 0.3, 1)',
  energetic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
};
