import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { addXp, XP_AMOUNTS } from '@/lib/xp';
import { useIsMobile } from '@/hooks/use-mobile';

// Import components
import ProgressPanel from '@/components/dashboard/ProgressPanel';
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import MyProjectsTab from '@/components/dashboard/MyProjectsTab';
import MyContracts from '@/pages/MyContracts';
import { FeedTimeline } from '@/components/feed/FeedTimeline';
import DiscoverTab from '@/components/dashboard/DiscoverTab';
import NetworkTab from '@/components/dashboard/NetworkTab';
import { RecommendationEngine } from '@/components/dashboard/RecommendationEngine';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { OfflineIndicator } from '@/components/dashboard/OfflineIndicator';
import { TodaysInspirationWidget } from '@/components/dashboard/TodaysInspirationWidget';
import { MusicalJourneyWidget } from '@/components/dashboard/MusicalJourneyWidget';

// Import types
import { Profile, Connection, Project } from '@/types';

const Dashboard = () => {
  const { refetchProfile } = useProfile();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // State for Discover tab
  const [allProfessionals, setAllProfessionals] = useState<Profile[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Profile[]>([]);
  const [discoverSearchQuery, setDiscoverSearchQuery] = useState('');

  const [pendingConnections, setPendingConnections] = useState<string[]>([]);

  // State for Network tab
  const [connections, setConnections] = useState<Connection[]>([]);
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
      const { data: updatedConnections } = await supabase
        .from('connections')
        .select('*')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted');
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

      // Fetch professionals for Discover tab - simplified query
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      if (professionalsError) {
        console.error('Error fetching professionals:', professionalsError);
      } else if (professionalsData) {
        setAllProfessionals(professionalsData as Profile[]);
        setFilteredProfessionals(professionalsData as Profile[]);
      }

      // Fetch accepted connections - simplified
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select('*')
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      if (connectionsError) {
        console.error('Error fetching connections:', connectionsError);
      } else if (connectionsData) {
        setConnections(connectionsData);
      }

      // Fetch incoming connection requests - simplified
      const { data: requestsData, error: requestsError } = await supabase
        .from('connections')
        .select('*')
        .eq('addressee_id', user.id)
        .eq('status', 'pending');

      if (requestsError) {
        console.error('Error fetching incoming requests:', requestsError);
      } else if (requestsData) {
        setIncomingRequests(requestsData);
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

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-saffron/5">
        <OfflineIndicator />
        
        <MobileHeader 
          searchQuery={activeSearchQuery}
          setSearchQuery={setActiveSearchQuery}
          onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {isMobileSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-80 z-50 animate-slide-in-left">
              <DashboardSidebar 
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </>
        )}

        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    connections={[]}
                    incomingRequests={[]}
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
                <TabsContent value="recommendations"><RecommendationEngine /></TabsContent>
                <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <MobileBottomNav 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <CreateProjectModal isOpen={isModalOpen} onClose={handleCloseModal} onProjectCreated={fetchProjects} />
      </div>
    );
  }

  return (
    <div className="dashboard-unified-theme">
      <OfflineIndicator />
      
      {/* Three-Column Grid Layout */}
      <div className="dashboard-grid">
        {/* Left Sidebar: 280px fixed */}
        <div className="left-sidebar">
          <DashboardSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Main Content: flex-1 */}
        <div className="main-content">
          {/* Header: 64px fixed height */}
          <div className="dashboard-header">
            <DashboardNav 
              searchQuery={activeSearchQuery} 
              setSearchQuery={setActiveSearchQuery} 
              handleOpenModal={handleOpenModal}
            />
          </div>

          {/* Content Area: flex-1 with overflow */}
          <div className="main-content-area">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
              <TabsContent value="feed" className="h-full"><FeedTimeline /></TabsContent>
              <TabsContent value="discover" className="h-full">
                <DiscoverTab 
                  professionals={filteredProfessionals} 
                  pendingConnections={pendingConnections}
                  handleConnect={handleConnect}
                  handleSendMessage={handleSendMessage}
                  handleSearch={setDiscoverSearchQuery}
                />
              </TabsContent>
              <TabsContent value="projects" className="h-full">
                <MyProjectsTab projects={projects} handleOpenModal={handleOpenModal} />
              </TabsContent>
              <TabsContent value="network" className="h-full">
                <NetworkTab
                  connections={[]}
                  incomingRequests={[]}
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
              <TabsContent value="progress" className="h-full">
                <ProgressPanel connectionsCount={connections.length} projectsCount={projects.length} />
              </TabsContent>
              <TabsContent value="contracts" className="h-full"><MyContracts /></TabsContent>
              <TabsContent value="recommendations" className="h-full"><RecommendationEngine /></TabsContent>
              <TabsContent value="analytics" className="h-full"><AnalyticsDashboard /></TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Sidebar: 320px fixed */}
        <div className="right-sidebar">
          <div className="right-sidebar-content">
            <TodaysInspirationWidget />
            <MusicalJourneyWidget />
          </div>
        </div>
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={handleCloseModal} onProjectCreated={fetchProjects} />
    </div>
  );
};

export default Dashboard;
