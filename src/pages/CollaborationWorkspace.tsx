import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Edit3, 
  Users, 
  Clock, 
  Calendar,
  Settings,
  FileText,
  MessageSquare,
  CheckSquare2,
  Radio,
  GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollaboratorSidebar } from '@/components/collaboration/CollaboratorSidebar';
import { FilesTab } from '@/components/collaboration/FilesTab';
import { TimelineTab } from '@/components/collaboration/TimelineTab';
import { ChatTab } from '@/components/collaboration/ChatTab';
import { TasksTab } from '@/components/collaboration/TasksTab';
import { AudioMixerPanel } from '@/components/collaboration/AudioMixerPanel';
import { VersionControl } from '@/components/collaboration/VersionControl';

interface Collaborator {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'completed';
  assigneeId: string;
}

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'upcoming' | 'in progress' | 'completed';
}

const CollaborationWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState('files');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState('Sufi Romance - Wedding Album');

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: '1', name: 'Arijit Singh', avatarUrl: '/avatars/arijit.jpg', role: 'Lead Vocalist' },
    { id: '2', name: 'Pritam Chakraborty', avatarUrl: '/avatars/pritam.jpg', role: 'Music Composer' },
    { id: '3', name: 'Sunidhi Chauhan', avatarUrl: '/avatars/sunidhi.jpg', role: 'Playback Singer' },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '101', title: 'Record Vocals', description: 'Record lead vocals for the track', status: 'in progress', assigneeId: '1' },
    { id: '102', title: 'Compose Music', description: 'Compose the music for the song', status: 'completed', assigneeId: '2' },
    { id: '103', title: 'Mix Audio', description: 'Mix the audio tracks', status: 'open', assigneeId: '2' },
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '201', title: 'Concept Approval', dueDate: '2023-12-15', status: 'completed' },
    { id: '202', title: 'Music Composition', dueDate: '2024-01-15', status: 'completed' },
    { id: '203', title: 'Vocal Recording', dueDate: '2024-02-28', status: 'in progress' },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GitBranch className="h-8 w-8 text-yellow-400 animate-spin-slow" />
            {isEditingTitle ? (
              <div className="flex items-center">
                <Input
                  type="text"
                  value={projectTitle}
                  onChange={handleTitleChange}
                  className="text-lg font-semibold bg-transparent border-none focus:ring-0 focus:outline-none text-white"
                />
                <Button onClick={handleTitleSave} variant="ghost" className="text-white hover:bg-purple-700">
                  Save
                </Button>
              </div>
            ) : (
              <h1 className="text-2xl font-semibold">{projectTitle}</h1>
            )}
          </div>
          {!isEditingTitle && (
            <Button onClick={handleTitleEdit} variant="ghost" className="text-white hover:bg-purple-700">
              <Edit3 className="h-5 w-5 mr-2" />
              Edit Title
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex h-[calc(100vh-120px)]">
        <CollaboratorSidebar collaborators={collaborators} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="flex bg-muted/50 p-2 rounded-md">
              <TabsTrigger value="files" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                <FileText className="h-4 w-4 mr-2" />
                Files
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                <Clock className="h-4 w-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                <CheckSquare2 className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="mixer" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                <Radio className="h-4 w-4 mr-2" />
                Audio Mixer
              </TabsTrigger>
              <TabsTrigger value="versions" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                <GitBranch className="h-4 w-4 mr-2" />
                Version Control
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="files" className="h-full">
                <FilesTab />
              </TabsContent>
              
              <TabsContent value="timeline" className="h-full">
                <TimelineTab />
              </TabsContent>
              
              <TabsContent value="chat" className="h-full">
                <ChatTab />
              </TabsContent>
              
              <TabsContent value="tasks" className="h-full">
                <TasksTab />
              </TabsContent>
              
              <TabsContent value="mixer" className="h-full">
                <AudioMixerPanel />
              </TabsContent>
              
              <TabsContent value="versions" className="h-full">
                <VersionControl />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CollaborationWorkspace;
