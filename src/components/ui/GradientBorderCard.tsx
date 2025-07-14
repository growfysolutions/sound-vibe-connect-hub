
import React from 'react';
import './gradient-border-card.css';

interface GradientBorderCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientBorderCard: React.FC<GradientBorderCardProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`gradient-border-card ${className}`}>
      <div className="gradient-border-card-content">
        {children}
      </div>
    </div>
  );
};
