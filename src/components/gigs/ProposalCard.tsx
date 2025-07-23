
import { Database } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X } from 'lucide-react';

// Define the Proposal and Profile types based on the supabase schema
type Proposal = Database['public']['Tables']['proposals']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null;
};

interface ProposalCardProps {
  proposal: Proposal;
  onAccept: (proposal: Proposal) => void;
  onReject: (proposal: Proposal) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onAccept, onReject }) => {
  const profile = proposal.profiles;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
            <AvatarFallback>{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-semibold">{profile?.full_name || 'Anonymous'}</CardTitle>
            <CardDescription>Proposed Rate: ${proposal.rate}</CardDescription>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(proposal.created_at).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{proposal.message}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <CulturalButton size="sm" variant="culturalDestructive" onClick={() => onReject(proposal)}>
          <X className="w-4 h-4 mr-2" />
          Reject
        </CulturalButton>
        <CulturalButton size="sm" variant="cultural" onClick={() => onAccept(proposal)}>
          <Check className="w-4 h-4 mr-2" />
          Accept
        </CulturalButton>
      </CardFooter>
    </Card>
  );
};
