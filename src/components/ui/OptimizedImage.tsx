
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '100vw',
  placeholder = 'blur',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      setIsError(true);
      onError?.();
    };

    // Generate WebP version if supported
    const canvas = document.createElement('canvas');
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (supportsWebP && !src.includes('.webp')) {
      // Try to load WebP version first
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      img.src = webpSrc;
      
      // Fallback to original if WebP fails
      setTimeout(() => {
        if (!isLoaded) {
          img.src = src;
        }
      }, 1000);
    } else {
      img.src = src;
    }
  }, [src, isLoaded, onLoad, onError]);

  if (isError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        className
      )}>
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {placeholder === 'blur' && !isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-saffron/10 to-amber-500/10 animate-pulse" />
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={() => {
          setIsError(true);
          onError?.();
        }}
      />
    </div>
  );
};
