
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, Calendar, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { Project } from '@/types';

interface ProjectSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSelectionModal({ isOpen, onClose }: ProjectSelectionModalProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && profile?.id) {
      fetchProjects();
    }
  }, [isOpen, profile?.id]);

  const fetchProjects = async () => {
    if (!profile?.id) return;
    
    setIsLoading(true);
    try {
      // Fetch user's own projects and projects they collaborate on
      const { data: userProjects, error: userError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      const { data: collaborativeProjects, error: collabError } = await supabase
        .from('project_collaborators')
        .select(`
          project_id,
          projects (*)
        `)
        .eq('user_id', profile.id);

      if (userError) throw userError;
      if (collabError) throw collabError;

      // Combine and deduplicate projects
      const allProjects = [
        ...(userProjects || []),
        ...(collaborativeProjects?.map(pc => pc.projects).filter(Boolean) || [])
      ];
      
      // Remove duplicates based on project ID
      const uniqueProjects = allProjects.filter((project, index, self) => 
        index === self.findIndex(p => p.id === project.id)
      );

      setProjects(uniqueProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectSelect = (projectId: number) => {
    navigate(`/collaboration-workspace/${projectId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Select Project to Collaborate
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Projects List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No projects match your search.' : 'No collaborative projects found.'}
              </div>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold truncate">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">by {project.artist}</p>
                            {project.genre && (
                              <p className="text-xs text-muted-foreground mt-1">{project.genre}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(project.created_at).toLocaleDateString()}
                            </div>
                            {project.is_collaborative && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                Collaborative
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleProjectSelect(project.id)}
                            className="text-xs"
                          >
                            Open Workspace
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
