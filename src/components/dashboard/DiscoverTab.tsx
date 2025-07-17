
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProfessionalCard from './ProfessionalCard';
import ProfessionalCardSkeleton from './ProfessionalCardSkeleton';
import { Profile } from './UserProfileCard';
import { AdvancedFilterDrawer, AdvancedFilterValues } from './AdvancedFilterDrawer';

interface DiscoverTabProps {
  professionals: Profile[];
  pendingConnections: string[];
  handleConnect: (id: string) => void;
  handleSendMessage: (id: string) => void;
  handleSearch: (query: string) => void;
}

const DiscoverTab: React.FC<DiscoverTabProps> = ({ professionals, pendingConnections, handleConnect, handleSendMessage, handleSearch }) => {
  const { user } = useAuth();
  const [scores, setScores] = useState<{ [key: string]: any }>({});
  const [loadingScores, setLoadingScores] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      if (!user || professionals.length === 0) {
        setLoadingScores(false);
        return;
      }

      setLoadingScores(true);

      // Fetch current user's full profile
      const { data: currentUserProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching current user profile:', profileError);
        setLoadingScores(false);
        return;
      }

      const scorePromises = professionals.map(professional => 
        supabase.functions.invoke('compatibility-scorer', {
          body: { profile1: currentUserProfile, profile2: professional },
        })
      );

      const results = await Promise.allSettled(scorePromises);
      
      const newScores: { [key: string]: any } = {};
      results.forEach((result, index) => {
        const professionalId = professionals[index].id;
        if (result.status === 'fulfilled') {
          newScores[professionalId] = result.value.data;
        } else {
          console.error(`Error calculating score for ${professionalId}:`, result.reason);
          newScores[professionalId] = null; // Indicate error
        }
      });

      setScores(newScores);
      setLoadingScores(false);
    };

    fetchScores();
  }, [user, professionals]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-auto md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search by name, role, or genre..." 
            className="pl-10 w-full" 
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <AdvancedFilterDrawer 
            trigger={
              <Button variant="outline">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            }
            onApplyFilters={(filters: AdvancedFilterValues) => {
              // Apply advanced filtering logic here
              console.log('Advanced filters applied:', filters);
            }}
          />
        </div>
      </div>

      <div>
        {loadingScores ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <ProfessionalCardSkeleton key={i} />)}
          </div>
        ) : professionals.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {professionals.map((professional) => (
              <ProfessionalCard 
                key={professional.id} 
                professional={professional} 
                handleConnect={handleConnect}
                handleSendMessage={handleSendMessage}
                isPending={pendingConnections.includes(professional.id)}
                score={scores[professional.id]?.totalScore}
                scoreBreakdown={scores[professional.id]?.breakdown}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">No professionals found. Try adjusting your filters.</div>
        )}
      </div>
    </div>
  );
};

export default DiscoverTab;
