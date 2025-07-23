
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CulturalCard } from './CulturalCard';
import { culturalStyles } from '@/lib/cultural-design';

interface TestimonialCardProps {
  testimonial: {
    id: string;
    quote: string;
    author: {
      name: string;
      avatar: string;
      role: string;
    };
    project: {
      title: string;
      link?: string;
    };
    rating: number;
    date: string;
  };
  onProjectClick?: (projectLink: string) => void;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  onProjectClick
}) => {
  const handleProjectClick = () => {
    if (testimonial.project.link) {
      onProjectClick?.(testimonial.project.link);
    }
  };

  return (
    <CulturalCard 
      variant="testimonial" 
      className="w-80 h-auto"
    >
      {/* Traditional quotation marks with cultural styling */}
      <div className="absolute top-2 left-2 text-6xl text-music-purple/20 font-serif leading-none">
        "
      </div>
      <div className="absolute bottom-2 right-2 text-6xl text-music-purple/20 font-serif leading-none rotate-180">
        "
      </div>

      <div className="relative z-10 space-y-4 pt-6">
        {/* Quote with cultural typography */}
        <div className="px-4">
          <p className={cn(culturalStyles.typography.body, 'italic text-sm leading-relaxed')}>
            {testimonial.quote}
          </p>
        </div>

        {/* Rating with cultural star styling */}
        <div className="flex items-center justify-center space-x-1 py-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4 transition-all duration-300",
                i < testimonial.rating 
                  ? "text-yellow-400 fill-yellow-400 animate-pulse" 
                  : "text-gray-300"
              )}
            />
          ))}
        </div>

        {/* Author info with cultural frame */}
        <div className="flex items-center space-x-3 pt-2">
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-music-purple/30 ring-2 ring-music-purple/10">
              <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
              <AvatarFallback className="bg-music-purple/20 text-music-purple font-semibold">
                {testimonial.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {/* Cultural frame accent */}
            <div className="absolute -inset-1 border-2 border-music-purple/20 rounded-full -z-10"></div>
          </div>
          <div className="flex-1">
            <h4 className={cn(culturalStyles.typography.label, 'font-semibold')}>
              {testimonial.author.name}
            </h4>
            <p className={culturalStyles.typography.caption}>{testimonial.author.role}</p>
            <p className={cn(culturalStyles.typography.caption, 'text-xs')}>{testimonial.date}</p>
          </div>
        </div>

        {/* Project reference with modern styling */}
        <div className={cn(culturalStyles.patterns.modern, 'rounded-lg p-3 mt-4 border border-music-purple/20')}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(culturalStyles.typography.label, 'text-sm font-medium')}>
                Project:
              </p>
              <p className={culturalStyles.typography.caption}>{testimonial.project.title}</p>
            </div>
            {testimonial.project.link && (
              <button
                onClick={handleProjectClick}
                className={cn(culturalStyles.colors.primary, 'hover:text-music-purple/80 transition-colors')}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </CulturalCard>
  );
};
