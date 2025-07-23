
import React from 'react';
import { cn } from '@/lib/utils';
import { getCulturalInputStyle, culturalStyles } from '@/lib/cultural-design';

interface CulturalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  culturalIcon?: string;
  state?: 'default' | 'error' | 'success';
}

export const CulturalInput = React.forwardRef<HTMLInputElement, CulturalInputProps>(
  ({ label, error, success, culturalIcon, state = 'default', className, ...props }, ref) => {
    const inputState = error ? 'error' : success ? 'success' : state;
    
    return (
      <div className="space-y-2">
        {label && (
          <label className={cn(culturalStyles.typography.label, culturalStyles.colors.primary)}>
            {culturalIcon && <span className="mr-2">{culturalIcon}</span>}
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              getCulturalInputStyle(inputState),
              'w-full',
              className
            )}
            {...props}
          />
          
          {/* Cultural pattern overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-lg opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff9500' fill-opacity='0.1'%3E%3Cpath d='M10 5l5 5-5 5-5-5z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        {error && (
          <p className={cn(culturalStyles.typography.caption, culturalStyles.colors.warning)}>
            🚨 {error}
          </p>
        )}
        
        {success && (
          <p className={cn(culturalStyles.typography.caption, culturalStyles.colors.success)}>
            {culturalStyles.elements.success} {success}
          </p>
        )}
      </div>
    );
  }
);

CulturalInput.displayName = 'CulturalInput';
