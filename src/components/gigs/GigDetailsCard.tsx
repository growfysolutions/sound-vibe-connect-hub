import { Database } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateProposalForm } from './CreateProposalForm';
import { ProposalList } from './ProposalList';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, MapPin, Tag, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

// Define the Gig type based on the supabase schema
type Gig = Database['public']['Tables']['gigs']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface GigDetailsCardProps {
  gig: Gig;
}

export const GigDetailsCard: React.FC<GigDetailsCardProps> = ({ gig }) => {
  const [poster, setPoster] = useState<Profile | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchPosterProfile = async () => {
      if (!gig.user_id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', gig.user_id)
        .single();

      if (error) {
        console.error('Error fetching poster profile:', error.message);
      } else {
        setPoster(data);
      }
    };

    fetchPosterProfile();

    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, [gig.user_id]);

  const handleProposalSubmitted = () => {
    // We can add logic here later, e.g., to show a confirmation or disable the button
    console.log('Proposal submitted!');
  };

  const isOwner = currentUser?.id === gig.user_id;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-gradient-primary">{gig.title}</CardTitle>
            <CardDescription className="flex items-center text-muted-foreground mt-2">
              <UserIcon className="w-4 h-4 mr-2" /> Posted by {poster?.full_name || '...'}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="capitalize">
            {gig.type?.replace(/_/g, ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{gig.description || 'No description provided.'}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-primary" />
            <span>{gig.budget ? `$${gig.budget}` : 'Not specified'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            <span>{gig.deadline ? new Date(gig.deadline).toLocaleDateString() : 'Not specified'}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            <span>{gig.location || 'Remote'}</span>
          </div>
        </div>

        {gig.skills_required && gig.skills_required.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {gig.skills_required.map((skill, index) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch">
        {isOwner ? (
          <ProposalList gigId={gig.id} gigTitle={gig.title} />
        ) : (
          <div className="flex justify-end">
            <CreateProposalForm gig={gig} onProposalSubmitted={handleProposalSubmitted}>
              <Button className="btn-premium">Submit a Proposal</Button>
            </CreateProposalForm>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
