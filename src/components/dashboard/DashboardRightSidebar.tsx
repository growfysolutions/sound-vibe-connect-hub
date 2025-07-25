
import { UserProfileCard } from '@/components/dashboard/UserProfileCard';
import { QuickActionsBar } from '@/components/dashboard/QuickActionsBar';
import { CollaborationMatcherWidget } from '@/components/dashboard/CollaborationMatcherWidget';
import { TodaysInspirationWidget } from '@/components/dashboard/TodaysInspirationWidget';
import { WeatherMusicWidget } from '@/components/dashboard/WeatherMusicWidget';
import { MusicalJourneyWidget } from '@/components/dashboard/MusicalJourneyWidget';
import { LocalMusicSceneWidget } from '@/components/dashboard/LocalMusicSceneWidget';
import { LearningCornerWidget } from '@/components/dashboard/LearningCornerWidget';

export function DashboardRightSidebar() {
  // Mock handlers for QuickActionsBar
  const quickActionHandlers = {
    onNewCollaboration: () => console.log('New collaboration'),
    onUploadTrack: () => console.log('Upload track'),
    onOpenMessages: () => console.log('Open messages'),
    onScheduleSession: () => console.log('Schedule session'),
  };

  return (
    <div className="w-80 bg-card border-l border-border overflow-y-auto">
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
      
      {/* Quick Actions Bar */}
      <QuickActionsBar {...quickActionHandlers} />
    </div>
  );
}
