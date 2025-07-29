
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import QuickActionsBar from '@/components/dashboard/QuickActionsBar';
import { CollaborationMatcherWidget } from '@/components/dashboard/CollaborationMatcherWidget';
import { TodaysInspirationWidget } from '@/components/dashboard/TodaysInspirationWidget';
import { WeatherMusicWidget } from '@/components/dashboard/WeatherMusicWidget';
import { MusicalJourneyWidget } from '@/components/dashboard/MusicalJourneyWidget';
import { LocalMusicSceneWidget } from '@/components/dashboard/LocalMusicSceneWidget';
import { LearningCornerWidget } from '@/components/dashboard/LearningCornerWidget';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DashboardRightSidebar() {
  // Mock handler for QuickActionsBar
  const handleNewCollaboration = () => {
    console.log('New collaboration');
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-screen">
      {/* Scrollable Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* User Profile Card */}
          <UserProfileCard />
          
          {/* Today's Inspiration Widget */}
          <TodaysInspirationWidget />
          
          {/* Collaboration Matcher Widget */}
          <CollaborationMatcherWidget />
          
          {/* Weather Music Widget */}
          <WeatherMusicWidget />
          
          {/* Musical Journey Widget */}
          <MusicalJourneyWidget />
          
          {/* Local Music Scene Widget */}
          <LocalMusicSceneWidget />
          
          {/* Learning Corner Widget */}
          <LearningCornerWidget />
        </div>
      </ScrollArea>
      
      {/* Fixed Quick Actions Bar at Bottom */}
      <div className="flex-shrink-0">
        <QuickActionsBar onNewCollaboration={handleNewCollaboration} />
      </div>
    </div>
  );
}
