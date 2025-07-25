
import React from 'react';
import { cn } from '@/lib/utils';

interface DholLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DholLoader: React.FC<DholLoaderProps> = ({ size = 'md', className }) => {
  const sizeClasses = cn(
    size === 'sm' && 'w-6 h-6',
    size === 'md' && 'w-8 h-8',
    size === 'lg' && 'w-12 h-12'
  );

  return (
    <div className={cn('relative', sizeClasses, className)}>
      {/* Ocean-themed loader shape */}
      <div className="absolute inset-0 rounded-full bg-ocean-gradient animate-spin shadow-lg">
        {/* Loader rim */}
        <div className="absolute inset-1 rounded-full border-2 border-ocean-blue-light/50" />
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-teal rounded-full animate-pulse" />
        
        {/* Decorative lines */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-px h-2 bg-ocean-blue-light/70" />
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-px h-2 bg-ocean-blue-light/70" />
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 h-px w-2 bg-ocean-blue-light/70" />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 h-px w-2 bg-ocean-blue-light/70" />
      </div>
    </div>
  );
};
