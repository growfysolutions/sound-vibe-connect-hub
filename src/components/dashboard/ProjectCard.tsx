import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Heart, MessageCircle, Share2, Clock } from 'lucide-react';

export interface Project {
  id: number;
  title: string;
  artist: string;
  role: string;
  thumbnail: string;
  plays: string;
  likes: string;
  duration: string;
  genre: string;
  isCollaborative: boolean;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card key={project.id} className="floating-card group hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            {project.thumbnail}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-muted-foreground">by {project.artist}</span>
                  <Badge variant="secondary" className="text-xs">
                    {project.role}
                  </Badge>
                  {project.isCollaborative && (
                    <Badge className="bg-primary/20 text-primary text-xs">
                      Collaborative
                    </Badge>
                  )}
                </div>
              </div>
              <Button size="icon" className="btn-premium opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {project.duration}
              </span>
              <span>{project.genre}</span>
              <span>{project.plays} plays</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                  <Heart className="w-4 h-4 mr-2" />
                  {project.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
