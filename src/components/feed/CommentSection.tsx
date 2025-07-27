
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { Separator } from '@/components/ui/separator';

interface CommentSectionProps {
  postId: string;
  initialCommentCount?: number;
}

export default function CommentSection({ postId, initialCommentCount = 0 }: CommentSectionProps) {
  const [showComments, setShowComments] = useState(false);
  const { comments, loading, creating, createComment, deleteComment } = useComments(postId);

  const commentCount = comments.length;

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleComments}
        className="text-muted-foreground hover:text-blue-500 p-0 h-auto"
      >
        <MessageCircle className="w-4 h-4 mr-1" />
        {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
        {showComments ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </Button>

      {showComments && (
        <div className="space-y-3">
          <Separator />
          
          {/* Comments List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Loading comments...</p>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={deleteComment}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {/* Comment Form */}
          <CommentForm onSubmit={createComment} creating={creating} />
        </div>
      )}
    </div>
  );
}
