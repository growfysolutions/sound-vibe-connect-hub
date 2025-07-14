
import React from 'react';
import { cn } from '@/lib/utils';

interface GradientBorderCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientBorderCard: React.FC<GradientBorderCardProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={cn("relative p-0.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 animate-pulse", className)}>
      <div className="bg-neutral-900 rounded-lg p-6 h-full relative z-10">
        {children}
      </div>
    </div>
  );
};
