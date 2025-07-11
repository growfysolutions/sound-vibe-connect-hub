import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Users, Search, Gamepad2, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Import components
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import GameficationPanel from '@/components/dashboard/GameficationPanel';
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Project } from '@/components/dashboard/ProjectCard';
import { Profile } from '@/components/dashboard/UserProfileCard';
import MyProjectsTab from '@/components/dashboard/MyProjectsTab';
import { FeedTimeline } from '@/components/feed/FeedTimeline';
import DiscoverTab from '@/components/dashboard/DiscoverTab';
import { FilterValues } from '@/components/dashboard/FilterDrawer';
import NetworkTab from '@/components/dashboard/NetworkTab';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterValues>({ roles: [], experience: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProfessionals, setAllProfessionals] = useState<Profile[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Profile[]>([]);
  const [pendingConnections, setPendingConnections] = useState<string[]>([]);
  const [connections, setConnections] = useState<Profile[]>([]);

  const handleConnectionUpdate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await fetchConnections(user.id);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSendMessage = (id: string) => {
    const professional = allProfessionals.find(p => p.id === id);
    toast.info(`Opening message composer for ${professional?.full_name || 'user'}...`);
  };

  const handleViewProfile = (id: string) => {
    const professional = allProfessionals.find(p => p.id === id);
    toast.info(`Navigating to ${professional?.full_name || 'user'}'s profile...`);
    navigate(`/profile/${id}`);
  };

  const handleFindConnections = () => {
    toast.info('Searching for new connections...');
  };

  const handleConnect = async (addresseeId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to connect.');
      return;
    }

    if (user.id === addresseeId) {
      toast.error("You can't connect with yourself.");
      return;
    }

    const { error } = await supabase.from('connections').insert({
      requester_id: user.id,
      addressee_id: addresseeId,
      status: 'pending',
    });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast.error('Connection request already sent.');
      } else {
        toast.error('Failed to send connection request.');
        console.error('Error sending connection request:', error);
      }
    } else {
      const professional = allProfessionals.find(p => p.id === addresseeId);
      toast.success(`Connection request sent to ${professional?.full_name || 'user'}!`);
      setPendingConnections([...pendingConnections, addresseeId]);
    }
  };

  const handleSearch = (query: string) => {
    setActiveSearchQuery(query);
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
  };



  const fetchProfessionals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id); // Exclude the current user

    if (error) {
      toast.error('Could not fetch professionals.');
      console.error(error);
    } else {
      setAllProfessionals(data as Profile[]);
      setFilteredProfessionals(data as Profile[]);
    }
  };

  const fetchConnections = async (userId: string) => {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        requester:requester_id(id, full_name, username, role, location, avatar_url, is_online, is_verified, specialization, experience, tags),
        addressee:addressee_id(id, full_name, username, role, location, avatar_url, is_online, is_verified, specialization, experience, tags)
      `)
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) {
      toast.error('Could not fetch connections.');
      console.error(error);
    } else {
      const connectedProfiles = data.map((c: any) => {
        return c.requester.id === userId ? c.addressee : c.requester;
      }).filter(p => p.id !== userId);
      setConnections(connectedProfiles as Profile[]);
    }
  };

  const fetchPendingConnections = async (userId: string) => {
    const { data, error } = await supabase
      .from('connections')
      .select('addressee_id')
      .eq('requester_id', userId)
      .eq('status', 'pending');

    if (error) {
      toast.error('Could not fetch pending connections.');
      console.error(error);
    } else {
      setPendingConnections(data.map(c => c.addressee_id));
    }
  };

  const fetchProjects = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userData.user.id);

    if (error) {
      toast.error('Could not fetch projects.');
      console.error(error);
    } else {
      if (data) {
        const transformedProjects: Project[] = data.map((project) => ({
          id: project.id,
          title: project.title,
          artist: project.artist,
          role: project.role,
          thumbnail: project.thumbnail || '🎵',
          plays: String(project.plays || 0),
          likes: String(project.likes || 0),
          duration: project.duration || '0:00',
          genre: project.genre || 'Unknown',
          isCollaborative: project.is_collaborative || false,
        }));
        setProjects(transformedProjects);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await Promise.all([
          fetchProjects(),
          fetchProfessionals(),
          fetchPendingConnections(user.id),
          fetchConnections(user.id)
        ]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let results = [...allProfessionals];

    if (activeSearchQuery) {
      const lowercasedQuery = activeSearchQuery.toLowerCase();
      results = results.filter(prof => 
        prof.full_name?.toLowerCase().includes(lowercasedQuery) ||
        prof.username?.toLowerCase().includes(lowercasedQuery) ||
        prof.role?.toLowerCase().includes(lowercasedQuery) ||
        prof.tags?.some(tag => tag.toLowerCase().includes(lowercasedQuery))
      );
    }

    if (activeFilters.roles.length > 0) {
      results = results.filter(prof => activeFilters.roles.includes(prof.role));
    }

    if (activeFilters.experience) {
      results = results.filter(prof => prof.experience === activeFilters.experience);
    }

    setFilteredProfessionals(results);
  }, [activeSearchQuery, activeFilters, allProfessionals]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav 
        searchQuery={activeSearchQuery} 
        setSearchQuery={setActiveSearchQuery} 
        handleOpenModal={handleOpenModal}
        onConnectionUpdate={handleConnectionUpdate}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UserProfileCard />
            <ActivityFeed />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="feed" className="w-full">
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
                <TabsTrigger value="gamification" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Progress
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed">
                <FeedTimeline />
              </TabsContent>

              <TabsContent value="discover">
                <DiscoverTab 
                  professionals={filteredProfessionals} 
                  pendingConnections={pendingConnections}
                  handleConnect={handleConnect}
                  handleSendMessage={handleSendMessage}
                  handleSearch={handleSearch}
                  onApplyFilters={handleApplyFilters}
                />
              </TabsContent>

              <TabsContent value="projects">
                <MyProjectsTab projects={projects} handleOpenModal={handleOpenModal} />
              </TabsContent>

              <TabsContent value="network">
                <NetworkTab 
                  professionals={connections}
                  handleFindConnections={handleFindConnections}
                  handleViewProfile={handleViewProfile}
                  handleSendMessage={handleSendMessage}
                />
              </TabsContent>

              <TabsContent value="gamification">
                <GameficationPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <CreateProjectModal isOpen={isModalOpen} onClose={handleCloseModal} onProjectCreated={fetchProjects} />
    </div>
  );
};

export default Dashboard;

