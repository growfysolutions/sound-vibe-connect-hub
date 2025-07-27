
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

interface CommentItemProps {
  comment: {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    };
  };
  onDelete: (commentId: string) => void;
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  const { user } = useAuth();
  const canDelete = user?.id === comment.user_id;

  return (
    <div className="flex space-x-3 py-2">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.profiles?.avatar_url || undefined} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {comment.profiles?.full_name?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm text-foreground">
            {comment.profiles?.full_name || 'Anonymous'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(comment.id)}
              className="text-muted-foreground hover:text-destructive p-1 h-auto"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
        <p className="text-sm text-foreground mt-1">{comment.content}</p>
      </div>
    </div>
  );
}
