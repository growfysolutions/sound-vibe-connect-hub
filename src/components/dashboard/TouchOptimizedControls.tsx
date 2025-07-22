
import { useState, useRef, useEffect } from 'react';
import { Heart, Share2, MessageCircle, Bookmark, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface TouchOptimizedControlsProps {
  isLiked?: boolean;
  onLike?: () => void;
  onShare?: () => void;
  onComment?: () => void;
  onSave?: () => void;
  className?: string;
}

export function TouchOptimizedControls({ 
  isLiked, 
  onLike, 
  onShare, 
  onComment, 
  onSave,
  className 
}: TouchOptimizedControlsProps) {
  const isMobile = useIsMobile();
  const [gestureState, setGestureState] = useState<'none' | 'like' | 'save'>('none');
  const touchStartX = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartX.current;
    const deltaTime = Date.now() - touchStartTime.current;

    // Prevent too fast gestures
    if (deltaTime < 100) return;

    if (deltaX > 50) {
      setGestureState('like');
    } else if (deltaX < -50) {
      setGestureState('save');
    } else {
      setGestureState('none');
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    
    if (gestureState === 'like' && onLike) {
      onLike();
      // Haptic feedback simulation
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]); // Tabla beat pattern
      }
    } else if (gestureState === 'save' && onSave) {
      onSave();
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
    
    setGestureState('none');
  };

  if (!isMobile) {
    return (
      <div className={cn("flex items-center space-x-4", className)}>
        <Button variant="ghost" size="sm" onClick={onLike} className="group">
          <Heart className={cn("w-5 h-5 mr-2 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground group-hover:text-red-500")} />
          <span>Like</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onComment}>
          <MessageCircle className="w-5 h-5 mr-2 text-muted-foreground" />
          <span>Comment</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onShare}>
          <Share2 className="w-5 h-5 mr-2 text-muted-foreground" />
          <span>Share</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onSave}>
          <Bookmark className="w-5 h-5 mr-2 text-muted-foreground" />
          <span>Save</span>
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4 bg-gradient-to-r from-background/50 to-muted/20 rounded-lg transition-all duration-300",
        gestureState === 'like' && "bg-red-500/20 transform scale-105",
        gestureState === 'save' && "bg-saffron/20 transform scale-105",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLike}
          className={cn(
            "p-3 rounded-full transition-all duration-300 active:scale-95",
            isLiked ? "bg-red-500/20 text-red-500" : "hover:bg-red-500/10"
          )}
        >
          <Heart className={cn("w-6 h-6", isLiked && "fill-red-500")} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onComment}
          className="p-3 rounded-full hover:bg-saffron/10 transition-all duration-300 active:scale-95"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onShare}
          className="p-3 rounded-full hover:bg-saffron/10 transition-all duration-300 active:scale-95"
        >
          <Share2 className="w-6 h-6" />
        </Button>
      </div>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onSave}
        className="p-3 rounded-full hover:bg-saffron/10 transition-all duration-300 active:scale-95"
      >
        <Bookmark className="w-6 h-6" />
      </Button>

      {/* Gesture feedback */}
      {gestureState !== 'none' && (
        <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-dashed animate-pulse">
          {gestureState === 'like' && (
            <div className="absolute top-2 left-2 text-red-500 font-semibold text-sm">
              ← Swipe to Like
            </div>
          )}
          {gestureState === 'save' && (
            <div className="absolute top-2 right-2 text-saffron font-semibold text-sm">
              Swipe to Save →
            </div>
          )}
        </div>
      )}
    </div>
  );
}
