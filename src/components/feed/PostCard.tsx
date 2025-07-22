
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TouchOptimizedControls } from '@/components/dashboard/TouchOptimizedControls';
import { useIsMobile } from '@/hooks/use-mobile';
import { PostWithProfile } from '@/types';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: PostWithProfile;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isMobile = useIsMobile();

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share && isMobile) {
      navigator.share({
        title: `Post by ${post.profiles?.full_name || 'Unknown User'}`,
        text: post.content,
        url: window.location.href,
      });
    }
  };

  const handleComment = () => {
    // Open comment modal or navigate to post detail
  };

  // Handle case where post.profiles might be null
  const profileName = post.profiles?.full_name || 'Unknown User';
  const avatarUrl = post.profiles?.avatar_url;
  const profileInitial = profileName.charAt(0).toUpperCase();

  return (
    <Card className={cn(
      "border-saffron/20 bg-gradient-to-r from-card/95 to-background/90 backdrop-blur-sm transition-all duration-300",
      isMobile ? "mx-2" : ""
    )}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 border-2 border-saffron/30">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-saffron to-amber-500 text-white font-semibold">
                {profileInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground truncate">
                  {profileName}
                </h3>
                <span className="text-xs bg-saffron/20 text-saffron px-2 py-1 rounded-full">
                  ✓ Verified Artist
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
                <span>•</span>
                <span className="flex items-center">
                  📍 Punjab Traditional
                </span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="p-2">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 px-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              ❤️ 24 likes
            </span>
            <span className="flex items-center">
              💬 8 comments
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🎵 Traditional</span>
            <span>•</span>
            <span style={{ fontFamily: 'serif' }}>ਪਰੰਪਰਾਗਤ</span>
          </div>
        </div>

        {/* Touch Optimized Controls */}
        <TouchOptimizedControls
          isLiked={isLiked}
          onLike={handleLike}
          onShare={handleShare}
          onComment={handleComment}
          onSave={handleSave}
          className="border-t border-saffron/10 pt-4"
        />
      </CardContent>

      {/* Cultural pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-saffron/20 to-transparent rounded-lg" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px)',
               backgroundSize: '15px 15px'
             }} 
        />
      </div>
    </Card>
  );
}
