
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ArtistProfileCard } from '@/components/cards/ArtistProfileCard';
import ProfessionalCardSkeleton from './ProfessionalCardSkeleton';
import { Profile } from './UserProfileCard';
import { AdvancedFilterDrawer } from './AdvancedFilterDrawer';

interface DiscoverTabProps {
  professionals: Profile[];
  pendingConnections: string[];
  handleConnect: (id: string) => void;
  handleSendMessage: (id: string) => void;
  handleSearch: (query: string) => void;
}

const DiscoverTab: React.FC<DiscoverTabProps> = ({ professionals, handleConnect, handleSendMessage, handleSearch }) => {
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
            onApplyFilters={(filters) => {
              console.log('Applied filters:', filters);
              // TODO: Implement advanced filtering logic
            }}
            onResetFilters={() => {
              console.log('Reset filters');
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
              <ArtistProfileCard 
                key={professional.id} 
                artist={{
                  id: professional.id,
                  name: professional.full_name || professional.username || 'Unknown',
                  avatar: professional.avatar_url || '',
                  role: professional.role || 'Musician',
                  location: professional.location || '',
                   skills: professional.genres ? 
                     (Array.isArray(professional.genres) ? 
                       professional.genres : 
                       (professional.genres as string).split(',').map((g: string) => g.trim())
                     ) : [],
                  rating: scores[professional.id]?.totalScore || 0,
                  reviewCount: 10,
                  experience: '2+ years',
                  recentWork: 'Latest project',
                  isVerified: true,
                  collaborations: 5
                }}
                onConnect={() => handleConnect(professional.id)}
                onViewProfile={() => handleSendMessage(professional.id)}
                onSave={(id) => console.log('Saved artist:', id)}
                onShare={(id) => console.log('Shared artist:', id)}
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
