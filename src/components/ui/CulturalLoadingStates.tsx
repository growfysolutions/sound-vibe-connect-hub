
import React from 'react';
import { cn } from '@/lib/utils';
import { DholLoader } from './DholLoader';
import { Progress } from './progress';

interface CulturalLoadingProps {
  variant?: 'dhol' | 'pattern' | 'audio' | 'page';
  size?: 'sm' | 'md' | 'lg';
  progress?: number;
  message?: string;
  className?: string;
}

export const CulturalLoading: React.FC<CulturalLoadingProps> = ({
  variant = 'dhol',
  size = 'md',
  progress,
  message,
  className
}) => {
  const PatternLoader = () => (
    <div className="relative">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 rounded-full border-4 border-saffron/30" />
        <div className="absolute inset-0 rounded-full border-4 border-saffron border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-saffron/20 to-amber-500/20 animate-pulse" />
      </div>
      <div className="absolute -inset-4 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-saffron via-amber-500 to-orange-500 rounded-full animate-ping" />
      </div>
    </div>
  );

  const AudioLoader = () => (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <DholLoader size={size} className="animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-saffron rounded-full animate-pulse" />
        </div>
      </div>
      {progress !== undefined && (
        <div className="w-32 space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {progress}% loaded
          </p>
        </div>
      )}
    </div>
  );

  const PageLoader = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron to-amber-500 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-saffron/30 animate-spin" />
        <div className="absolute inset-4 rounded-full bg-white/20 animate-pulse delay-300" />
      </div>
      
      <div className="text-center space-y-2">
        <div className="w-40 h-4 bg-gradient-to-r from-saffron/20 to-amber-500/20 rounded animate-pulse" />
        <div className="w-24 h-3 bg-gradient-to-r from-saffron/10 to-amber-500/10 rounded animate-pulse delay-150" />
      </div>
      
      {/* Cultural pattern animation */}
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full bg-saffron animate-bounce",
              `delay-${i * 100}`
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'pattern':
        return <PatternLoader />;
      case 'audio':
        return <AudioLoader />;
      case 'page':
        return <PageLoader />;
      default:
        return <DholLoader size={size} />;
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {renderLoader()}
      {message && (
        <p className="mt-4 text-sm text-muted-foreground text-center animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export const CulturalSkeleton: React.FC<{ 
  variant?: 'card' | 'list' | 'profile' | 'audio';
  className?: string;
}> = ({ variant = 'card', className }) => {
  if (variant === 'card') {
    return (
      <div className={cn("p-6 border border-saffron/20 rounded-lg", className)}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-saffron/20 to-amber-500/20 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-saffron/20 to-amber-500/20 rounded w-3/4" />
              <div className="h-3 bg-gradient-to-r from-saffron/10 to-amber-500/10 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-saffron/20 to-amber-500/20 rounded" />
            <div className="h-3 bg-gradient-to-r from-saffron/10 to-amber-500/10 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'audio') {
    return (
      <div className={cn("p-4 border border-saffron/20 rounded-lg", className)}>
        <div className="animate-pulse space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-saffron/20 to-amber-500/20 rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-gradient-to-r from-saffron/20 to-amber-500/20 rounded w-3/4" />
              <div className="h-2 bg-gradient-to-r from-saffron/10 to-amber-500/10 rounded w-1/2" />
            </div>
          </div>
          <div className="h-12 bg-gradient-to-r from-saffron/10 to-amber-500/10 rounded" />
          <div className="flex space-x-2">
            <div className="h-8 bg-gradient-to-r from-saffron/20 to-amber-500/20 rounded flex-1" />
            <div className="h-8 bg-gradient-to-r from-saffron/20 to-amber-500/20 rounded flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-4 bg-gradient-to-r from-saffron/20 to-amber-500/20 rounded" />
    </div>
  );
};
