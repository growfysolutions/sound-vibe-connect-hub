
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit3, 
  Clock, 
  Users, 
  Plus, 
  Settings,
  Music,
  MessageSquare,
  CheckSquare,
  FileAudio,
  Timeline,
  Sliders,
  GitBranch
} from 'lucide-react';
import CollaboratorSidebar from '@/components/collaboration/CollaboratorSidebar';
import FilesTab from '@/components/collaboration/FilesTab';
import TimelineTab from '@/components/collaboration/TimelineTab';
import ChatTab from '@/components/collaboration/ChatTab';
import TasksTab from '@/components/collaboration/TasksTab';
import AudioMixerPanel from '@/components/collaboration/AudioMixerPanel';
import VersionControl from '@/components/collaboration/VersionControl';

const CollaborationWorkspace = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('files');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState('Sufi Romance - Wedding Album');

  // Mock project data - in real app, this would come from API
  const projectData = {
    id: projectId || '1',
    title: projectTitle,
    progress: 65,
    daysRemaining: 5,
    status: '🎵 Recording Phase',
    phase: 'Recording',
    collaborators: [
      { id: '1', name: 'Jasbir Singh', role: 'Lead Vocalist', status: 'online', avatar: '/placeholder.svg', permission: 'Admin' },
      { id: '2', name: 'Priya Sharma', role: 'Producer', status: 'online', avatar: '/placeholder.svg', permission: 'Contributor' },
      { id: '3', name: 'Amit Kumar', role: 'Lyricist', status: 'away', avatar: '/placeholder.svg', permission: 'Contributor' },
      { id: '4', name: 'Sonia Patel', role: 'Sound Engineer', status: 'offline', avatar: '/placeholder.svg', permission: 'Viewer' },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-black via-space-deep-blue to-cosmic-purple">
      <div className="flex h-screen">
        {/* Collaborator Sidebar */}
        <CollaboratorSidebar collaborators={projectData.collaborators} />
        
        {/* Main Workspace */}
        <div className="flex-1 flex flex-col">
          {/* Project Header Bar */}
          <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {isEditingTitle ? (
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      onBlur={() => setIsEditingTitle(false)}
                      onKeyPress={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                      className="text-2xl font-bold bg-transparent border-b border-primary focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-foreground">{projectTitle}</h1>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1 h-auto"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
                <Badge variant="outline" className="bg-primary/20 border-primary/30">
                  {projectData.status}
                </Badge>
              </div>

              <div className="flex items-center space-x-6">
                {/* Progress Indicator */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{projectData.progress}% Complete</div>
                    <Progress value={projectData.progress} className="w-32" />
                  </div>
                </div>

                {/* Timeline Countdown */}
                <div className="flex items-center space-x-2 text-amber-400">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{projectData.daysRemaining} days remaining</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Users className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="files" className="flex items-center space-x-2">
                  <FileAudio className="w-4 h-4" />
                  <span>Files</span>
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center space-x-2">
                  <Timeline className="w-4 h-4" />
                  <span>Timeline</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Tasks</span>
                </TabsTrigger>
                <TabsTrigger value="mixer" className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4" />
                  <span>Mixer</span>
                </TabsTrigger>
                <TabsTrigger value="versions" className="flex items-center space-x-2">
                  <GitBranch className="w-4 h-4" />
                  <span>Versions</span>
                </TabsTrigger>
              </TabsList>

              <div className="h-full">
                <TabsContent value="files" className="h-full">
                  <FilesTab projectId={projectData.id} />
                </TabsContent>

                <TabsContent value="timeline" className="h-full">
                  <TimelineTab projectData={projectData} />
                </TabsContent>

                <TabsContent value="chat" className="h-full">
                  <ChatTab projectId={projectData.id} collaborators={projectData.collaborators} />
                </TabsContent>

                <TabsContent value="tasks" className="h-full">
                  <TasksTab projectId={projectData.id} collaborators={projectData.collaborators} />
                </TabsContent>

                <TabsContent value="mixer" className="h-full">
                  <AudioMixerPanel projectId={projectData.id} />
                </TabsContent>

                <TabsContent value="versions" className="h-full">
                  <VersionControl projectId={projectData.id} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationWorkspace;
