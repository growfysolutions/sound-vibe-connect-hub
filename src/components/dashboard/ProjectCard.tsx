
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
    <Card className="floating-card group hover-lift">
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
            <Music className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {project.genre || 'No genre specified'}
                </p>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <CulturalButton size="sm" variant="primary" className="shadow-sm">
                  <Play className="w-4 h-4" />
                </CulturalButton>
                {(onEdit || onDelete || onViewChat) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <CulturalButton size="sm" variant="secondary" className="shadow-sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </CulturalButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {onEdit && (
                        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                      )}
                      {onViewChat && (
                        <DropdownMenuItem onClick={onViewChat} className="cursor-pointer">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          View Chat
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem onClick={onDelete} className="text-destructive cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Project
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
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Collaborative
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-red-500 transition-colors duration-200 group/like">
                  <Heart className="w-4 h-4 group-hover/like:scale-110 transition-transform duration-200" />
                  <span>{project.likes || 0}</span>
                </button>
                <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-blue-600 transition-colors duration-200">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-green-600 transition-colors duration-200">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
