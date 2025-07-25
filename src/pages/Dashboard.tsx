
import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import DiscoverTab from '@/components/dashboard/DiscoverTab';
import NetworkTab from '@/components/dashboard/NetworkTab';
import MyProjectsTab from '@/components/dashboard/MyProjectsTab';
import { AchievementsTab } from '@/components/dashboard/AchievementsTab';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { CalendarTab } from '@/components/dashboard/CalendarTab';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract tab from URL path
  const getTabFromPath = (path: string) => {
    const pathParts = path.split('/');
    const tabFromPath = pathParts[pathParts.length - 1];
    
    // Map URL paths to tab IDs
    const tabMap: Record<string, string> = {
      'dashboard': 'feed',
      'feed': 'feed',
      'discover': 'discover',
      'network': 'network',
      'projects': 'projects',
      'achievements': 'achievements',
      'analytics': 'analytics',
      'calendar': 'calendar'
    };
    
    return tabMap[tabFromPath] || 'feed';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update URL when tab changes
    const tabPaths: Record<string, string> = {
      'feed': '/dashboard',
      'discover': '/dashboard/discover',
      'network': '/dashboard/network',
      'projects': '/dashboard/projects',
      'achievements': '/dashboard/achievements',
      'analytics': '/dashboard/analytics',
      'calendar': '/dashboard/calendar'
    };
    
    const newPath = tabPaths[tabId] || '/dashboard';
    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  };

  // Mock data and handlers for components that require props
  const mockData = {
    professionals: [],
    pendingConnections: [],
    connections: [],
    incomingRequests: [],
    projects: [],
    searchQuery: '',
  };

  const mockHandlers = {
    handleConnect: (id: string) => console.log('Connect:', id),
    handleSendMessage: (id: string) => console.log('Send message:', id),
    handleSearch: (query: string) => console.log('Search:', query),
    handleRequestAction: (connectionId: number, status: 'accepted' | 'declined') => 
      console.log('Request action:', connectionId, status),
    setSearchQuery: (query: string) => console.log('Set search query:', query),
    handleFindConnections: () => console.log('Find connections'),
    handleViewProfile: (id: string) => console.log('View profile:', id),
    handleOpenModal: () => console.log('Open modal'),
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
    const tabComponents = {
      feed: <ActivityFeed />,
      discover: <DiscoverTab 
        professionals={mockData.professionals}
        pendingConnections={mockData.pendingConnections}
        handleConnect={mockHandlers.handleConnect}
        handleSendMessage={mockHandlers.handleSendMessage}
        handleSearch={mockHandlers.handleSearch}
      />,
      network: <NetworkTab 
        connections={mockData.connections}
        incomingRequests={mockData.incomingRequests}
        handleRequestAction={mockHandlers.handleRequestAction}
        searchQuery={mockData.searchQuery}
        setSearchQuery={mockHandlers.setSearchQuery}
        handleFindConnections={mockHandlers.handleFindConnections}
        handleViewProfile={mockHandlers.handleViewProfile}
        handleSendMessage={mockHandlers.handleSendMessage}
      />,
      projects: <MyProjectsTab 
        projects={mockData.projects}
        handleOpenModal={mockHandlers.handleOpenModal}
      />,
      achievements: <AchievementsTab />,
      analytics: <AnalyticsDashboard />,
      calendar: <CalendarTab />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex w-full">
        <div className="w-64 border-r border-border bg-card">
          <DashboardSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
        
        <div className="flex-1 bg-background">
          <main className="p-6">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
