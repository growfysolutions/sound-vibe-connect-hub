import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import { Gig } from '@/types'; // Assuming Gig type will be added to types/index.ts
import { formatDistanceToNow } from 'date-fns';

interface GigCardProps {
  gig: Gig;
}

export const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  const timeAgo = formatDistanceToNow(new Date(gig.created_at), { addSuffix: true });

  return (
    <Card className="flex flex-col h-full bg-card hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/20">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gradient-primary">{gig.title}</CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
          <Clock className="w-4 h-4 mr-2" /> Posted {timeAgo}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4 line-clamp-3">{gig.description}</p>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 mr-2 text-primary" /> {gig.location || 'Remote'}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4 mr-2 text-primary" /> Budget: {gig.budget ? `$${gig.budget}` : 'Not specified'}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="flex flex-wrap gap-2 mb-4">
          {gig.skills_required?.map((skill, index) => (
            <Badge key={index} variant="secondary">{skill}</Badge>
          ))}
        </div>
        <Button className="w-full btn-premium">View Details & Apply</Button>
      </CardFooter>
    </Card>
  );
};
