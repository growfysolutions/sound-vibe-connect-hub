import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

// Define the types for a review and the reviewer's profile
type ReviewerProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: ReviewerProfile | null;
};

interface ReviewsProps {
  profileId: string;
}

const Reviews: React.FC<ReviewsProps> = ({ profileId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!profileId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer:profiles!reviews_reviewer_id_fkey (*)
        `)
        .eq('reviewee_id', profileId)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch reviews.');
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data as any[] as Review[]);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [profileId]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <p className="text-center text-muted-foreground py-8">This user has no reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={review.reviewer?.avatar_url || undefined} />
                <AvatarFallback>{review.reviewer?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{review.reviewer?.full_name || 'Anonymous'}</p>
                <p className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
          </CardHeader>
          {review.comment && (
            <CardContent>
              <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default Reviews;
