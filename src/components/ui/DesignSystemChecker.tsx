
import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Palette, Type, Layout } from 'lucide-react';
import { CulturalCard } from '@/components/cards/CulturalCard';
import { culturalStyles } from '@/lib/cultural-design';
import { cn } from '@/lib/utils';

interface ComplianceIssue {
  type: 'color' | 'typography' | 'spacing' | 'pattern';
  severity: 'high' | 'medium' | 'low';
  description: string;
  element: string;
}

export const DesignSystemChecker: React.FC = () => {
  const [issues, setIssues] = useState<ComplianceIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkDesignCompliance = () => {
    setIsChecking(true);
    
    setTimeout(() => {
      const foundIssues: ComplianceIssue[] = [];
      
      // Check for non-cultural colors
      const elements = document.querySelectorAll('*');
      elements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;
        
        // Check for hardcoded non-cultural colors
        if (backgroundColor.includes('rgb(') && !backgroundColor.includes('hsla(37') && !backgroundColor.includes('hsla(120')) {
          const className = element.className;
          if (className && !className.includes('bg-white') && !className.includes('bg-black')) {
            foundIssues.push({
              type: 'color',
              severity: 'medium',
              description: 'Non-cultural background color detected',
              element: element.tagName.toLowerCase() + (className ? `.${className.split(' ')[0]}` : '')
            });
          }
        }
      });
      
      // Check for missing cultural patterns
      const cards = document.querySelectorAll('[class*="card"]');
      cards.forEach((card) => {
        if (!card.className.includes('cultural') && !card.querySelector('[style*="background"]')) {
          foundIssues.push({
            type: 'pattern',
            severity: 'low',
            description: 'Card missing cultural background pattern',
            element: 'card'
          });
        }
      });
      
      // Check for inconsistent typography
      const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headers.forEach((header) => {
        if (!header.className.includes('font-bold') && !header.className.includes('font-semibold')) {
          foundIssues.push({
            type: 'typography',
            severity: 'medium',
            description: 'Header missing cultural typography styling',
            element: header.tagName.toLowerCase()
          });
        }
      });
      
      setIssues(foundIssues);
      setIsChecking(false);
    }, 2000);
  };

  const getSeverityIcon = (severity: ComplianceIssue['severity']) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: ComplianceIssue['type']) => {
    switch (type) {
      case 'color':
        return <Palette className="w-4 h-4" />;
      case 'typography':
        return <Type className="w-4 h-4" />;
      case 'spacing':
      case 'pattern':
        return <Layout className="w-4 h-4" />;
    }
  };

  return (
    <CulturalCard 
      title="Design System Compliance" 
      culturalIcon="🎨"
      className="max-w-md"
    >
      <div className="space-y-4">
        <button
          onClick={checkDesignCompliance}
          disabled={isChecking}
          className={cn(
            'w-full py-2 px-4 rounded-lg transition-all duration-200',
            culturalStyles.components.primaryButton,
            isChecking && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isChecking ? 'Checking Compliance...' : 'Check Design Compliance'}
        </button>

        {issues.length > 0 && (
          <div className="space-y-2">
            <h4 className={cn(culturalStyles.typography.label, 'font-semibold')}>
              Issues Found ({issues.length})
            </h4>
            
            {issues.map((issue, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-2">
                  {getSeverityIcon(issue.severity)}
                  {getTypeIcon(issue.type)}
                </div>
                <div className="flex-1">
                  <p className={cn(culturalStyles.typography.caption, 'font-medium')}>
                    {issue.description}
                  </p>
                  <p className={cn(culturalStyles.typography.caption, 'text-xs opacity-70')}>
                    Element: {issue.element}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {issues.length === 0 && !isChecking && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className={cn(culturalStyles.typography.caption, culturalStyles.colors.success)}>
              Design system compliance verified! {culturalStyles.elements.success}
            </p>
          </div>
        )}
      </div>
    </CulturalCard>
  );
};
