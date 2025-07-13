import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Music, Users, Search, Gamepad2, TrendingUp, Briefcase, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { addXp, XP_AMOUNTS } from '@/lib/xp';

// Import components
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import ProgressPanel from '@/components/dashboard/ProgressPanel';
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';
import DashboardNav from '@/components/dashboard/DashboardNav';
import MyProjectsTab from '@/components/dashboard/MyProjectsTab';
import MyContracts from '@/pages/MyContracts';
import { FeedTimeline } from '@/components/feed/FeedTimeline';
import DiscoverTab from '@/components/dashboard/DiscoverTab';
import NetworkTab from '@/components/dashboard/NetworkTab';


// Import types
import { Profile, Connection, Project } from '@/integrations/supabase/types';

const Dashboard = () => {
  const { refetchProfile } = useProfile();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for Discover tab
  const [allProfessionals, setAllProfessionals] = useState<Profile[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Profile[]>([]);
  const [discoverSearchQuery, setDiscoverSearchQuery] = useState('');

  const [pendingConnections, setPendingConnections] = useState<string[]>([]);

  // State for Network tab
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Connection[]>([]);
  const [networkSearchQuery, setNetworkSearchQuery] = useState('');

  // State for Projects tab
  const [projects, setProjects] = useState<Project[]>([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSendMessage = (profileId: string) => {
    toast.info(`Navigating to chat with user ${profileId}...`);
    navigate('/messages');
  };

  const handleViewProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const handleFindConnections = () => {
    setActiveTab('discover');
  };

  const handleConnect = async (user2Id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to connect.');
      return;
    }

    setPendingConnections(prev => [...prev, user2Id]);

    const { error } = await supabase.from('connections').insert({
      requester_id: user.id,
      addressee_id: user2Id,
      status: 'pending',
    });

    if (error) {
      toast.error(error.message);
      setPendingConnections(prev => prev.filter(id => id !== user2Id));
    } else {
      toast.success('Connection request sent!');
    }
  };

  const handleRequestAction = useCallback(async (connection: Connection, newStatus: 'accepted' | 'declined') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (newStatus === 'declined') {
      const { error } = await supabase.from('connections').delete().eq('id', connection.id);
      if (error) {
        toast.error('Failed to decline request.');
      } else {
        toast.success('Connection request declined.');
        setIncomingRequests(prev => prev.filter(req => req.id !== connection.id));
      }
      return;
    }

    const { error } = await supabase
      .from('connections')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', connection.id);

    if (error) {
      toast.error(`Failed to ${newStatus} request.`);
    } else {
      toast.success(`Connection request ${newStatus}.`);
      if (newStatus === 'accepted') {
        await addXp(user.id, XP_AMOUNTS.NEW_CONNECTION);
        if (connection.requester_id) {
          await addXp(connection.requester_id, XP_AMOUNTS.NEW_CONNECTION);
        }
        refetchProfile();
      }
      setIncomingRequests(prev => prev.filter(req => req.id !== connection.id));
      // Refetch connections to update the network tab
      const { data: updatedConnections } = await supabase.rpc('get_connections', { p_user_id: user.id });
      if (updatedConnections) setConnections(updatedConnections);
    }
  }, [refetchProfile]);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) {
      console.error('Error fetching projects:', error);
      toast.error('Could not fetch your projects.');
    } else {
      setProjects(data || []);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // Fetch professionals for Discover tab
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('profiles')
        .select('*, professional_roles:profiles_professional_roles(roles(name)))')
        .neq('id', user.id);

      if (professionalsError) {
        console.error('Error fetching professionals:', professionalsError);
      } else if (professionalsData) {
        const profiles = professionalsData.map(p => ({
          ...p,
          professional_roles: p.professional_roles.map((pr: any) => pr.roles.name)
        })) as Profile[];
        setAllProfessionals(profiles);
        setFilteredProfessionals(profiles);
      }

      // Fetch accepted connections
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select('*, requester:profiles!connections_requester_id_fkey(*), addressee:profiles!connections_addressee_id_fkey(*)')
        .in('status', ['accepted'])
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      if (connectionsError) {
        console.error('Error fetching connections:', connectionsError);
      } else if (connectionsData) {
        setConnections(connectionsData as Connection[]);
        setFilteredConnections(connectionsData as Connection[]);
      }

      // Fetch incoming connection requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('connections')
        .select('*, requester:profiles!connections_requester_id_fkey(*)')
        .eq('addressee_id', user.id)
        .eq('status', 'pending');

      if (requestsError) {
        console.error('Error fetching incoming requests:', requestsError);
      } else if (requestsData) {
        setIncomingRequests(requestsData as Connection[]);
      }

      // Fetch pending sent requests
      const { data: pendingData, error: pendingError } = await supabase
        .from('connections')
        .select('addressee_id')
        .eq('requester_id', user.id)
        .eq('status', 'pending');

      if (pendingError) {
        console.error('Error fetching pending connections:', pendingError);
      } else if (pendingData) {
        setPendingConnections(pendingData.map(c => c.addressee_id));
      }

      fetchProjects();
    };

    fetchInitialData();
  }, [fetchProjects]);

  // Effect for filtering network connections
  useEffect(() => {
    let results = connections;
    if (networkSearchQuery) {
      const lowercasedQuery = networkSearchQuery.toLowerCase();
      results = results.filter(conn => {
        if (!conn.requester || !conn.addressee) return false;
        const profile = conn.requester_id === user?.id ? conn.addressee : conn.requester;
        if (!profile) return false;
        return (
          profile.full_name?.toLowerCase().includes(lowercasedQuery) ||
          profile.username?.toLowerCase().includes(lowercasedQuery)
        );
      });
    }
    setFilteredConnections(results);
  }, [connections, networkSearchQuery, user]);

  // Filtering logic for Discover tab
  useEffect(() => {
    let results = [...allProfessionals];
    if (discoverSearchQuery) {
      const lowercasedQuery = discoverSearchQuery.toLowerCase();
      results = results.filter(prof =>
        prof.full_name?.toLowerCase().includes(lowercasedQuery) ||
        prof.username?.toLowerCase().includes(lowercasedQuery) ||
        prof.professional_roles?.some((role: string) => role.toLowerCase().includes(lowercasedQuery))
      );
    }
    // Apply other filters
    setFilteredProfessionals(results);
  }, [discoverSearchQuery, allProfessionals]);

  // Filtering logic for Network tab
  useEffect(() => {
    let results = [...connections];
    if (networkSearchQuery) {
      const lowercasedQuery = networkSearchQuery.toLowerCase();
      results = results.filter(conn => {
        if (!conn.requester || !conn.addressee) return false;
        const profile = conn.requester_id === user?.id ? conn.addressee : conn.requester;
        if (!profile) return false;
        return (
          profile.full_name?.toLowerCase().includes(lowercasedQuery) ||
          profile.username?.toLowerCase().includes(lowercasedQuery) ||
          profile.professional_roles?.some((role: string) => role.toLowerCase().includes(lowercasedQuery))
        );
      });
    }
    setFilteredConnections(results);
  }, [networkSearchQuery, connections]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav 
        searchQuery={activeSearchQuery} 
        setSearchQuery={setActiveSearchQuery} 
        handleOpenModal={handleOpenModal}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <UserProfileCard />
            <ActivityFeed />
          </div>
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-card/80 backdrop-blur-md mb-8 w-full justify-start border border-border/50">
                                <TabsTrigger value="feed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Feed
                </TabsTrigger>
                <TabsTrigger value="discover" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Search className="w-4 h-4 mr-2" />
                  Discover
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Music className="w-4 h-4 mr-2" />
                  My Projects
                </TabsTrigger>
                <TabsTrigger value="network" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  Network
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="contracts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Briefcase className="w-4 h-4 mr-2" />
                  My Contracts
                </TabsTrigger>
                <TabsTrigger value="messages" onClick={() => navigate('/messages')} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>
              <TabsContent value="feed"><FeedTimeline /></TabsContent>
              <TabsContent value="discover">
                <DiscoverTab 
                  professionals={filteredProfessionals} 
                  pendingConnections={pendingConnections}
                  handleConnect={handleConnect}
                  handleSendMessage={handleSendMessage}
                  handleSearch={setDiscoverSearchQuery}
                  
                />
              </TabsContent>
              <TabsContent value="projects">
                <MyProjectsTab projects={projects} handleOpenModal={handleOpenModal} />
              </TabsContent>
              <TabsContent value="network">
                <NetworkTab
                  connections={filteredConnections
                    .map(conn => (conn.requester_id === user?.id ? conn.addressee : conn.requester))
                    .filter((p): p is Profile => !!p)}
                  incomingRequests={incomingRequests.map(req => req.requester).filter((p): p is Profile => !!p)}
                  handleRequestAction={(connectionId, status) => {
                    const connection = incomingRequests.find(req => req.id === connectionId);
                    if (connection) {
                      handleRequestAction(connection, status);
                    }
                  }}
                  searchQuery={networkSearchQuery}
                  setSearchQuery={setNetworkSearchQuery}
                  handleFindConnections={handleFindConnections}
                  handleViewProfile={handleViewProfile}
                  handleSendMessage={handleSendMessage}
                />
              </TabsContent>
              <TabsContent value="progress">
                <ProgressPanel connectionsCount={connections.length} projectsCount={projects.length} />
              </TabsContent>
              <TabsContent value="contracts"><MyContracts /></TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <CreateProjectModal isOpen={isModalOpen} onClose={handleCloseModal} onProjectCreated={fetchProjects} />
    </div>
  );
};

export default Dashboard;