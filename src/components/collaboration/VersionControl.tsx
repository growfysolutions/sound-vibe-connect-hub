
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  GitBranch, 
  Play, 
  Download, 
  RotateCcw, 
  MessageSquare, 
  Calendar, 
  User, 
  FileAudio,
  GitCommit,
  GitMerge,
  Save,
  Clock
} from 'lucide-react';

interface ProjectVersion {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdByAvatar: string;
  createdAt: string;
  isCurrent: boolean;
  changes: string[];
  fileSize: string;
  duration: string;
  comments: number;
}

interface VersionControlProps {
  projectId: string;
}

const VersionControl = ({ projectId }: VersionControlProps) => {
  const [versions, setVersions] = useState<ProjectVersion[]>([
    {
      id: '1',
      name: 'Final Mix v3.1',
      description: 'Added subtle reverb to vocals and adjusted tabla levels for better balance.',
      createdBy: 'Priya Sharma',
      createdByAvatar: '/placeholder.svg',
      createdAt: '2024-01-25 14:30',
      isCurrent: true,
      changes: ['Vocal reverb adjustment', 'Tabla level balancing', 'Master bus compression'],
      fileSize: '45.2 MB',
      duration: '3:42',
      comments: 3
    },
    {
      id: '2',
      name: 'Vocal Recording Complete',
      description: 'Completed all vocal takes with harmony layers and ad-libs.',
      createdBy: 'Jasbir Singh',
      createdByAvatar: '/placeholder.svg',
      createdAt: '2024-01-24 18:45',
      isCurrent: false,
      changes: ['Lead vocal recording', 'Harmony layers added', 'Vocal ad-libs'],
      fileSize: '38.7 MB',
      duration: '3:41',
      comments: 5
    },
    {
      id: '3',
      name: 'Initial Arrangement',
      description: 'Basic track arrangement with harmonium, tabla, and guide vocals.',
      createdBy: 'Amit Kumar',
      createdByAvatar: '/placeholder.svg',
      createdAt: '2024-01-20 11:15',
      isCurrent: false,
      changes: ['Harmonium arrangement', 'Tabla patterns', 'Guide vocal reference'],
      fileSize: '28.4 MB',
      duration: '3:38',
      comments: 8
    },
    {
      id: '4',
      name: 'Demo Sketch',
      description: 'Initial demo with basic chord progression and melody ideas.',
      createdBy: 'Priya Sharma',
      createdByAvatar: '/placeholder.svg',
      createdAt: '2024-01-15 09:30',
      isCurrent: false,
      changes: ['Basic chord progression', 'Melody sketch', 'Tempo setting'],
      fileSize: '15.2 MB',
      duration: '3:35',
      comments: 12
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newVersionDescription, setNewVersionDescription] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<ProjectVersion | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<string[]>([]);

  const createNewVersion = () => {
    if (!newVersionDescription.trim()) return;

    const newVersion: ProjectVersion = {
      id: Date.now().toString(),
      name: `Version ${versions.length + 1}`,
      description: newVersionDescription,
      createdBy: 'You',
      createdByAvatar: '/placeholder.svg',
      createdAt: new Date().toLocaleString(),
      isCurrent: true,
      changes: ['Manual save point'],
      fileSize: '47.1 MB',
      duration: '3:43',
      comments: 0
    };

    setVersions(prev => 
      prev.map(v => ({ ...v, isCurrent: false })).concat(newVersion)
    );
    setNewVersionDescription('');
    setIsCreateDialogOpen(false);
  };

  const rollbackToVersion = (versionId: string) => {
    setVersions(prev =>
      prev.map(v => ({ 
        ...v, 
        isCurrent: v.id === versionId 
      }))
    );
  };

  const toggleCompareVersion = (versionId: string) => {
    if (compareVersions.includes(versionId)) {
      setCompareVersions(prev => prev.filter(id => id !== versionId));
    } else if (compareVersions.length < 2) {
      setCompareVersions(prev => [...prev, versionId]);
    }
  };

  const VersionCard = ({ version }: { version: ProjectVersion }) => (
    <Card className={`transition-all ${
      version.isCurrent 
        ? 'border-primary/50 bg-primary/5' 
        : compareVersions.includes(version.id)
          ? 'border-blue-400/50 bg-blue-400/5'
          : 'bg-card/50'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center space-x-2 text-base">
              <GitCommit className="w-4 h-4" />
              <span>{version.name}</span>
              {version.isCurrent && (
                <Badge className="bg-primary/20 border-primary/30 text-primary">
                  Current
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {version.description}
            </p>
          </div>
          
          {compareMode && (
            <Button
              variant={compareVersions.includes(version.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleCompareVersion(version.id)}
              disabled={!compareVersions.includes(version.id) && compareVersions.length >= 2}
            >
              {compareVersions.includes(version.id) ? 'Selected' : 'Compare'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Version Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {version.createdBy.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">{version.createdBy}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{version.createdAt}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <FileAudio className="w-4 h-4" />
            <span>{version.fileSize} • {version.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span>{version.comments} comments</span>
          </div>
        </div>

        {/* Changes */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Changes:</h4>
          <div className="space-y-1">
            {version.changes.map((change, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">{change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Play className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          {!version.isCurrent && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => rollbackToVersion(version.id)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Restore
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Version Control</h3>
        <div className="flex space-x-2">
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setCompareMode(!compareMode);
              setCompareVersions([]);
            }}
          >
            <GitMerge className="w-4 h-4 mr-2" />
            {compareMode ? 'Exit Compare' : 'Compare Versions'}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Version</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe the changes in this version..."
                  value={newVersionDescription}
                  onChange={(e) => setNewVersionDescription(e.target.value)}
                  rows={4}
                />
                <Button onClick={createNewVersion} className="w-full">
                  Save Project Version
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Compare Mode Info */}
      {compareMode && (
        <Card className="border-blue-400/30 bg-blue-400/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitMerge className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Compare Mode</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                  {compareVersions.length}/2 selected
                </Badge>
              </div>
              {compareVersions.length === 2 && (
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                  View Comparison
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Stats */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5" />
            <span>Project History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{versions.length}</div>
              <div className="text-sm text-muted-foreground">Total Versions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {versions.reduce((acc, v) => acc + v.comments, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Comments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {new Set(versions.map(v => v.createdBy)).size}
              </div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">10</div>
              <div className="text-sm text-muted-foreground">Days Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Timeline */}
      <div className="space-y-4">
        <h4 className="font-medium">Version Timeline</h4>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          
          {versions.map((version, index) => (
            <div key={version.id} className="relative ml-16 mb-6">
              {/* Timeline Dot */}
              <div className={`absolute -left-8 top-6 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                version.isCurrent 
                  ? 'bg-primary border-primary' 
                  : 'bg-card border-border'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  version.isCurrent ? 'bg-primary-foreground' : 'bg-muted-foreground'
                }`} />
              </div>
              
              <VersionCard version={version} />
            </div>
          ))}
        </div>
      </div>

      {/* Auto-save Info */}
      <Card className="border-green-400/30 bg-green-400/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Auto-save Enabled</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Last auto-save: 2 minutes ago
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VersionControl;
