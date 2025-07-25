import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User,
  Calendar,
  Flag,
  MessageSquare,
  FileText,
  MoreHorizontal
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate: string;
  progress: number;
  comments: number;
  attachments: number;
  tags: string[];
  createdAt: string;
}

interface EnhancedTaskManagerProps {
  projectId: string;
}

const EnhancedTaskManager = ({ }: EnhancedTaskManagerProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Record lead vocals',
      description: 'Record the main vocal track for the chorus and verses',
      status: 'in_progress',
      priority: 'high',
      assignee: {
        id: '1',
        name: 'Arijit Singh',
        avatar: '/avatars/arijit.jpg'
      },
      dueDate: '2024-02-15',
      progress: 65,
      comments: 3,
      attachments: 2,
      tags: ['vocals', 'recording'],
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      title: 'Mix harmonium tracks',
      description: 'Balance and mix the harmonium recordings with proper EQ',
      status: 'todo',
      priority: 'medium',
      assignee: {
        id: '2',
        name: 'Pritam Chakraborty',
        avatar: '/avatars/pritam.jpg'
      },
      dueDate: '2024-02-20',
      progress: 0,
      comments: 1,
      attachments: 0,
      tags: ['mixing', 'harmonium'],
      createdAt: '2024-01-22'
    },
    {
      id: '3',
      title: 'Arrange backing vocals',
      description: 'Create harmonies and backing vocal arrangements',
      status: 'review',
      priority: 'medium',
      assignee: {
        id: '3',
        name: 'Sunidhi Chauhan',
        avatar: '/avatars/sunidhi.jpg'
      },
      dueDate: '2024-02-18',
      progress: 85,
      comments: 5,
      attachments: 1,
      tags: ['vocals', 'arrangement'],
      createdAt: '2024-01-18'
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTab, setActiveTab] = useState('kanban');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-500/20 text-gray-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      case 'review': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'urgent': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee: {
        id: '1',
        name: 'Unassigned'
      },
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      comments: 0,
      attachments: 0,
      tags: [],
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : task.progress }
          : task
      )
    );
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
              )}
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress */}
          {task.progress > 0 && (
            <div className="space-y-1">
              <Progress value={task.progress} className="h-2" />
              <div className="text-xs text-muted-foreground">{task.progress}% complete</div>
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{task.assignee.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <span>{task.comments}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <FileText className="w-3 h-3" />
                <span>{task.attachments}</span>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const KanbanBoard = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {['todo', 'in_progress', 'review', 'completed'].map(status => (
        <div key={status} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium capitalize flex items-center space-x-2">
              {status === 'todo' && <Clock className="w-4 h-4" />}
              {status === 'in_progress' && <User className="w-4 h-4" />}
              {status === 'review' && <AlertTriangle className="w-4 h-4" />}
              {status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
              <span>{status.replace('_', ' ')}</span>
            </h3>
            <Badge variant="outline" className={getStatusColor(status)}>
              {tasks.filter(task => task.status === status).length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {tasks
              .filter(task => task.status === status)
              .map(task => (
                <div key={task.id} className="cursor-pointer">
                  <TaskCard task={task} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {tasks.map(task => (
        <Card key={task.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateTaskStatus(task.id, 
                  task.status === 'completed' ? 'todo' : 'completed'
                )}
              >
                <CheckCircle2 className={`w-4 h-4 ${
                  task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'
                }`} />
              </Button>
              <div className="flex-1">
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('_', ' ')}
              </Badge>
              <Avatar className="w-8 h-8">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback>
                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Tasks</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-64"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <Button onClick={addTask} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Task Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kanban" className="mt-4">
          <KanbanBoard />
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <ListView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedTaskManager;
