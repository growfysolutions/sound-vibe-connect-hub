import React, { useState } from 'react';
import { CulturalCard } from '@/components/cards/CulturalCard';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface IntegrationIssue {
  id: string;
  title: string;
  description: string;
  category: 'navigation' | 'design' | 'performance' | 'functionality' | 'cultural';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  affectedPages: string[];
  expectedBehavior: string;
  actualBehavior: string;
  culturalImpact: 'high' | 'medium' | 'low';
  stepsToReproduce: string[];
  assignedTo?: string;
  dateReported: string;
  dateResolved?: string;
}

const mockIssues: IntegrationIssue[] = [
  {
    id: 'NAV-001',
    title: 'Breadcrumb trail missing cultural styling on project pages',
    description: 'Project detail pages show standard breadcrumbs instead of cultural design system',
    category: 'design',
    priority: 'high',
    status: 'open',
    affectedPages: ['/projects/:id', '/collaboration/:id'],
    expectedBehavior: 'Breadcrumbs should use cultural colors and typography with traditional separator elements',
    actualBehavior: 'Standard gray breadcrumbs with default separators',
    culturalImpact: 'high',
    stepsToReproduce: [
      'Navigate to dashboard',
      'Click on any project card',
      'Observe breadcrumb styling at top of page'
    ],
    dateReported: '2024-01-15'
  },
  {
    id: 'BTN-002',
    title: 'Legacy button styles still present in modal dialogs',
    description: 'Some modal dialogs use old button styling instead of CulturalButton component',
    category: 'design',
    priority: 'medium',
    status: 'in-progress',
    affectedPages: ['/messages', '/profile/edit'],
    expectedBehavior: 'All buttons should use CulturalButton with saffron gradient and cultural hover effects',
    actualBehavior: 'Some buttons still use default shadcn button styling',
    culturalImpact: 'medium',
    stepsToReproduce: [
      'Open any modal dialog',
      'Check if action buttons use cultural styling',
      'Compare with design system standards'
    ],
    assignedTo: 'Design Team',
    dateReported: '2024-01-14'
  },
  {
    id: 'PERF-003',
    title: 'Cultural background patterns causing performance lag on mobile',
    description: 'Complex cultural patterns slow down scroll performance on mobile devices',
    category: 'performance',
    priority: 'critical',
    status: 'open',
    affectedPages: ['/dashboard', '/discover', '/projects'],
    expectedBehavior: 'Smooth 60fps scrolling on all mobile devices',
    actualBehavior: 'Choppy scrolling, especially on older Android devices',
    culturalImpact: 'low',
    stepsToReproduce: [
      'Open app on mobile device',
      'Navigate to dashboard',
      'Scroll through content rapidly',
      'Notice frame drops and lag'
    ],
    dateReported: '2024-01-13'
  },
  {
    id: 'CULT-004',
    title: 'Punjabi text rendering incorrectly in artist names',
    description: 'Gurmukhi script not displaying properly in artist profile cards',
    category: 'cultural',
    priority: 'high',
    status: 'open',
    affectedPages: ['/network', '/discover', '/profile/:id'],
    expectedBehavior: 'Punjabi text should render correctly with proper font support',
    actualBehavior: 'Boxes or incorrect characters shown instead of Punjabi text',
    culturalImpact: 'high',
    stepsToReproduce: [
      'Create profile with Punjabi name "ਜਸਬੀਰ ਸਿੰਘ"',
      'View profile in network section',
      'Check if text renders correctly'
    ],
    dateReported: '2024-01-12'
  },
  {
    id: 'NAV-005',
    title: 'Mobile navigation missing cultural icons and animations',
    description: 'Bottom navigation on mobile lacks cultural icon set and transition animations',
    category: 'navigation',
    priority: 'medium',
    status: 'resolved',
    affectedPages: ['/dashboard (mobile)', '/discover (mobile)'],
    expectedBehavior: 'Mobile nav should include cultural icons with smooth transition animations',
    actualBehavior: 'Standard icons without cultural styling or animations',
    culturalImpact: 'medium',
    stepsToReproduce: [
      'Open app on mobile device',
      'Navigate between tabs using bottom navigation',
      'Check icon styling and animations'
    ],
    dateReported: '2024-01-10',
    dateResolved: '2024-01-16'
  }
];

export const IntegrationIssuesTracker: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'open' | 'cultural'>('all');
  const [issues, setIssues] = useState(mockIssues);

  const filteredIssues = issues.filter(issue => {
    switch (filter) {
      case 'critical':
        return issue.priority === 'critical';
      case 'open':
        return issue.status === 'open';
      case 'cultural':
        return issue.category === 'cultural' || issue.culturalImpact === 'high';
      default:
        return true;
    }
  });

  const getCategoryIcon = (category: IntegrationIssue['category']) => {
    switch (category) {
      case 'navigation':
        return '🧭';
      case 'design':
        return '🎨';
      case 'performance':
        return '⚡';
      case 'functionality':
        return '⚙️';
      case 'cultural':
        return '🎭';
      default:
        return '🔧';
    }
  };

  const getPriorityColor = (priority: IntegrationIssue['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
    }
  };

  const getStatusIcon = (status: IntegrationIssue['status']) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const markAsResolved = (issueId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: 'resolved', dateResolved: new Date().toISOString().split('T')[0] }
        : issue
    ));
  };

  return (
    <div className="space-y-6">
      <CulturalCard 
        title="Integration Issues Tracker" 
        culturalIcon="🐛"
        subtitle="Document and track user journey integration problems"
      >
        <div className="space-y-4">
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2">
            {['all', 'critical', 'open', 'cultural'].map((filterType) => (
              <CulturalButton
                key={filterType}
                variant={filter === filterType ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter(filterType as any)}
              >
                {filterType === 'all' && '🔍 All Issues'}
                {filterType === 'critical' && '🚨 Critical'}
                {filterType === 'open' && '📂 Open'}
                {filterType === 'cultural' && '🎭 Cultural Impact'}
              </CulturalButton>
            ))}
          </div>

          {/* Issues Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-gradient-to-r from-saffron/5 to-amber-500/5 border border-saffron/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {issues.filter(i => i.status === 'open').length}
              </div>
              <div className="text-sm text-muted-foreground">Open Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {issues.filter(i => i.priority === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {issues.filter(i => i.culturalImpact === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">Cultural Impact</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {issues.filter(i => i.status === 'resolved').length}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>

          {/* Issues List */}
          <div className="space-y-3">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getCategoryIcon(issue.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{issue.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {issue.id}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {issue.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                        <Badge variant="outline">
                          {issue.category}
                        </Badge>
                        <Badge variant={issue.culturalImpact === 'high' ? 'default' : 'outline'}>
                          Cultural: {issue.culturalImpact}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(issue.status)}
                    {issue.status === 'open' && (
                      <CulturalButton
                        variant="secondary"
                        size="sm"
                        onClick={() => markAsResolved(issue.id)}
                      >
                        Mark Resolved
                      </CulturalButton>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>Expected:</strong>
                    <p className="text-muted-foreground mt-1">{issue.expectedBehavior}</p>
                  </div>
                  <div>
                    <strong>Actual:</strong>
                    <p className="text-muted-foreground mt-1">{issue.actualBehavior}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <strong>Affected Pages:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {issue.affectedPages.map((page) => (
                      <Badge key={page} variant="outline" className="text-xs">
                        {page}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Reported: {issue.dateReported}</span>
                  {issue.dateResolved && <span>Resolved: {issue.dateResolved}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CulturalCard>
    </div>
  );
};
