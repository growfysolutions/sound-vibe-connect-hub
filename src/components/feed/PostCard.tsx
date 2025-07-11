import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { PostWithProfile } from '@/types'; // We will define this type next
import { formatDistanceToNow } from 'date-fns';

export function PostCard({ post }: { post: PostWithProfile }) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.profiles?.avatar_url || undefined} alt={post.profiles?.full_name || 'User'} />
            <AvatarFallback>{post.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-card-foreground">{post.profiles?.full_name || 'Anonymous'}</p>
            <p className="text-sm text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-card-foreground whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Like
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" />
          Comment
        </Button>
      </CardFooter>
    </Card>
  );
}
