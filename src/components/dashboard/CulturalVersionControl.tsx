
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GitBranch, Tag, Clock, Users, Palette, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface CulturalCommit {
  id: string;
  type: 'feat' | 'fix' | 'design' | 'perf' | 'cultural';
  title: string;
  description: string;
  timestamp: string;
  author: string;
  culturalImpact: 'high' | 'medium' | 'low';
  communityFeedback?: number;
}

interface CulturalMilestone {
  version: string;
  name: string;
  releaseDate: string;
  features: string[];
  culturalValidation: {
    authenticityScore: number;
    communityApproval: number;
    expertReviews: number;
  };
}

export const CulturalVersionControl: React.FC = () => {
  const [isCreatingCommit, setIsCreatingCommit] = useState(false);
  const [commitForm, setCommitForm] = useState({
    type: 'feat' as const,
    title: '',
    description: '',
    culturalImpact: 'medium' as const
  });

  const recentCommits: CulturalCommit[] = [
    {
      id: '1',
      type: 'cultural',
      title: 'Add traditional dhol loading animation to file uploads',
      description: 'Implemented culturally authentic loading states using traditional dhol drum patterns',
      timestamp: '2 hours ago',
      author: 'Cultural Design Team',
      culturalImpact: 'high',
      communityFeedback: 94
    },
    {
      id: '2',
      type: 'fix',
      title: 'Improve contrast ratio for cultural color palette accessibility',
      description: 'Enhanced accessibility while maintaining cultural color authenticity',
      timestamp: '5 hours ago',
      author: 'Accessibility Team',
      culturalImpact: 'medium',
      communityFeedback: 87
    },
    {
      id: '3',
      type: 'design',
      title: 'Integrate phulkari pattern into profile card borders',
      description: 'Added traditional Punjabi embroidery patterns to enhance cultural representation',
      timestamp: '1 day ago',
      author: 'Cultural Design Team',
      culturalImpact: 'high',
      communityFeedback: 96
    },
    {
      id: '4',
      type: 'perf',
      title: 'Optimize cultural background textures for mobile devices',
      description: 'Improved performance while preserving cultural visual elements',
      timestamp: '2 days ago',
      author: 'Performance Team',
      culturalImpact: 'low',
      communityFeedback: 82
    }
  ];

  const milestones: CulturalMilestone[] = [
    {
      version: 'v2.1.0',
      name: 'Vaisakhi Cultural Update',
      releaseDate: 'April 13, 2024',
      features: [
        'Traditional festival themes',
        'Seasonal color palettes',
        'Cultural event integration',
        'Community celebration features'
      ],
      culturalValidation: {
        authenticityScore: 95,
        communityApproval: 92,
        expertReviews: 8
      }
    },
    {
      version: 'v2.0.0',
      name: 'Cultural Foundation Release',
      releaseDate: 'March 1, 2024',
      features: [
        'Phulkari pattern system',
        'Traditional color scheme',
        'Cultural iconography',
        'Punjabi typography support'
      ],
      culturalValidation: {
        authenticityScore: 88,
        communityApproval: 89,
        expertReviews: 12
      }
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cultural': return '🎭';
      case 'feat': return '✨';
      case 'fix': return '🔧';
      case 'design': return '🎨';
      case 'perf': return '⚡';
      default: return '📝';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCreateCommit = () => {
    // Here you would integrate with your version control system
    console.log('Creating commit:', commitForm);
    setIsCreatingCommit(false);
    setCommitForm({
      type: 'feat',
      title: '',
      description: '',
      culturalImpact: 'medium'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-saffron">Cultural Version Control</h2>
          <p className="text-muted-foreground">Track cultural authenticity and community milestones</p>
        </div>
        <Dialog open={isCreatingCommit} onOpenChange={setIsCreatingCommit}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-saffron to-amber-500">
              <GitBranch className="w-4 h-4 mr-2" />
              Create Cultural Commit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Cultural Commit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Commit Type</label>
                <select
                  value={commitForm.type}
                  onChange={(e) => setCommitForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="feat">Feature</option>
                  <option value="fix">Fix</option>
                  <option value="design">Design</option>
                  <option value="perf">Performance</option>
                  <option value="cultural">Cultural</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={commitForm.title}
                  onChange={(e) => setCommitForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of changes"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={commitForm.description}
                  onChange={(e) => setCommitForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of cultural impact and changes"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cultural Impact</label>
                <select
                  value={commitForm.culturalImpact}
                  onChange={(e) => setCommitForm(prev => ({ ...prev, culturalImpact: e.target.value as any }))}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <Button onClick={handleCreateCommit} className="w-full">
                Create Commit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Commits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Cultural Commits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCommits.map((commit) => (
                <div key={commit.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getTypeIcon(commit.type)}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{commit.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {commit.description}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {commit.type}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${getImpactColor(commit.culturalImpact)}`} />
                          <span className="text-xs text-muted-foreground">
                            {commit.culturalImpact} impact
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{commit.timestamp}</div>
                      {commit.communityFeedback && (
                        <div className="text-xs text-green-600 mt-1">
                          {commit.communityFeedback}% approval
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cultural Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Cultural Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">{milestone.version}</div>
                      <div className="text-sm text-muted-foreground">{milestone.name}</div>
                    </div>
                    <Badge variant="outline">{milestone.releaseDate}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <div className="font-medium mb-1">Features:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {milestone.features.map((feature, i) => (
                          <li key={i} className="text-muted-foreground text-xs">{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-saffron">
                          {milestone.culturalValidation.authenticityScore}%
                        </div>
                        <div className="text-muted-foreground">Authenticity</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">
                          {milestone.culturalValidation.communityApproval}%
                        </div>
                        <div className="text-muted-foreground">Community</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">
                          {milestone.culturalValidation.expertReviews}
                        </div>
                        <div className="text-muted-foreground">Expert Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
