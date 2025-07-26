
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types';
import ProjectCard from './ProjectCard';

interface MyProjectsTabProps {
  projects: Project[];
  handleOpenModal: () => void;
}

const MyProjectsTab: React.FC<MyProjectsTabProps> = ({ projects, handleOpenModal }) => {
  const [filter, setFilter] = useState<'all' | 'collaborative' | 'solo'>('all');

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'collaborative') return project.is_collaborative;
    if (filter === 'solo') return !project.is_collaborative;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
          <p className="text-muted-foreground">Manage your musical creations and collaborations</p>
        </div>
        <CulturalButton onClick={handleOpenModal} className="btn-premium">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </CulturalButton>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
          }`}
        >
          All Projects ({projects.length})
        </button>
        <button
          onClick={() => setFilter('collaborative')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'collaborative'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
          }`}
        >
          Collaborative ({projects.filter(p => p.is_collaborative).length})
        </button>
        <button
          onClick={() => setFilter('solo')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'solo'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
          }`}
        >
          Solo ({projects.filter(p => !p.is_collaborative).length})
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onEdit={() => console.log('Edit project:', project.id)}
              onDelete={() => console.log('Delete project:', project.id)}
              onViewChat={() => console.log('View chat for project:', project.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              {filter === 'all' ? 'No projects yet' : `No ${filter} projects`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {filter === 'all' 
                ? "Start your musical journey by creating your first project"
                : `You don't have any ${filter} projects yet`
              }
            </p>
            <CulturalButton onClick={handleOpenModal} className="btn-premium">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </CulturalButton>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyProjectsTab;
