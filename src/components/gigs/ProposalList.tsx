import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';
import { ProposalCard } from './ProposalCard';
import { toast } from 'sonner';

type Proposal = Database['public']['Tables']['proposals']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null;
};

interface ProposalListProps {
  gigId: number;
  gigTitle: string;
}

export const ProposalList: React.FC<ProposalListProps> = ({ gigId, gigTitle }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('proposals')
      .select('*, profiles(*)')
      .eq('gig_id', gigId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch proposals', { description: error.message });
    } else {
      setProposals(data as Proposal[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, [gigId]);

  const handleUpdateStatus = async (proposal: Proposal, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', proposal.id);

    if (error) {
      toast.error(`Failed to ${status} proposal`, { description: error.message });
    } else {
      toast.success(`Proposal ${status} successfully!`);

      // Create notification
      const { error: notificationError } = await supabase.from('notifications').insert({
        user_id: proposal.user_id,
        type: status === 'accepted' ? 'proposal_accepted' : 'proposal_rejected',
        data: {
          gigId: gigId,
          gigTitle: gigTitle,
        }
      });

      if (notificationError) {
        toast.error('Failed to send notification', { description: notificationError.message });
      }

      // Refresh the list to show the updated status
      setProposals(proposals.filter(p => p.id !== proposal.id));
    }
  };

  if (loading) {
    return <div>Loading proposals...</div>;
  }

  if (proposals.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No proposals submitted yet.</div>;
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold">Received Proposals</h3>
      {proposals.map(proposal => (
        <ProposalCard 
          key={proposal.id} 
          proposal={proposal} 
          onAccept={(p) => handleUpdateStatus(p, 'accepted')}
          onReject={(p) => handleUpdateStatus(p, 'rejected')}
        />
      ))}
    </div>
  );
};
