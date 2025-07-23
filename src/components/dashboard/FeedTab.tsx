
import { CulturalButton } from '@/components/ui/CulturalButton';
import { Filter } from 'lucide-react';
import { ProjectCollaborationCard } from '@/components/cards/ProjectCollaborationCard';
import { Project } from './ProjectCard';

interface FeedTabProps {
  projects: Project[];
}

const FeedTab: React.FC<FeedTabProps> = ({ projects }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Latest from Your Network</h2>
        <CulturalButton variant="secondary" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </CulturalButton>
      </div>

      {projects.map((project) => (
        <ProjectCollaborationCard 
          key={project.id} 
          project={{
            id: project.id.toString(),
            title: project.title,
            description: `${project.genre || 'Music'} collaboration project`,
            budget: '$500 - $1,000',
            timeline: '2-4 weeks',
            postedBy: {
              name: 'Project Creator',
              avatar: '',
              isVerified: true
            },
            applications: 0,
            postedDate: new Date().toLocaleDateString(),
            seeking: [project.genre || 'Musicians'],
            skills: [project.genre || 'General']
          }}
          onApply={(id) => console.log('Applied to project:', id)}
          onSave={(id) => console.log('Saved project:', id)}
          onShare={(id) => console.log('Shared project:', id)}
          onViewDetails={(id) => console.log('View project details:', id)}
        />
      ))}
    </div>
  );
};

export default FeedTab;
