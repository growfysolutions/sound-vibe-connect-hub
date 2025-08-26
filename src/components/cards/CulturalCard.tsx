
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getCulturalCardStyle, culturalStyles } from '@/lib/cultural-design';

interface CulturalCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'profile' | 'project' | 'testimonial' | 'premium' | 'glass';
  title?: string;
  subtitle?: string;
  culturalIcon?: string;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const CulturalCard: React.FC<CulturalCardProps> = ({
  children,
  variant = 'default',
  title,
  subtitle,
  culturalIcon,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <Card 
      className={cn(
        getCulturalCardStyle(variant),
        onClick && 'cursor-pointer hover:-translate-y-1',
        className
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {(title || subtitle) && (
        <CardHeader className="relative z-10">
          {title && (
            <div className="flex items-center gap-2">
              {culturalIcon && (
                <span className="text-xl">{culturalIcon}</span>
              )}
              <h3 className={cn(culturalStyles.typography.subheader, culturalStyles.colors.primary)}>
                {title}
              </h3>
            </div>
          )}
          {subtitle && (
            <p className={cn(culturalStyles.typography.caption)}>
              {subtitle}
            </p>
          )}
        </CardHeader>
      )}
      
      <CardContent className="relative z-10">
        {children}
      </CardContent>
    </Card>
  );
};
