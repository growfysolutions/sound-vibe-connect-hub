import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export function CreatePostForm({ onPostCreated }: { onPostCreated: () => void }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a post.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (!content.trim()) {
        toast({
            title: 'Error',
            description: 'Post content cannot be empty.',
            variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
    }

    const { error } = await supabase
      .from('posts')
      .insert([{ content, user_id: user.id }]);

    if (error) {
      toast({
        title: 'Error creating post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setContent('');
      toast({
        title: 'Success',
        description: 'Your post has been created.',
      });
      onPostCreated(); // Callback to refresh the feed
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-card">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </form>
  );
}
