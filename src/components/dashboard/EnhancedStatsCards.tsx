
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Music, Users, Award } from 'lucide-react';

interface EnhancedStatsCardsProps {
  collapsed: boolean;
  projectsCount: number;
  connectionsCount: number;
  userLevel: number;
}

export function EnhancedStatsCards({ collapsed, projectsCount, connectionsCount, userLevel }: EnhancedStatsCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const mockCollaborators = [
    { id: '1', name: 'Raj Singh', avatar: null },
    { id: '2', name: 'Priya Kaur', avatar: null },
    { id: '3', name: 'Amit Sharma', avatar: null },
  ];

  const mockProjects = [
    { id: '1', title: 'Punjabi Folk Album', thumbnail: '🎵' },
    { id: '2', title: 'Bhangra Beats', thumbnail: '🥁' },
  ];

  if (collapsed) {
    return (
      <div className="px-2 space-y-2">
        <div className="text-center p-2 rounded-lg bg-muted/30 hover:bg-saffron/10 transition-colors group">
          <Music className="w-4 h-4 mx-auto text-saffron mb-1 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-semibold">{projectsCount}</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted/30 hover:bg-saffron/10 transition-colors group">
          <Users className="w-4 h-4 mx-auto text-saffron mb-1 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-semibold">{connectionsCount}</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted/30 hover:bg-saffron/10 transition-colors group">
          <Award className="w-4 h-4 mx-auto text-saffron mb-1 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-semibold">{userLevel}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-3">
      {/* Projects Card */}
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setHoveredCard('projects')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="bg-gradient-to-r from-saffron/10 to-amber-500/10 rounded-lg p-3 border border-saffron/20 hover:border-saffron/40 transition-all duration-300 hover:shadow-lg hover:shadow-saffron/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron/20 to-amber-500/20 flex items-center justify-center">
              <Music className="w-5 h-5 text-saffron" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-foreground">{projectsCount}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
          </div>
          
          {hoveredCard === 'projects' && (
            <div className="mt-3 space-y-2 animate-fade-in">
              <div className="text-xs font-medium text-muted-foreground">Recent Work:</div>
              {mockProjects.map((project) => (
                <div key={project.id} className="flex items-center space-x-2 text-xs">
                  <span className="text-lg">{project.thumbnail}</span>
                  <span className="text-foreground">{project.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Connections Card */}
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setHoveredCard('connections')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg p-3 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-foreground">{connectionsCount}</div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </div>
          </div>
          
          {hoveredCard === 'connections' && (
            <div className="mt-3 space-y-2 animate-fade-in">
              <div className="text-xs font-medium text-muted-foreground">Top Collaborators:</div>
              <div className="flex space-x-1">
                {mockCollaborators.map((collaborator) => (
                  <Avatar key={collaborator.id} className="w-6 h-6 border border-background">
                    <AvatarImage src={collaborator.avatar || ''} alt={collaborator.name} />
                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                      {collaborator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Level Card */}
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setHoveredCard('level')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-foreground">{userLevel}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
          </div>
          
          {hoveredCard === 'level' && (
            <div className="mt-3 space-y-2 animate-fade-in">
              <div className="text-xs font-medium text-muted-foreground">Achievements:</div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                  🏆 First Song
                </Badge>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  🎯 Verified
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
