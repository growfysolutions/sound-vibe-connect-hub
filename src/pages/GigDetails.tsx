import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, DollarSign, MapPin, User as UserIcon, ChevronsRight, Edit } from 'lucide-react';
import { toast } from 'sonner';

type Gig = Database['public']['Tables']['gigs']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

const GigDetails = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const navigate = useNavigate();
  const [gig, setGig] = useState<(Gig & { profiles: Profile | null }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGigAndUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      if (!gigId) {
        setLoading(false);
        return;
      }

      const numericGigId = parseInt(gigId, 10);
      if (isNaN(numericGigId)) {
        toast.error('Invalid Gig ID');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('gigs')
        .select(`
          *,
          profiles (*)
        `)
        .eq('id', numericGigId)
        .single();

      if (error || !data) {
        console.error('Error fetching gig details:', error);
        toast.error('Failed to load gig details.');
      } else {
        setGig(data as any);
      }
      setLoading(false);
    };

    fetchGigAndUser();
  }, [gigId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading gig details...</p></div>;
  }

  if (!gig) {
    return <div className="flex justify-center items-center h-screen"><p>Gig not found.</p></div>;
  }

  const isOwner = currentUserId === gig.user_id;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">{gig.title}</CardTitle>
              <CardDescription className="flex items-center text-muted-foreground">
                <UserIcon className="w-4 h-4 mr-2" />
                Posted by
                <Link to={`/profile/${gig.profiles?.id}`} className="ml-1 font-semibold text-primary hover:underline">
                  {gig.profiles?.full_name || 'A user'}
                </Link>
              </CardDescription>
            </div>
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={gig.profiles?.avatar_url || undefined} alt={gig.profiles?.full_name || 'User avatar'} />
              <AvatarFallback>{gig.profiles?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            {gig.budget && (
              <div className="flex items-center text-muted-foreground"><DollarSign className="w-4 h-4 mr-2" /> Budget: ${gig.budget}</div>
            )}
            {gig.deadline && (
              <div className="flex items-center text-muted-foreground"><Clock className="w-4 h-4 mr-2" /> Deadline: {new Date(gig.deadline).toLocaleDateString()}</div>
            )}
            {gig.location && (
              <div className="flex items-center text-muted-foreground"><MapPin className="w-4 h-4 mr-2" /> {gig.location}</div>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="prose dark:prose-invert max-w-none mb-6">{gig.description}</p>

          {gig.skills_required && gig.skills_required.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {gig.skills_required.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-8">
            {isOwner ? (
              <Button onClick={() => navigate(`/gigs/${gig.id}/proposals`)}>
                <ChevronsRight className="w-4 h-4 mr-2" />
                View Proposals
              </Button>
            ) : (
              <Button onClick={() => navigate(`/gigs/${gig.id}/propose`)}>
                <Edit className="w-4 h-4 mr-2" />
                Submit Proposal
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GigDetails;
