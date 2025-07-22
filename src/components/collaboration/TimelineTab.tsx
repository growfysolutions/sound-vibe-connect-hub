
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';

interface TimelineTabProps {
  projectData: {
    phase: string;
    progress: number;
    daysRemaining: number;
  };
}

const TimelineTab = ({ projectData }: TimelineTabProps) => {
  const phases = [
    {
      id: 'preproduction',
      name: 'Pre-production',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      milestones: [
        { name: 'Concept Development', status: 'completed', date: '2024-01-05' },
        { name: 'Track Selection', status: 'completed', date: '2024-01-10' },
        { name: 'Arrangement Planning', status: 'completed', date: '2024-01-15' }
      ]
    },
    {
      id: 'recording',
      name: 'Recording',
      status: 'active',
      progress: 65,
      startDate: '2024-01-16',
      endDate: '2024-02-15',
      milestones: [
        { name: 'Vocal Recording', status: 'completed', date: '2024-01-25' },
        { name: 'Instrument Tracking', status: 'in-progress', date: '2024-02-05' },
        { name: 'Overdubs & Harmonies', status: 'pending', date: '2024-02-12' }
      ]
    },
    {
      id: 'mixing',
      name: 'Mixing',
      status: 'pending',
      progress: 0,
      startDate: '2024-02-16',
      endDate: '2024-03-10',
      milestones: [
        { name: 'Rough Mix', status: 'pending', date: '2024-02-25' },
        { name: 'Detailed Mix', status: 'pending', date: '2024-03-05' },
        { name: 'Mix Approval', status: 'pending', date: '2024-03-10' }
      ]
    },
    {
      id: 'mastering',
      name: 'Mastering',
      status: 'pending',
      progress: 0,
      startDate: '2024-03-11',
      endDate: '2024-03-25',
      milestones: [
        { name: 'Master Creation', status: 'pending', date: '2024-03-18' },
        { name: 'Quality Review', status: 'pending', date: '2024-03-22' },
        { name: 'Final Delivery', status: 'pending', date: '2024-03-25' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'active': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'in-progress': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'pending': return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'active': return Target;
      case 'in-progress': return Clock;
      case 'pending': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="h-full space-y-6">
      {/* Project Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Project Timeline Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {projectData.progress}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
              <Progress value={projectData.progress} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">
                {projectData.daysRemaining}
              </div>
              <div className="text-sm text-muted-foreground">Days Remaining</div>
            </div>
            <div className="text-center">
              <Badge className="bg-primary/20 border-primary/30 text-primary">
                Current: {projectData.phase}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Production Phases</h3>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          
          {phases.map((phase, index) => {
            const StatusIcon = getStatusIcon(phase.status);
            
            return (
              <Card key={phase.id} className={`ml-16 mb-4 ${getStatusColor(phase.status)} border`}>
                <div className="absolute -left-8 top-6 w-4 h-4 bg-card border-2 border-primary rounded-full flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${
                    phase.status === 'completed' ? 'bg-green-400' :
                    phase.status === 'active' ? 'bg-blue-400' :
                    phase.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} />
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <StatusIcon className="w-5 h-5" />
                      <span>{phase.name}</span>
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(phase.status)}>
                      {phase.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{phase.startDate} - {phase.endDate}</span>
                    <span>{phase.progress}% Complete</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Progress value={phase.progress} className="mb-4" />
                  
                  {/* Milestones */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Milestones:</h4>
                    {phase.milestones.map((milestone, mIndex) => (
                      <div key={mIndex} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            milestone.status === 'completed' ? 'bg-green-400' :
                            milestone.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'
                          }`} />
                          <span className={milestone.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                            {milestone.name}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs">{milestone.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <Card className="border-amber-400/30 bg-amber-400/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <span>Upcoming Deadlines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-400/10">
              <div>
                <div className="font-medium">Instrument Tracking</div>
                <div className="text-sm text-muted-foreground">Recording Phase</div>
              </div>
              <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                3 days left
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <div className="font-medium">Overdubs & Harmonies</div>
                <div className="text-sm text-muted-foreground">Recording Phase</div>
              </div>
              <Badge variant="outline" className="text-muted-foreground">
                7 days left
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineTab;
