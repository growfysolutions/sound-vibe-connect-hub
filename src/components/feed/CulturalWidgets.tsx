
import { TodaysInspirationWidget } from '@/components/dashboard/TodaysInspirationWidget';
import { MusicalJourneyWidget } from '@/components/dashboard/MusicalJourneyWidget';
import { LocalMusicSceneWidget } from '@/components/dashboard/LocalMusicSceneWidget';
import { CollaborationMatcherWidget } from '@/components/dashboard/CollaborationMatcherWidget';
import { LearningCornerWidget } from '@/components/dashboard/LearningCornerWidget';
import { WeatherMusicWidget } from '@/components/dashboard/WeatherMusicWidget';

export function CulturalWidgets() {
  return (
    <div className="space-y-6">
      <TodaysInspirationWidget />
      <MusicalJourneyWidget />
      <LocalMusicSceneWidget />
      <CollaborationMatcherWidget />
      <LearningCornerWidget />
      <WeatherMusicWidget />
    </div>
  );
}
