
import React from 'react';
import { CulturalButton } from './CulturalButton';
import { CulturalIconButton } from './CulturalIconButton';
import { DholLoader } from './DholLoader';

// Example usage component showcasing all button variants
export const SoundVibeButtonShowcase: React.FC = () => {
  const [liked, setLiked] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleCollaboration = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
    console.log('Starting collaboration...');
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-background to-muted/20">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Primary Actions</h2>
        <div className="flex flex-wrap gap-4">
          <CulturalButton 
            variant="primary" 
            size="md"
            loading={loading}
            onClick={handleCollaboration}
          >
            {loading ? 'Connecting...' : 'Start Collaboration'}
          </CulturalButton>
          
          <CulturalButton variant="primary" size="md">
            Send Request
          </CulturalButton>
          
          <CulturalButton variant="primary" size="md">
            Upload Track
          </CulturalButton>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Secondary Actions</h2>
        <div className="flex flex-wrap gap-4">
          <CulturalButton variant="secondary" size="md">
            View Profile
          </CulturalButton>
          
          <CulturalButton variant="secondary" size="md">
            Save Draft
          </CulturalButton>
          
          <CulturalButton variant="secondary" size="md">
            Cancel Request
          </CulturalButton>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Destructive Actions</h2>
        <div className="flex flex-wrap gap-4">
          <CulturalButton variant="destructive" size="md">
            Delete Project
          </CulturalButton>
          
          <CulturalButton variant="destructive" size="md">
            Remove Member
          </CulturalButton>
          
          <CulturalButton variant="destructive" size="md">
            Cancel Contract
          </CulturalButton>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Icon Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <CulturalIconButton
            icon="heart"
            variant={liked ? 'liked' : 'default'}
            showBeat={liked}
            onClick={() => setLiked(!liked)}
          />
          
          <CulturalIconButton
            icon={playing ? 'pause' : 'play'}
            variant={playing ? 'playing' : 'default'}
            onClick={() => setPlaying(!playing)}
          />
          
          <CulturalIconButton icon="share" />
          <CulturalIconButton icon="menu" />
          <CulturalIconButton icon="music" />
          <CulturalIconButton icon="volume" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Loading States</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <DholLoader size="sm" />
          <DholLoader size="md" />
          <DholLoader size="lg" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Real Artist Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2">Collaboration Request</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with Simran Kaur for a folk fusion project
            </p>
            <div className="flex gap-2">
              <CulturalButton variant="primary" size="sm">
                Send Request
              </CulturalButton>
              <CulturalButton variant="secondary" size="sm">
                View Profile
              </CulturalButton>
            </div>
          </div>
          
          <div className="p-4 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2">Track Actions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              "Mitti Da Bawa" by Harpreet Singh
            </p>
            <div className="flex gap-2 items-center">
              <CulturalIconButton
                icon="play"
                variant="playing"
                size="sm"
              />
              <CulturalIconButton
                icon="heart"
                variant="liked"
                showBeat={true}
                size="sm"
              />
              <CulturalIconButton icon="share" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export individual components for use throughout the app
export { CulturalButton, CulturalIconButton, DholLoader };
