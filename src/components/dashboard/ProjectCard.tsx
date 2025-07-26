
import { Card, CardContent } from '@/components/ui/card';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { Play, Heart, MessageCircle, Share2, Clock, Music, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Project } from '@/types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewChat?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, onViewChat }) => {
  return (
    <Card key={project.id} className="floating-card group hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            <Music className="w-8 h-8 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {project.genre || 'No genre specified'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <CulturalButton size="sm" variant="primary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4" />
                </CulturalButton>
                {(onEdit || onDelete || onViewChat) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <CulturalButton size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </CulturalButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {onEdit && (
                        <DropdownMenuItem onClick={onEdit}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onViewChat && (
                        <DropdownMenuItem onClick={onViewChat}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          View Chat
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem onClick={onDelete} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(project.created_at).toLocaleDateString()}
              </span>
              {project.is_collaborative && (
                <span className="text-primary text-xs font-medium">Collaborative</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CulturalButton variant="secondary" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  {project.likes || 0}
                </CulturalButton>
                <CulturalButton variant="secondary" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comment
                </CulturalButton>
                <CulturalButton variant="secondary" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </CulturalButton>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
