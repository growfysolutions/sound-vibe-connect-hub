
import React from 'react';
import './gradient-border-card.css';

interface GradientBorderCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const GradientBorderCard: React.FC<GradientBorderCardProps> = ({
  icon,
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`gradient-border-card ${className}`}>
      <div className="card-inner">
        <div className="card-icon">
          {icon}
        </div>
        <div className="card-content">
          <h4 className="card-title">{title}</h4>
          <p className="card-description">{description}</p>
        </div>
      </div>
    </div>
  );
};
