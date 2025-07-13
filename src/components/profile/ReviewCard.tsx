
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { ReviewWithReviewer } from '@/types';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: ReviewWithReviewer;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={review.reviewer.avatar_url || ''} alt={review.reviewer.full_name || 'Reviewer'} />
            <AvatarFallback>{review.reviewer.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
                <p className="font-semibold">{review.reviewer.full_name}</p>
                <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(review.created_at), 'PPP')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
