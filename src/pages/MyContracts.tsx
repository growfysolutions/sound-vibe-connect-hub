import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Contract } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MilestoneList from '@/components/MilestoneList';
import ReviewModal from '@/components/dashboard/ReviewModal';

const MyContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    const fetchUserAndContracts = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error('You must be logged in to view contracts.');
        setLoading(false);
        return;
      }
      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          gigs ( title ),
          client:profiles!contracts_client_id_fkey ( * ),
          professional:profiles!contracts_professional_id_fkey ( * )
        `)
        .or(`client_id.eq.${user.id},professional_id.eq.${user.id}`);

      if (error) {
        toast.error('Failed to fetch contracts.');
        console.error('Error fetching contracts:', error);
      } else {
        setContracts(data as any as Contract[] || []);
      }
      setLoading(false);
    };

    fetchUserAndContracts();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading your contracts...</div>;
  }

  const getPartner = (contract: Contract) => {
    return contract.client_id === currentUserId ? contract.professional : contract.client;
  };

  const toggleMilestones = (contractId: string) => {
    setExpandedContractId(prevId => (prevId === contractId ? null : contractId));
  };

  const handleOpenReviewModal = (contract: Contract) => {
    setSelectedContract(contract);
    setReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    toast.success('Your review has been submitted!');
    // Optionally, you can refresh the contracts list here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Contracts</h1>
      <p className="text-muted-foreground mb-6">View and manage all your active and past contracts.</p>

      <div className="space-y-6">
        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          contract={selectedContract}
          onReviewSubmitted={handleReviewSubmitted}
        />
        {contracts.length > 0 ? (
          contracts.map((contract) => {
            const partner = getPartner(contract);
            return (
              <div key={contract.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{contract.gigs?.title || 'Untitled Gig'}</CardTitle>
                      <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                        {contract.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center pt-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={partner?.avatar_url || undefined} alt={partner?.full_name || 'N/A'} />
                        <AvatarFallback>{partner?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      Contract with {partner?.full_name || 'Anonymous'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 grid md:grid-cols-3 gap-4">
                      <div>
                          <p className="text-sm font-semibold text-muted-foreground">Total Amount</p>
                          <p className="text-xl font-bold text-primary">${contract.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                          <p className="text-sm font-semibold text-muted-foreground">Start Date</p>
                          <p>{contract.start_date ? new Date(contract.start_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                          <p className="text-sm font-semibold text-muted-foreground">End Date</p>
                          <p>{contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 p-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => toggleMilestones(contract.id)}>
                      {expandedContractId === contract.id ? 'Hide Milestones' : 'View Milestones'}
                    </Button>
                    {contract.status === 'completed' && (
                      <Button onClick={() => handleOpenReviewModal(contract)}>Leave Review</Button>
                    )}
                  </CardFooter>
                </Card>
                {expandedContractId === contract.id && <MilestoneList contractId={contract.id} />}
              </div>
            )
          })
        ) : (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">You don't have any contracts yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyContracts;
