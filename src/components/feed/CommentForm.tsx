
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  creating: boolean;
}

export default function CommentForm({ onSubmit, creating }: CommentFormProps) {
  const { profile } = useProfile();
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const success = await onSubmit(content);
    if (success) {
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-3 mt-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src={profile?.avatar_url || undefined} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[60px] resize-none text-sm"
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {content.length}/500
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || creating}
            className="bg-primary hover:bg-primary/90"
          >
            {creating ? (
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
            ) : (
              <Send className="w-3 h-3 mr-1" />
            )}
            {creating ? 'Posting...' : 'Comment'}
          </Button>
        </div>
      </div>
    </form>
  );
}
