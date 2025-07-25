
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Calendar,
  MapPin,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type DatabaseGig = Database['public']['Tables']['gigs']['Row'];

interface Gig extends DatabaseGig {
  proposals_count: number;
  average_rating: number;
}

interface EscrowTransaction {
  id: string;
  gig_id: number;
  amount: number;
  status: 'pending' | 'funded' | 'released' | 'disputed';
  created_at: string;
  released_at?: string | null;
  dispute_reason?: string | null;
}

export const AdvancedGigManagement = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [escrowTransactions, setEscrowTransactions] = useState<EscrowTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [filters, setFilters] = useState({
    category: '',
    budget_min: '',
    budget_max: '',
    location: '',
    skills: '',
    sort: 'newest'
  });

  useEffect(() => {
    fetchGigs();
    fetchEscrowTransactions();
  }, [filters]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('gigs')
        .select('*');

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.budget_min) {
        query = query.gte('budget', parseInt(filters.budget_min));
      }
      if (filters.budget_max) {
        query = query.lte('budget', parseInt(filters.budget_max));
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Apply sorting
      switch (filters.sort) {
        case 'budget_high':
          query = query.order('budget', { ascending: false });
          break;
        case 'budget_low':
          query = query.order('budget', { ascending: true });
          break;
        case 'deadline':
          query = query.order('deadline', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get proposals count for each gig
      const gigsWithCounts = await Promise.all(
        (data || []).map(async (gig) => {
          const { data: proposalsData } = await supabase
            .from('proposals')
            .select('id')
            .eq('gig_id', gig.id);

          return {
            ...gig,
            proposals_count: proposalsData?.length || 0,
            average_rating: 0 // Mock value since reviews relation is complex
          };
        })
      );

      setGigs(gigsWithCounts);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      toast.error('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const fetchEscrowTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to match our EscrowTransaction interface
      const typedData: EscrowTransaction[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'funded' | 'released' | 'disputed'
      }));
      
      setEscrowTransactions(typedData);
    } catch (error) {
      console.error('Error fetching escrow transactions:', error);
    }
  };

  const initiateEscrow = async (gigId: number, amount: number) => {
    try {
      const { error } = await supabase
        .from('escrow_transactions')
        .insert([{
          gig_id: gigId,
          amount,
          status: 'pending'
        }]);

      if (error) throw error;
      
      toast.success('Escrow initiated successfully');
      fetchEscrowTransactions();
    } catch (error) {
      console.error('Error initiating escrow:', error);
      toast.error('Failed to initiate escrow');
    }
  };

  const releaseEscrow = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('escrow_transactions')
        .update({ 
          status: 'released',
          released_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) throw error;
      
      toast.success('Escrow released successfully');
      fetchEscrowTransactions();
    } catch (error) {
      console.error('Error releasing escrow:', error);
      toast.error('Failed to release escrow');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEscrowStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'funded': return 'text-blue-500';
      case 'released': return 'text-green-500';
      case 'disputed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const FilterSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="music_production">Music Production</SelectItem>
              <SelectItem value="mixing_mastering">Mixing & Mastering</SelectItem>
              <SelectItem value="live_performance">Live Performance</SelectItem>
              <SelectItem value="songwriting">Songwriting</SelectItem>
              <SelectItem value="vocal_work">Vocal Work</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Min Budget"
            type="number"
            value={filters.budget_min}
            onChange={(e) => setFilters({...filters, budget_min: e.target.value})}
          />

          <Input
            placeholder="Max Budget"
            type="number"
            value={filters.budget_max}
            onChange={(e) => setFilters({...filters, budget_max: e.target.value})}
          />

          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />

          <Input
            placeholder="Skills"
            value={filters.skills}
            onChange={(e) => setFilters({...filters, skills: e.target.value})}
          />

          <Select value={filters.sort} onValueChange={(value) => setFilters({...filters, sort: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="budget_high">Budget: High to Low</SelectItem>
              <SelectItem value="budget_low">Budget: Low to High</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const GigCard = ({ gig }: { gig: Gig }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{gig.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(gig.status || 'open')}>
                {(gig.status || 'open').replace('_', ' ').toUpperCase()}
              </Badge>
              <div className="flex items-center gap-1">
                <Shield className={`w-4 h-4 ${getEscrowStatusColor(gig.escrow_status || 'pending')}`} />
                <span className={`text-sm ${getEscrowStatusColor(gig.escrow_status || 'pending')}`}>
                  {(gig.escrow_status || 'pending').replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-lg font-bold text-green-600">
              <DollarSign className="w-5 h-5" />
              {gig.budget?.toLocaleString() || 'TBD'}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">{gig.description}</p>
        
        <div className="space-y-2 mb-4">
          {gig.deadline && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Deadline: {new Date(gig.deadline).toLocaleDateString()}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {gig.location || 'Remote'}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            {gig.proposals_count} proposals
          </div>
        </div>

        {gig.required_skills && (
          <div className="flex flex-wrap gap-2 mb-4">
            {gig.required_skills.map((skill, index) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
          {gig.status === 'open' && (
            <Button className="flex-1">
              Submit Proposal
            </Button>
          )}
          {gig.status === 'in_progress' && gig.escrow_status === 'pending' && gig.budget && (
            <Button 
              onClick={() => initiateEscrow(gig.id, gig.budget!)}
              className="flex-1"
            >
              Fund Escrow
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const EscrowDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Escrowed</p>
                <p className="text-2xl font-bold">
                  ${escrowTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Release</p>
                <p className="text-2xl font-bold">
                  {escrowTransactions.filter(t => t.status === 'funded').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {escrowTransactions.filter(t => t.status === 'released').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disputes</p>
                <p className="text-2xl font-bold">
                  {escrowTransactions.filter(t => t.status === 'disputed').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escrow Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {escrowTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Transaction #{transaction.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    Amount: ${transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getEscrowStatusColor(transaction.status)}>
                    {transaction.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {transaction.status === 'funded' && (
                    <Button 
                      size="sm"
                      onClick={() => releaseEscrow(transaction.id)}
                    >
                      Release Funds
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Gig Marketplace</h1>
        <p className="text-muted-foreground">
          Discover opportunities with secure escrow protection
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse Gigs</TabsTrigger>
          <TabsTrigger value="my_gigs">My Gigs</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="escrow">Escrow</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <FilterSection />
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my_gigs">
          <Card>
            <CardHeader>
              <CardTitle>My Posted Gigs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your posted gigs will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals">
          <Card>
            <CardHeader>
              <CardTitle>My Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your submitted proposals will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escrow">
          <EscrowDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
