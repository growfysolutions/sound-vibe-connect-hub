
import { useState } from 'react';
import { 
  Edit3, 
  Clock, 
  FileText,
  MessageSquare,
  CheckSquare2,
  Radio,
  GitBranch,
  Phone,
  Users,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { CulturalCard } from '@/components/cards/CulturalCard';
import CollaboratorSidebar from '@/components/collaboration/CollaboratorSidebar';
import FilesTab from '@/components/collaboration/FilesTab';
import TimelineTab from '@/components/collaboration/TimelineTab';
import ChatTab from '@/components/collaboration/ChatTab';
import TasksTab from '@/components/collaboration/TasksTab';
import AudioMixerPanel from '@/components/collaboration/AudioMixerPanel';
import VersionControl from '@/components/collaboration/VersionControl';
import WebRTCCall from '@/components/collaboration/WebRTCCall';
import AdvancedMediaPlayer from '@/components/collaboration/AdvancedMediaPlayer';
import EnhancedTaskManager from '@/components/collaboration/EnhancedTaskManager';
import { getCulturalNavigationStyle } from '@/lib/cultural-design';

interface Collaborator {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  avatar: string;
  permission: 'Admin' | 'Contributor' | 'Viewer';
}

const CollaborationWorkspace = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState('Sufi Romance - Wedding Album');
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [selectedMediaFile, setSelectedMediaFile] = useState<string | null>(null);

  const [collaborators] = useState<Collaborator[]>([
    { 
      id: '1', 
      name: 'Arijit Singh', 
      avatarUrl: '/avatars/arijit.jpg', 
      role: 'Lead Vocalist',
      status: 'online',
      avatar: '/avatars/arijit.jpg',
      permission: 'Admin'
    },
    { 
      id: '2', 
      name: 'Pritam Chakraborty', 
      avatarUrl: '/avatars/pritam.jpg', 
      role: 'Music Composer',
      status: 'online',
      avatar: '/avatars/pritam.jpg',
      permission: 'Contributor'
    },
    { 
      id: '3', 
      name: 'Sunidhi Chauhan', 
      avatarUrl: '/avatars/sunidhi.jpg', 
      role: 'Playback Singer',
      status: 'away',
      avatar: '/avatars/sunidhi.jpg',
      permission: 'Contributor'
    },
  ]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(e.target.value);
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
  };

  const tabItems = [
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare2 },
    { id: 'enhanced-tasks', label: 'Enhanced Tasks', icon: Users },
    { id: 'mixer', label: 'Audio Mixer', icon: Radio },
    { id: 'media-player', label: 'Media Player', icon: Zap },
    { id: 'versions', label: 'Version Control', icon: GitBranch },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Cultural Header */}
      <div className="bg-gradient-to-r from-hsl(var(--ocean-blue)) to-hsl(var(--teal)) text-white py-6 shadow-xl shadow-hsl(var(--ocean-blue))/20 border-b border-hsl(var(--ocean-blue))/30">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GitBranch className="h-8 w-8 text-white animate-pulse" />
            {isEditingTitle ? (
              <div className="flex items-center">
                <Input
                  type="text"
                  value={projectTitle}
                  onChange={handleTitleChange}
                  className="text-lg font-semibold bg-white/10 border-white/20 focus:border-white text-white placeholder:text-white/70 backdrop-blur-sm"
                />
                <CulturalButton 
                  onClick={handleTitleSave} 
                  variant="secondary" 
                  size="sm"
                  className="ml-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  Save
                </CulturalButton>
              </div>
            ) : (
              <h1 className="text-2xl font-semibold tracking-wide">{projectTitle}</h1>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <CulturalButton 
              onClick={() => setIsCallOpen(true)}
              variant="secondary" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Phone className="h-5 w-5 mr-2" />
              Start Call
            </CulturalButton>
            {!isEditingTitle && (
              <CulturalButton 
                onClick={handleTitleEdit} 
                variant="secondary"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Edit3 className="h-5 w-5 mr-2" />
                Edit Title
              </CulturalButton>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex h-[calc(100vh-120px)]">
        <CollaboratorSidebar collaborators={collaborators} />
        
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-border bg-card/50 backdrop-blur-sm">
              <TabsList className="bg-transparent p-2 rounded-none border-none h-auto">
                {tabItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TabsTrigger 
                      key={item.id}
                      value={item.id} 
                      className={getCulturalNavigationStyle(activeTab === item.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-hidden bg-gradient-to-br from-hsl(var(--ocean-blue))/5 to-hsl(var(--teal))/5">
              <TabsContent value="files" className="h-full m-0 p-4">
                <CulturalCard variant="glass" className="h-full">
                  <FilesTab projectId="sample-project" />
                </CulturalCard>
              </TabsContent>
              
              <TabsContent value="timeline" className="h-full m-0 p-4">
                <CulturalCard variant="glass" className="h-full">
                  <TimelineTab projectData={{ phase: 'Recording', progress: 65, daysRemaining: 45 }} />
                </CulturalCard>
              </TabsContent>
              
              <TabsContent value="chat" className="h-full m-0 p-4">
                <CulturalCard variant="glass" className="h-full">
                  <ChatTab projectId="sample-project" collaborators={collaborators} />
                </CulturalCard>
              </TabsContent>
              
              <TabsContent value="tasks" className="h-full m-0 p-4">
                <CulturalCard variant="glass" className="h-full">
                  <TasksTab projectId="sample-project" collaborators={collaborators} />
                </CulturalCard>
              </TabsContent>
              
              <TabsContent value="enhanced-tasks" className="h-full m-0 p-4">
                <CulturalCard variant="glass" className="h-full">
                  <EnhancedTaskManager projectId="sample-project" />
                </CulturalCard>
              </TabsContent>
              
              <TabsContent value="mixer" className="h-full m-0 p-4">
                <CulturalCard variant="glass" className="h-full">
                  <AudioMixerPanel projectId="sample-project" />
                </CulturalCard>
              </TabsContent>
              
              <TabsContent value="media-player" className="h-full m-0 p-4">
                <CulturalCard variant="glass" className="h-full">
                  <div className="p-4 space-y-4">
                    {selectedMediaFile ? (
                      <AdvancedMediaPlayer
                        fileUrl={selectedMediaFile}
                        fileName="Sample Audio Track.mp3"
                      />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Select a media file to play</p>
                        <CulturalButton 
                          onClick={() => setSelectedMediaFile('/sample-audio.mp3')}
                          variant="primary"
                        >
                          Load Sample Audio
                        </CulturalButton>
                      </div>
                    )}
                  </div>
                </CulturalCard>
              </TabsContent>
              
              <TabsContent value="versions" className="h-full m-0 p-4">
                <CulturalCard variant="glass" className="h-full">
                  <VersionControl projectId="sample-project" />
                </CulturalCard>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* WebRTC Call Component */}
      <WebRTCCall
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
      />
    </div>
  );
};

export default CollaborationWorkspace;
