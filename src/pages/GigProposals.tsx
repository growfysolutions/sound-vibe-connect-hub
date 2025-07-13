import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


import { Proposal, Profile } from '@/types';

export interface ProposalWithProfile extends Proposal {
  profiles: Pick<Profile, 'full_name' | 'avatar_url' | 'username'> | null;
}

const GigProposals = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const [proposals, setProposals] = useState<ProposalWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [gigTitle, setGigTitle] = useState('');

  const fetchGigDetails = async (id: number) => {
    const { data, error } = await supabase
      .from('gigs')
      .select('title')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Failed to fetch gig details.');
    } else if (data) {
      setGigTitle(data.title);
    }
  };

  const fetchProposals = async (id: number) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        profiles (
          full_name,
          avatar_url,
          username
        )
      `)
      .eq('gig_id', id);

    if (error) {
      toast.error('Failed to fetch proposals.');
      console.error('Error fetching proposals:', error);
    } else if (data) {
      setProposals(data as any as ProposalWithProfile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (gigId) {
      const numericGigId = parseInt(gigId, 10);
      if (!isNaN(numericGigId)) {
        fetchGigDetails(numericGigId);
        fetchProposals(numericGigId);
      }
    }
  }, [gigId]);

  const handleUpdateProposalStatus = async (proposalId: number, status: 'accepted' | 'rejected') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in.');
      return;
    }

    // First, verify the current user is the owner of the gig
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    const { data: gigOwner, error: ownerError } = await supabase
      .from('gigs')
      .select('user_id')
      .eq('id', proposal.gig_id)
      .single();

    if (ownerError || gigOwner.user_id !== user.id) {
      toast.error('You are not authorized to manage this proposal.');
      return;
    }

    const { error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', proposalId);

    if (error) {
      toast.error(`Failed to ${status === 'accepted' ? 'accept' : 'reject'} proposal.`);
      console.error('Error updating proposal:', error);
    } else {
      toast.success(`Proposal has been ${status}.`);

      if (status === 'accepted') {
        // Create a contract
        const { error: contractError } = await supabase.from('contracts').insert({
          gig_id: proposal.gig_id,
          proposal_id: proposal.id,
          client_id: user.id,
          professional_id: proposal.user_id,
          terms: proposal.message,
          total_amount: proposal.proposed_rate, // Corrected field
          status: 'pending_signature' // Corrected status
        });

        if (contractError) {
          toast.error('Failed to create contract.');
          console.error('Error creating contract:', contractError);
          // Optionally, revert the proposal status update here
          return; // Stop further execution if contract fails
        }
        toast.success('Contract has been created!');
      }

      // Create notification for the user who submitted the proposal
      if (proposal.user_id) {
        const notificationType = status === 'accepted' ? 'proposal_accepted' : 'proposal_rejected';
        const { error: notificationError } = await supabase.from('notifications').insert({
          user_id: proposal.user_id,
          type: notificationType,
          data: {
            gigId: proposal.gig_id,
            gigTitle: gigTitle,
            proposalId: proposal.id,
          }
        });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
          // Don't block the UI for this, but log it
        }
      }

      // Refresh the proposals list
      if (gigId) {
        const numericGigId = parseInt(gigId, 10);
        if (!isNaN(numericGigId)) {
          fetchProposals(numericGigId);
        }
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading proposals...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Proposals for \"{gigTitle}\"</h1>
      <p className="text-muted-foreground mb-6">Review and manage proposals submitted by professionals.</p>
      
      <div className="space-y-4">
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={proposal.profiles?.avatar_url || ''} />
                      <AvatarFallback>{proposal.profiles?.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{proposal.profiles?.full_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">@{proposal.profiles?.username}</p>
                    </div>
                  </div>
                  <Badge variant={
                    proposal.status === 'pending' ? 'secondary' :
                    proposal.status === 'accepted' ? 'default' :
                    'destructive'
                  }>
                    {proposal.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="prose dark:prose-invert mb-4">{proposal.message}</p>
                {proposal.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button onClick={() => handleUpdateProposalStatus(proposal.id, 'accepted')}>
                      Accept
                    </Button>
                    <Button variant="outline" onClick={() => handleUpdateProposalStatus(proposal.id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No proposals have been submitted for this gig yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GigProposals;
