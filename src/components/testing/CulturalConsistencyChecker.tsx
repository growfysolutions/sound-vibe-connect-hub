
import React, { useState } from 'react';
import { CulturalCard } from '@/components/cards/CulturalCard';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { culturalStyles } from '@/lib/cultural-design';
import { CheckCircle, AlertTriangle, Eye, Palette, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsistencyCheck {
  id: string;
  category: 'colors' | 'typography' | 'patterns' | 'components' | 'icons';
  title: string;
  description: string;
  selector: string;
  expectedValue: string;
  checkFunction: () => boolean;
  status: 'pending' | 'checking' | 'passed' | 'failed';
  issues?: string[];
}

export const CulturalConsistencyChecker: React.FC = () => {
  const [checks, setChecks] = useState<ConsistencyCheck[]>([
    {
      id: 'primary-color-usage',
      category: 'colors',
      title: 'Primary Saffron Color Usage',
      description: 'Verify all primary elements use saffron (#FF9500) gradient',
      selector: '.bg-gradient-to-r.from-saffron',
      expectedValue: 'Saffron gradient backgrounds on primary buttons and CTAs',
      checkFunction: () => {
        const elements = document.querySelectorAll('.bg-gradient-to-r.from-saffron');
        return elements.length > 0;
      },
      status: 'pending'
    },
    {
      id: 'cultural-button-consistency',
      category: 'components',
      title: 'Cultural Button Component Usage',
      description: 'Ensure all buttons use CulturalButton component',
      selector: 'button:not([class*="cultural"])',
      expectedValue: 'All interactive buttons should use CulturalButton styling',
      checkFunction: () => {
        const nonCulturalButtons = document.querySelectorAll('button:not([class*="cultural"]):not([class*="bg-gradient"])');
        return nonCulturalButtons.length === 0;
      },
      status: 'pending'
    },
    {
      id: 'typography-headers',
      category: 'typography',
      title: 'Header Typography Consistency',
      description: 'Check if headers use cultural typography system',
      selector: 'h1, h2, h3, h4, h5, h6',
      expectedValue: 'Headers should use font-bold or font-semibold with proper spacing',
      checkFunction: () => {
        const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let consistentHeaders = 0;
        headers.forEach(header => {
          if (header.className.includes('font-bold') || header.className.includes('font-semibold')) {
            consistentHeaders++;
          }
        });
        return consistentHeaders / headers.length > 0.8; // 80% threshold
      },
      status: 'pending'
    },
    {
      id: 'cultural-patterns',
      category: 'patterns',
      title: 'Cultural Background Patterns',
      description: 'Verify cards include cultural pattern overlays',
      selector: '[class*="card"]',
      expectedValue: 'Cards should have cultural pattern backgrounds or borders',
      checkFunction: () => {
        const cards = document.querySelectorAll('[class*="card"]');
        let culturalCards = 0;
        cards.forEach(card => {
          if (card.className.includes('cultural') || 
              card.querySelector('[style*="background"]') ||
              card.className.includes('border-saffron')) {
            culturalCards++;
          }
        });
        return culturalCards / cards.length > 0.6; // 60% threshold
      },
      status: 'pending'
    },
    {
      id: 'punjabi-font-support',
      category: 'typography',
      title: 'Punjabi Font Support',
      description: 'Check if Gurmukhi script renders correctly',
      selector: '[style*="serif"]',
      expectedValue: 'Punjabi text should have proper font family support',
      checkFunction: () => {
        // Create a test element with Punjabi text
        const testElement = document.createElement('div');
        testElement.style.fontFamily = 'serif';
        testElement.innerHTML = 'ਪੰਜਾਬੀ';
        document.body.appendChild(testElement);
        
        // Check if the text renders (simple heuristic)
        const isSupported = testElement.offsetWidth > 0 && testElement.offsetHeight > 0;
        document.body.removeChild(testElement);
        
        return isSupported;
      },
      status: 'pending'
    },
    {
      id: 'cultural-icons',
      category: 'icons',
      title: 'Cultural Icon Integration',
      description: 'Verify cultural symbols are used alongside standard icons',
      selector: '[class*="cultural"]',
      expectedValue: 'Cultural symbols should be present in navigation and headers',
      checkFunction: () => {
        const culturalElements = document.querySelectorAll('[class*="cultural"]');
        const emojis = document.evaluate(
          '//text()[contains(., "🎵") or contains(., "🎹") or contains(., "🤝") or contains(., "📈")]',
          document,
          null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        return culturalElements.length > 0 || emojis.snapshotLength > 0;
      },
      status: 'pending'
    }
  ]);

  const runConsistencyCheck = async () => {
    setChecks(prev => prev.map(check => ({ ...check, status: 'checking' })));

    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Stagger checks

      setChecks(prev => prev.map((check, index) => {
        if (index === i) {
          try {
            const passed = check.checkFunction();
            return {
              ...check,
              status: passed ? 'passed' : 'failed',
              issues: passed ? [] : [`${check.title} validation failed`]
            };
          } catch (error) {
            return {
              ...check,
              status: 'failed',
              issues: [`Error running check: ${error}`]
            };
          }
        }
        return check;
      }));
    }
  };

  const getCategoryIcon = (category: ConsistencyCheck['category']) => {
    switch (category) {
      case 'colors':
        return <Palette className="w-4 h-4" />;
      case 'typography':
        return <Type className="w-4 h-4" />;
      case 'patterns':
        return <Eye className="w-4 h-4" />;
      case 'components':
        return <div className="w-4 h-4 border border-current rounded" />;
      case 'icons':
        return <span className="text-sm">🎭</span>;
    }
  };

  const getStatusIcon = (status: ConsistencyCheck['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'checking':
        return <div className="w-5 h-5 border-2 border-saffron border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-5 h-5 border border-muted-foreground rounded-full" />;
    }
  };

  const passedChecks = checks.filter(c => c.status === 'passed').length;
  const failedChecks = checks.filter(c => c.status === 'failed').length;
  const totalChecks = checks.length;

  return (
    <CulturalCard 
      title="Cultural Design Consistency Checker" 
      culturalIcon="🎨"
      subtitle="Automated validation of SoundVibe cultural design system"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Test cultural design implementation across all components and pages
          </div>
          <CulturalButton
            variant="primary"
            size="sm"
            onClick={runConsistencyCheck}
            disabled={checks.some(c => c.status === 'checking')}
          >
            {checks.some(c => c.status === 'checking') ? 'Checking...' : 'Run Consistency Check'}
          </CulturalButton>
        </div>

        {/* Results Summary */}
        {(passedChecks > 0 || failedChecks > 0) && (
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-gradient-to-r from-saffron/5 to-amber-500/5 border border-saffron/20">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{passedChecks}</div>
              <div className="text-xs text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{failedChecks}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {Math.round((passedChecks / totalChecks) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
          </div>
        )}

        {/* Individual Checks */}
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2 pt-1">
                {getCategoryIcon(check.category)}
                {getStatusIcon(check.status)}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-sm">{check.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{check.description}</p>
                
                <div className="text-xs">
                  <div className="text-muted-foreground">
                    <strong>Expected:</strong> {check.expectedValue}
                  </div>
                  {check.status === 'failed' && check.issues && (
                    <div className="text-red-600 mt-1">
                      <strong>Issues:</strong> {check.issues.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <strong>Note:</strong> This checker validates the presence of cultural design elements in the current page. 
          Run this on different pages to get a comprehensive view of design consistency across the entire application.
        </div>
      </div>
    </CulturalCard>
  );
};
