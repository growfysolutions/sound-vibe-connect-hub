
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <Card className={cn(
      "w-80 h-auto p-4 bg-white relative overflow-hidden transition-all duration-300",
      "shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-xl",
      "hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/5 before:to-pink-500/5 before:opacity-50",
      "border border-purple-500/20"
    )}>
      {/* Traditional quotation marks */}
      <div className="absolute top-2 left-2 text-6xl text-saffron/20 font-serif leading-none">
        "
      </div>
      <div className="absolute bottom-2 right-2 text-6xl text-saffron/20 font-serif leading-none rotate-180">
        "
      </div>

      <CardContent className="relative z-10 space-y-4 pt-6">
        {/* Quote */}
        <div className="px-4">
          <p className="text-foreground italic text-sm leading-relaxed">
            {testimonial.quote}
          </p>
        </div>

        {/* Rating */}
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

        {/* Author info */}
        <div className="flex items-center space-x-3 pt-2">
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-saffron/30 ring-2 ring-saffron/10">
              <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
              <AvatarFallback className="bg-saffron/20 text-saffron font-semibold">
                {testimonial.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {/* Cultural frame accent */}
            <div className="absolute -inset-1 border-2 border-saffron/20 rounded-full -z-10"></div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{testimonial.author.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.author.role}</p>
            <p className="text-xs text-muted-foreground">{testimonial.date}</p>
          </div>
        </div>

        {/* Project reference */}
        <div className="bg-muted/50 rounded-lg p-3 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Project:</p>
              <p className="text-sm text-muted-foreground">{testimonial.project.title}</p>
            </div>
            {testimonial.project.link && (
              <button
                onClick={handleProjectClick}
                className="text-saffron hover:text-saffron/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
