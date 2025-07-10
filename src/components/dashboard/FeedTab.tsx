import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import ProjectCard, { Project } from './ProjectCard';

interface FeedTabProps {
  projects: Project[];
}

const FeedTab: React.FC<FeedTabProps> = ({ projects }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Latest from Your Network</h2>
        <Button variant="outline" className="hover-scale">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default FeedTab;
