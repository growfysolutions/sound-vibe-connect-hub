import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Gig } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, ArrowLeft, DollarSign, Clock } from 'lucide-react';
import { CreateGigForm } from '@/components/gigs/CreateGigForm';
import { GigDetailsCard } from '@/components/gigs/GigDetailsCard';

const Marketplace = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

  const fetchGigs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gigs:', error.message);
    } else {
      setGigs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  if (selectedGig) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Button variant="ghost" onClick={() => setSelectedGig(null)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gigs
        </Button>
        <GigDetailsCard gig={selectedGig} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-primary">Gig Marketplace</h1>
          <p className="text-muted-foreground mt-2">Discover your next collaboration or find the perfect talent.</p>
        </div>
        <CreateGigForm onGigCreated={fetchGigs}>
          <Button className="btn-premium mt-4 md:mt-0">
            <PlusCircle className="w-4 h-4 mr-2" />
            Post a Gig
          </Button>
        </CreateGigForm>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-lg" />
          ))}
        </div>
      ) : gigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <Card key={gig.id} onClick={() => setSelectedGig(gig)} className="cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate pr-2">{gig.title}</CardTitle>
                  <Badge variant="outline" className="capitalize whitespace-nowrap">{gig.type?.replace(/_/g, ' ')}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-2 h-[40px]">{gig.description || 'No description available.'}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4 mr-2" /> {gig.budget ? `$${gig.budget}` : 'N/A'}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" /> {gig.deadline ? new Date(gig.deadline).toLocaleDateString() : 'N/A'}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium text-muted-foreground">No gigs posted yet.</h3>
          <p className="text-sm text-muted-foreground my-2">Be the first to create an opportunity!</p>
          <CreateGigForm onGigCreated={fetchGigs}>
            <Button className="mt-4">
              <PlusCircle className="w-4 h-4 mr-2" />
              Post a Gig
            </Button>
          </CreateGigForm>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
