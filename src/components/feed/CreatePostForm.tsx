
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/ProfileContext';
import { Image, Music, Calendar, MapPin } from 'lucide-react';

interface CreatePostFormProps {
  onPostCreated: () => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { profile } = useProfile();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please write something to share');
      return;
    }

    try {
      setIsPosting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to create a post');
        return;
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          content: content.trim(),
          user_id: user.id,
          type: 'text'
        });

      if (error) {
        console.error('Error creating post:', error);
        toast.error('Failed to create post');
        return;
      }

      setContent('');
      onPostCreated();
      toast.success('Post shared successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 border-2 border-border">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {profile?.full_name || 'Your Name'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Share your musical journey... ਆਪਣੀ ਸੰਗੀਤ ਯਾਤਰਾ ਸਾਂਝੀ ਕਰੋ...
              </p>
            </div>
          </div>

          {/* Content Input */}
          <div className="space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share your musical thoughts, experiences, or updates with the SoundVibe community..."
              className="min-h-[120px] resize-none border-border focus:border-primary bg-background placeholder:text-muted-foreground"
              maxLength={2000}
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Share in English, ਪੰਜਾਬੀ, or any language you prefer</span>
              <span className={content.length > 1800 ? 'text-destructive' : ''}>
                {content.length}/2000
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => toast.info('Media upload coming soon!')}
              >
                <Image className="w-4 h-4" />
                <span>Photo</span>
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => toast.info('Audio upload coming soon!')}
              >
                <Music className="w-4 h-4" />
                <span>Audio</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => toast.info('Location tagging coming soon!')}
              >
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => toast.info('Event sharing coming soon!')}
              >
                <Calendar className="w-4 h-4" />
                <span>Event</span>
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              {content.trim() && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setContent('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={!content.trim() || isPosting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                {isPosting ? 'Sharing...' : 'Share Post'}
              </Button>
            </div>
          </div>

          {/* Cultural Context */}
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">
              🎵 Celebrating the rich musical heritage of Punjab and beyond • 
              <span style={{ fontFamily: 'serif' }}> ਪੰਜਾਬ ਅਤੇ ਇਸ ਤੋਂ ਪਾਰ ਦੀ ਅਮੀਰ ਸੰਗੀਤ ਵਿਰਾਸਤ ਦਾ ਜਸ਼ਨ</span>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
