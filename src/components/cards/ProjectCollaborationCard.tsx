import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Users, Calendar, AlertCircle } from 'lucide-react';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { CulturalIconButton } from '@/components/ui/CulturalIconButton';
import { cn } from '@/lib/utils';

interface ProjectCollaborationCardProps {
  project: {
    id: string;
    title: string;
    seeking: string[];
    budget: string;
    timeline: string;
    description: string;
    postedBy: {
      name: string;
      avatar: string;
      isVerified: boolean;
    };
    applications: number;
    urgency?: string;
    skills: string[];
    location?: string;
    postedDate: string;
  };
  onApply?: (projectId: string) => void;
  onSave?: (projectId: string) => void;
  onShare?: (projectId: string) => void;
  onViewDetails?: (projectId: string) => void;
}

export const ProjectCollaborationCard: React.FC<ProjectCollaborationCardProps> = ({
  project,
  onApply,
  onSave,
  onShare,
  onViewDetails
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(project.id);
  };

  const isUrgent = project.urgency && project.urgency.toLowerCase().includes('weekend');

  return (
    <Card 
      className={cn(
        "w-96 h-auto p-4 bg-white relative overflow-hidden transition-all duration-300",
        "shadow-[0_4px_12px_rgba(30,64,175,0.1)] rounded-xl",
        "hover:shadow-[0_8px_24px_rgba(30,64,175,0.2)] hover:-translate-y-1",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/5 before:to-purple-500/5 before:opacity-50",
        "border border-blue-500/20",
        isUrgent && "border-orange-500/40 shadow-[0_4px_12px_rgba(249,115,22,0.2)]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Urgency indicator */}
      {isUrgent && (
        <div className="absolute top-0 right-0 bg-orange-500 text-white px-2 py-1 rounded-bl-lg text-xs font-medium">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Urgent
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-2">
              {project.title}
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={project.postedBy.avatar} alt={project.postedBy.name} />
                <AvatarFallback className="text-xs">
                  {project.postedBy.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                by {project.postedBy.name}
              </span>
              {project.postedBy.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <CulturalIconButton
              icon={isSaved ? "heart" : "heart"}
              variant={isSaved ? "liked" : "default"}
              size="sm"
              onClick={handleSave}
            />
            <CulturalIconButton
              icon="share"
              size="sm"
              onClick={() => onShare?.(project.id)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Seeking roles */}
        <div>
          <p className="text-sm font-medium mb-2 text-foreground">Seeking:</p>
          <div className="flex flex-wrap gap-1">
            {project.seeking.map((role, index) => (
              <Badge key={index} className="bg-saffron/20 text-saffron hover:bg-saffron/30">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            <span>{project.budget}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            <span>{project.timeline}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="w-4 h-4 mr-2 text-purple-600" />
            <span>{project.applications} interested</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-orange-600" />
            <span>{project.postedDate}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Skills required */}
        <div>
          <p className="text-sm font-medium mb-2">Skills Required:</p>
          <div className="flex flex-wrap gap-1">
            {project.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Urgency message */}
        {project.urgency && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm font-medium text-orange-800">Urgent:</p>
            <p className="text-sm text-orange-700">{project.urgency}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <CulturalButton
            variant="primary"
            size="sm"
            onClick={() => onApply?.(project.id)}
            className="flex-1"
          >
            Apply Now
          </CulturalButton>
          <CulturalButton
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails?.(project.id)}
            className="flex-1"
          >
            View Details
          </CulturalButton>
        </div>
      </CardContent>
    </Card>
  );
};
