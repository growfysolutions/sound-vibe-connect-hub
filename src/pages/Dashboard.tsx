
import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardRightSidebar } from '@/components/dashboard/DashboardRightSidebar';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { FeedTimeline } from '@/components/feed/FeedTimeline';
import DiscoverTab from '@/components/dashboard/DiscoverTab';
import NetworkTab from '@/components/dashboard/NetworkTab';
import MyProjectsTab from '@/components/dashboard/MyProjectsTab';
import { AchievementsTab } from '@/components/dashboard/AchievementsTab';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { CalendarTab } from '@/components/dashboard/CalendarTab';
import { MessagesTab } from '@/components/dashboard/MessagesTab';
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useSearch } from '@/hooks/useSearch';
import { toast } from 'sonner';

export default function Dashboard() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    professionals,
    projects,
    connections,
    incomingRequests,
    pendingConnections,
    loading,
    handleConnect,
    handleRequestAction,
    refetchProjects
  } = useDashboardData();

  const { searchQuery, handleSearch, setSearchQuery } = useSearch();
  
  // Extract tab from URL path
  const getTabFromPath = (path: string) => {
    const pathParts = path.split('/');
    const tabFromPath = pathParts[pathParts.length - 1];
    
    const tabMap: Record<string, string> = {
      'dashboard': 'feed',
      'feed': 'feed',
      'discover': 'discover',
      'network': 'network',
      'projects': 'projects',
      'achievements': 'achievements',
      'analytics': 'analytics',
      'calendar': 'calendar',
      'messages': 'messages'
    };
    
    return tabMap[tabFromPath] || 'feed';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    const tabPaths: Record<string, string> = {
      'feed': '/dashboard',
      'discover': '/dashboard/discover',
      'network': '/dashboard/network',
      'projects': '/dashboard/projects',
      'achievements': '/dashboard/achievements',
      'analytics': '/dashboard/analytics',
      'calendar': '/dashboard/calendar',
      'messages': '/dashboard/messages'
    };
    
    const newPath = tabPaths[tabId] || '/dashboard';
    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  };

  const handleSendMessage = () => {
    // Navigate to messages tab instead of separate page
    setActiveTab('messages');
    navigate('/dashboard/messages', { replace: true });
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleFindConnections = () => {
    setActiveTab('discover');
    navigate('/dashboard/discover');
  };

  const handleOpenModal = () => {
    setIsProjectModalOpen(true);
  };

  const handleProjectCreated = () => {
    refetchProjects();
    toast.success('Project created successfully!');
  };

  // Error boundary component for tab content
  const TabErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      console.error('Tab rendering error:', error);
      return (
        <div className="flex items-center justify-center h-64 bg-background">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      );
    }
  };

  const renderTabContent = () => {
    if (loading && (activeTab === 'discover' || activeTab === 'network' || activeTab === 'projects')) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    const tabComponents = {
      feed: <FeedTimeline />,
      discover: <DiscoverTab 
        professionals={professionals}
        pendingConnections={pendingConnections}
        handleConnect={handleConnect}
        handleSendMessage={handleSendMessage}
        handleSearch={handleSearch}
      />,
      network: <NetworkTab 
        connections={connections}
        incomingRequests={incomingRequests}
        handleRequestAction={handleRequestAction}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleFindConnections={handleFindConnections}
        handleViewProfile={handleViewProfile}
        handleSendMessage={handleSendMessage}
      />,
      projects: <MyProjectsTab 
        projects={projects}
        handleOpenModal={handleOpenModal}
      />,
      achievements: <AchievementsTab />,
      analytics: <AnalyticsDashboard />,
      calendar: <CalendarTab />,
      messages: <MessagesTab />
    };

    const TabComponent = tabComponents[activeTab as keyof typeof tabComponents];
    
    if (!TabComponent) {
      return (
        <div className="flex items-center justify-center h-64 bg-background">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Page not found</h3>
            <p className="text-muted-foreground">The requested page could not be found</p>
          </div>
        </div>
      );
    }

    return <TabErrorBoundary>{TabComponent}</TabErrorBoundary>;
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pb-20">
          <div className="bg-background min-h-screen">
            <div className="p-4">
              {renderTabContent()}
            </div>
          </div>
        </div>
        <MobileBottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        
        <CreateProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex w-full">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-border bg-card">
          <DashboardSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
        
        {/* Main Content - Removed h-screen overflow-hidden to allow natural scrolling */}
        <div className="flex-1 bg-background">
          <main className="min-h-screen">
            <div className="bg-background">
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </main>
        </div>
        
        {/* Right Sidebar - Hidden on small screens */}
        <div className="hidden xl:block">
          <DashboardRightSidebar />
        </div>
      </div>
      
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
