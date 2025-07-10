import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Users, Play, Heart } from 'lucide-react';
import { Project } from './ProjectCard';

interface MyProjectsTabProps {
  projects: Project[];
  handleOpenModal: () => void;
}

const MyProjectsTab: React.FC<MyProjectsTabProps> = ({ projects, handleOpenModal }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Button className="btn-premium" onClick={handleOpenModal}>
          <Upload className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="floating-card group hover-lift overflow-hidden">
            <div className="relative">
              <div className="h-40 bg-primary/20 flex items-center justify-center text-5xl">
                {project.thumbnail}
              </div>
              <div className="absolute top-2 right-2 flex space-x-1">
                {project.isCollaborative && (
                  <Badge className="bg-primary/80 text-primary-foreground text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Collab
                  </Badge>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-md group-hover:text-primary transition-colors truncate">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground">{project.genre}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                <span className="flex items-center">
                  <Play className="w-3 h-3 mr-1" />
                  {project.plays}
                </span>
                <span className="flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  {project.likes}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="floating-card border-dashed border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer" onClick={handleOpenModal}>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="font-medium">Create New Project</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyProjectsTab;
