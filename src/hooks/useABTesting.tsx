
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ABTest {
  id: string;
  name: string;
  variants: {
    [key: string]: {
      name: string;
      weight: number;
      config: any;
    };
  };
  isActive: boolean;
}

interface ABTestContextType {
  getVariant: (testId: string) => string;
  trackEvent: (testId: string, event: string, data?: any) => void;
  getUserGroup: (testId: string) => string;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

// Define active A/B tests
const activeTests: ABTest[] = [
  {
    id: 'color_palette',
    name: 'Color Palette Preference',
    variants: {
      traditional: {
        name: 'Traditional Saffron/Gold',
        weight: 50,
        config: {
          primary: 'hsl(var(--saffron))',
          accent: 'hsl(var(--amber))',
          theme: 'traditional'
        }
      },
      modern: {
        name: 'Modern Orange/Blue',
        weight: 50,
        config: {
          primary: 'hsl(25, 95%, 53%)',
          accent: 'hsl(217, 91%, 60%)',
          theme: 'modern'
        }
      }
    },
    isActive: true
  },
  {
    id: 'navigation_style',
    name: 'Navigation Layout',
    variants: {
      horizontal: {
        name: 'Horizontal Tabs',
        weight: 50,
        config: { layout: 'horizontal' }
      },
      vertical: {
        name: 'Vertical Sidebar',
        weight: 50,
        config: { layout: 'vertical' }
      }
    },
    isActive: true
  },
  {
    id: 'card_design',
    name: 'Card Design Style',
    variants: {
      minimal: {
        name: 'Minimal Design',
        weight: 50,
        config: { style: 'minimal', patterns: false }
      },
      cultural: {
        name: 'Cultural Border Patterns',
        weight: 50,
        config: { style: 'cultural', patterns: true }
      }
    },
    isActive: true
  }
];

export const ABTestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userGroups, setUserGroups] = useState<{ [testId: string]: string }>({});

  useEffect(() => {
    // Initialize user groups for all active tests
    const storedGroups = localStorage.getItem('ab_test_groups');
    let groups = storedGroups ? JSON.parse(storedGroups) : {};

    activeTests.forEach(test => {
      if (test.isActive && !groups[test.id]) {
        groups[test.id] = assignUserToVariant(test);
      }
    });

    setUserGroups(groups);
    localStorage.setItem('ab_test_groups', JSON.stringify(groups));
  }, []);

  const assignUserToVariant = (test: ABTest): string => {
    const random = Math.random() * 100;
    let cumulativeWeight = 0;

    for (const [variantId, variant] of Object.entries(test.variants)) {
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        return variantId;
      }
    }

    return Object.keys(test.variants)[0]; // Fallback
  };

  const getVariant = (testId: string): string => {
    return userGroups[testId] || 'default';
  };

  const getUserGroup = (testId: string): string => {
    const variant = getVariant(testId);
    const test = activeTests.find(t => t.id === testId);
    return test?.variants[variant]?.name || 'Default';
  };

  const trackEvent = (testId: string, event: string, data?: any) => {
    const variant = getVariant(testId);
    
    // Track the event (integrate with your analytics system)
    console.log('AB Test Event:', {
      testId,
      variant,
      event,
      data,
      timestamp: new Date().toISOString()
    });

    // Here you would send to your analytics service
    // analytics.track('ab_test_event', { testId, variant, event, data });
  };

  return (
    <ABTestContext.Provider value={{ getVariant, trackEvent, getUserGroup }}>
      {children}
    </ABTestContext.Provider>
  );
};

export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }
  return context;
};

// Hook for getting test configuration
export const useTestConfig = (testId: string) => {
  const { getVariant } = useABTest();
  const variant = getVariant(testId);
  const test = activeTests.find(t => t.id === testId);
  
  return test?.variants[variant]?.config || {};
};
