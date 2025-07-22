
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
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
                onNavigateToMessages={() => {
                  navigate('/messages');
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
    <div className="dashboard-container h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-saffron/5">
      <OfflineIndicator />
      
      {/* Three-Column Layout Structure */}
      <div className="flex h-full">
        {/* Sidebar: 280px fixed */}
        <div className="sidebar w-80 flex-shrink-0">
          <DashboardSidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNavigateToMessages={() => navigate('/messages')}
          />
        </div>

        {/* Main Content: flex-1 */}
        <div className="main-content flex-1 flex flex-col overflow-hidden">
          {/* Header: 64px fixed height */}
          <div className="header h-16 flex-shrink-0 border-b border-saffron/20 bg-gradient-to-r from-card/98 to-background/95 backdrop-blur-xl">
            <DashboardNav 
              searchQuery={activeSearchQuery} 
              setSearchQuery={setActiveSearchQuery} 
              handleOpenModal={handleOpenModal}
            />
          </div>

          {/* Content Area: flex-1 with overflow */}
          <div className="content-area flex-1 flex gap-6 p-6 overflow-hidden">
            {/* Feed Column: flex-1 */}
            <div className="feed-column flex-1 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="feed" className="mt-0"><FeedTimeline /></TabsContent>
                <TabsContent value="discover" className="mt-0">
                  <DiscoverTab 
                    professionals={filteredProfessionals} 
                    pendingConnections={pendingConnections}
                    handleConnect={handleConnect}
                    handleSendMessage={handleSendMessage}
                    handleSearch={setDiscoverSearchQuery}
                  />
                </TabsContent>
                <TabsContent value="projects" className="mt-0">
                  <MyProjectsTab projects={projects} handleOpenModal={handleOpenModal} />
                </TabsContent>
                <TabsContent value="network" className="mt-0">
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
                <TabsContent value="progress" className="mt-0">
                  <ProgressPanel connectionsCount={connections.length} projectsCount={projects.length} />
                </TabsContent>
                <TabsContent value="contracts" className="mt-0"><MyContracts /></TabsContent>
                <TabsContent value="recommendations" className="mt-0"><RecommendationEngine /></TabsContent>
                <TabsContent value="analytics" className="mt-0"><AnalyticsDashboard /></TabsContent>
              </Tabs>
            </div>

            {/* Right Panel: 320px fixed (only show on feed tab) */}
            {activeTab === 'feed' && (
              <div className="right-panel w-80 flex-shrink-0 overflow-y-auto">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-card/95 to-background/90 backdrop-blur-sm rounded-lg border border-saffron/20 p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">My Musical Journey</h3>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-saffron/10 to-amber-500/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Level 1: Rising Star</span>
                          <span className="text-xs text-muted-foreground">0 / 1000 XP</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mb-2">
                          <div className="bg-gradient-to-r from-saffron to-amber-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: 'serif' }}>
                          ਪੱਚ 1: ਨਵਾਂ ਸਿਤਾਰਾ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={handleCloseModal} onProjectCreated={fetchProjects} />
    </div>
  );
};

export default Dashboard;
