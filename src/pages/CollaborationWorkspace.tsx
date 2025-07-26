
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Settings,
  Users,
  FileText,
  MessageSquare,
  Calendar,
  GitBranch,
  Video,
  Share2,
  Star,
  PlayCircle,
  Edit2,
  Save,
  X
} from 'lucide-react';

// Import existing components
import CollaboratorSidebar from '@/components/collaboration/CollaboratorSidebar';
import FilesTab from '@/components/collaboration/FilesTab';
import ChatTab from '@/components/collaboration/ChatTab';
import TasksTab from '@/components/collaboration/TasksTab';
import TimelineTab from '@/components/collaboration/TimelineTab';
import VersionControl from '@/components/collaboration/VersionControl';
import AdvancedMediaPlayer from '@/components/collaboration/AdvancedMediaPlayer';
import RealTimeCollaborationPanel from '@/components/cultural/RealTimeCollaborationPanel';

// Import hooks
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { useProjectFiles } from '@/hooks/useProjectFiles';

interface Project {
  id: number;
  title: string;
  artist: string;
  genre: string | null;
  duration: string | null;
  thumbnail: string | null;
  created_at: string;
  user_id: string;
  is_collaborative: boolean | null;
}

interface Collaborator {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  avatar: string;
  permission: 'Admin' | 'Contributor' | 'Viewer';
}

const CollaborationWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { files } = useProjectFiles(projectId ? parseInt(projectId) : undefined);
  
  const [project, setProject] = useState<Project | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the first audio/video file for the media player
  const currentFile = files.find(f => f.file_type === 'audio' || f.file_type === 'video');

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError('Project ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', parseInt(projectId))
          .single();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          setError('Project not found');
          setIsLoading(false);
          return;
        }

        setProject(data);
        setEditedTitle(data.title);

        // Fetch collaborators - simplified approach
        const { data: collaboratorsData, error: collabError } = await supabase
          .from('project_collaborators')
          .select('user_id, role')
          .eq('project_id', parseInt(projectId));

        if (!collabError && collaboratorsData) {
          // Get profile info for each collaborator
          const collaboratorProfiles = await Promise.all(
            collaboratorsData.map(async (collab) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, is_online')
                .eq('id', collab.user_id)
                .single();

              const status: 'online' | 'away' | 'offline' = profileData?.is_online ? 'online' : 'offline';

              return {
                id: collab.user_id,
                name: profileData?.full_name || 'Unknown User',
                role: collab.role,
                status,
                avatar: profileData?.avatar_url || '',
                permission: collab.role as 'Admin' | 'Contributor' | 'Viewer'
              };
            })
          );

          // Add project owner if not already included
          if (data.user_id !== profile?.id) {
            const { data: ownerData } = await supabase
              .from('profiles')
              .select('full_name, avatar_url, is_online')
              .eq('id', data.user_id)
              .single();

            if (ownerData) {
              const ownerStatus: 'online' | 'away' | 'offline' = ownerData.is_online ? 'online' : 'offline';
              
              collaboratorProfiles.unshift({
                id: data.user_id,
                name: ownerData.full_name || 'Project Owner',
                role: 'Owner',
                status: ownerStatus,
                avatar: ownerData.avatar_url || '',
                permission: 'Admin' as const
              });
            }
          }

          setCollaborators(collaboratorProfiles);
        }

      } catch (err) {
        console.error('Error in fetchProject:', err);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, profile?.id]);

  const handleSaveTitle = async () => {
    if (!project || !editedTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ title: editedTitle.trim() })
        .eq('id', project.id);

      if (error) {
        console.error('Error updating title:', error);
        return;
      }

      setProject({ ...project, title: editedTitle.trim() });
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(project?.title || '');
    setIsEditingTitle(false);
  };

  // Create timeline project data from project
  const getTimelineProjectData = () => {
    if (!project) return { phase: 'Planning', progress: 0, daysRemaining: 0 };
    
    // Calculate some basic timeline data based on project
    const createdDate = new Date(project.created_at);
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Simple logic to determine phase and progress
    let phase = 'Pre-production';
    let progress = 25;
    let daysRemaining = 30;
    
    if (daysElapsed > 15) {
      phase = 'Recording';
      progress = 65;
      daysRemaining = 15;
    }
    
    if (daysElapsed > 45) {
      phase = 'Mixing';
      progress = 85;
      daysRemaining = 5;
    }
    
    return { phase, progress, daysRemaining };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading collaboration workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="mb-6">{error || 'The requested project could not be found.'}</p>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  {isEditingTitle ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-lg font-bold bg-white/10 border-white/20 text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <Button size="sm" onClick={handleSaveTitle} variant="ghost">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={handleCancelEdit} variant="ghost">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <h1 className="text-lg font-bold text-white">{project.title}</h1>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setIsEditingTitle(true)}
                        className="text-white/60 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <span>by {project.artist}</span>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{collaborators.length} collaborators</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Video className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Star className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Collaborators Sidebar */}
        <CollaboratorSidebar collaborators={collaborators} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Media Player Section */}
          <div className="h-64 bg-black/30 backdrop-blur-sm border-b border-white/10">
            {currentFile ? (
              <AdvancedMediaPlayer 
                fileUrl={`/api/files/${currentFile.file_path}`} 
                fileName={currentFile.file_name} 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                <p>No audio or video files uploaded yet</p>
              </div>
            )}
          </div>

          {/* Collaboration Tabs */}
          <div className="flex-1 bg-black/20 backdrop-blur-sm">
            <Tabs defaultValue="files" className="h-full flex flex-col">
              <div className="px-6 py-4 border-b border-white/10">
                <TabsList className="bg-black/30 border-white/10">
                  <TabsTrigger value="files" className="text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/10">
                    <FileText className="w-4 h-4 mr-2" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/10">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/10">
                    <Calendar className="w-4 h-4 mr-2" />
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/10">
                    <Calendar className="w-4 h-4 mr-2" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="versions" className="text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/10">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Versions
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="files" className="h-full p-6 mt-0 overflow-y-auto">
                  <FilesTab projectId={project.id} />
                </TabsContent>
                
                <TabsContent value="chat" className="h-full p-6 mt-0">
                  <ChatTab projectId={projectId} collaborators={collaborators} />
                </TabsContent>
                
                <TabsContent value="tasks" className="h-full p-6 mt-0">
                  <TasksTab projectId={projectId} collaborators={collaborators} />
                </TabsContent>
                
                <TabsContent value="timeline" className="h-full p-6 mt-0">
                  <TimelineTab projectData={getTimelineProjectData()} />
                </TabsContent>
                
                <TabsContent value="versions" className="h-full p-6 mt-0 overflow-y-auto">
                  <VersionControl projectId={projectId} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-black/30 backdrop-blur-sm border-l border-white/10 p-4 space-y-4 overflow-y-auto">
          <RealTimeCollaborationPanel projectId={project.id} />
        </div>
      </div>
    </div>
  );
};

export default CollaborationWorkspace;
