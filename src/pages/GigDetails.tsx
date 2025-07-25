
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, DollarSign, MapPin, User as UserIcon, ChevronsRight, Edit, ArrowLeft, Home } from 'lucide-react';
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

  const handleBack = () => {
    // Check if user came from marketplace or dashboard
    const referrer = document.referrer;
    if (referrer.includes('/marketplace')) {
      navigate('/marketplace');
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-foreground">Loading gig details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-foreground">Gig not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = currentUserId === gig.user_id;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Bar */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4 hover:bg-muted">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4 hover:bg-muted">
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <nav className="text-sm text-foreground">
            <span className="text-muted-foreground">Dashboard</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-muted-foreground">Gigs</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{gig.title}</span>
          </nav>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold mb-2 text-foreground">{gig.title}</CardTitle>
                <CardDescription className="flex items-center text-foreground">
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
                <div className="flex items-center text-foreground">
                  <DollarSign className="w-4 h-4 mr-2 text-primary" /> 
                  <span className="font-medium">Budget: ${gig.budget}</span>
                </div>
              )}
              {gig.deadline && (
                <div className="flex items-center text-foreground">
                  <Clock className="w-4 h-4 mr-2 text-primary" /> 
                  <span className="font-medium">Deadline: {new Date(gig.deadline).toLocaleDateString()}</span>
                </div>
              )}
              {gig.location && (
                <div className="flex items-center text-foreground">
                  <MapPin className="w-4 h-4 mr-2 text-primary" /> 
                  <span className="font-medium">{gig.location}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Description</h3>
              <p className="text-foreground leading-relaxed">{gig.description}</p>
            </div>

            {gig.skills_required && gig.skills_required.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 text-foreground">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {gig.skills_required.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-foreground bg-secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-8">
              {isOwner ? (
                <Button 
                  onClick={() => navigate(`/gigs/${gig.id}/proposals`)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ChevronsRight className="w-4 h-4 mr-2" />
                  View Proposals
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate(`/gigs/${gig.id}/propose`)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Submit Proposal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GigDetails;
