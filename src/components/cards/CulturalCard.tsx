
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getCulturalCardStyle, culturalStyles } from '@/lib/cultural-design';

interface CulturalCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'profile' | 'project' | 'testimonial';
  title?: string;
  subtitle?: string;
  culturalIcon?: string;
  className?: string;
  onClick?: () => void;
}

export const CulturalCard: React.FC<CulturalCardProps> = ({
  children,
  variant = 'default',
  title,
  subtitle,
  culturalIcon,
  className,
  onClick
}) => {
  return (
    <Card 
      className={cn(
        getCulturalCardStyle(variant),
        onClick && 'cursor-pointer hover:-translate-y-1',
        className
      )}
      onClick={onClick}
    >
      {/* Cultural pattern background */}
      <div className="absolute inset-0 opacity-5 rounded-xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff9500'%3E%3Cpath d='M20 10l10 10-10 10-10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
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
