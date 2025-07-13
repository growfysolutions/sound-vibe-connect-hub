import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Milestone } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MilestoneListProps {
  contractId: string;
}

const MilestoneList = ({ contractId }: MilestoneListProps) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('contract_id', contractId)
        .order('due_date', { ascending: true });

      if (error) {
        toast.error('Failed to fetch milestones.');
        console.error('Error fetching milestones:', error);
      } else {
        setMilestones(data || []);
      }
      setLoading(false);
    };

    if (contractId) {
      fetchMilestones();
    }
  }, [contractId]);

  if (loading) {
    return <div className="p-4">Loading milestones...</div>;
  }

  return (
    <div className="space-y-4 p-4 bg-muted/20">
      <h4 className="text-lg font-semibold">Milestones</h4>
      {milestones.length > 0 ? (
        milestones.map((milestone) => (
          <Card key={milestone.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{milestone.title}</p>
                <p className="text-sm text-muted-foreground">Due: {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${milestone.amount.toLocaleString()}</p>
                <Badge variant={milestone.status === 'approved' ? 'default' : 'secondary'}>{milestone.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No milestones defined for this contract yet.</p>
      )}
    </div>
  );
};

export default MilestoneList;
