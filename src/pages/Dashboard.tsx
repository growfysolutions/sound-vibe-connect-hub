

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { findOrCreateDirectConversation } from '@/utils/conversationHelpers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardRightSidebar } from '@/components/dashboard/DashboardRightSidebar';
import { ProfileHeader } from '@/components/dashboard/ProfileHeader';
import MyProjectsTab from '@/components/dashboard/MyProjectsTab';
import DiscoverTab from '@/components/dashboard/DiscoverTab';
import NetworkTab from '@/components/dashboard/NetworkTab';
import { MessagesTab } from '@/components/dashboard/MessagesTab';
import { CalendarTab } from '@/components/dashboard/CalendarTab';
import { AchievementsTab } from '@/components/dashboard/AchievementsTab';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    professionals,
    projects,
    connections,
    incomingRequests,
    pendingConnections,
    loading,
    handleConnect,
    handleRequestAction
  } = useDashboardData();

  const filteredProfessionals = professionals.filter(professional =>
    professional.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    professional.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (professional.genres && Array.isArray(professional.genres) && 
     professional.genres.some((genre: string) => 
       genre.toLowerCase().includes(searchQuery.toLowerCase())
     ))
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleSendMessage = async (userId: string) => {
    if (!user?.id) {
      toast.error('Please log in to send messages');
      return;
    }

    try {
      // Create or find existing conversation with the user
      const conversation = await findOrCreateDirectConversation(userId);
      
      if (conversation) {
        // Navigate to messages with the specific conversation
        setActiveTab('messages');
        toast.success('Opening conversation...');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  const handleOpenModal = () => {
    // For now, we'll show a toast. This can be expanded to open an actual modal later
    toast.info('Project creation modal coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-hsl(var(--ocean-blue))/5 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-hsl(var(--ocean-blue)) border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-hsl(var(--ocean-blue))/5">
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 lg:ml-64 lg:mr-80">
          <div className="p-6 max-w-6xl mx-auto">
            <ProfileHeader />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-card/50 backdrop-blur-sm border border-hsl(var(--ocean-blue))/20">
                <TabsTrigger value="discover">Discover</TabsTrigger>
                <TabsTrigger value="my-projects">My Projects</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="discover" className="space-y-6 mt-8">
                <DiscoverTab
                  professionals={filteredProfessionals}
                  pendingConnections={pendingConnections}
                  handleConnect={handleConnect}
                  handleViewProfile={handleViewProfile}
                  handleSearch={handleSearch}
                />
              </TabsContent>

              <TabsContent value="my-projects" className="space-y-6 mt-8">
                <MyProjectsTab 
                  projects={projects}
                  handleOpenModal={handleOpenModal}
                />
              </TabsContent>

              <TabsContent value="network" className="space-y-6 mt-8">
                <NetworkTab 
                  connections={connections}
                  incomingRequests={incomingRequests}
                  handleRequestAction={handleRequestAction}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleFindConnections={() => {}}
                  handleViewProfile={handleViewProfile}
                  handleSendMessage={handleSendMessage}
                />
              </TabsContent>

              <TabsContent value="messages" className="space-y-6 mt-8">
                <MessagesTab />
              </TabsContent>

              <TabsContent value="calendar" className="space-y-6 mt-8">
                <CalendarTab />
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6 mt-8">
                <AchievementsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <DashboardRightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;

