
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Calendar, 
  Flag, 
  Clock, 
  CheckCircle, 
  CircleDashed,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'complete';
  category: string;
}

interface Collaborator {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar: string;
  permission: string;
}

interface TasksTabProps {
  projectId: string;
  collaborators: Collaborator[];
}

const TasksTab = ({ collaborators }: TasksTabProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Record lead vocals for chorus',
      description: 'Complete the main vocal recording for the chorus section with proper breath control and emotion.',
      assignee: 'Jasbir Singh',
      assigneeAvatar: '/placeholder.svg',
      dueDate: '2024-02-05',
      priority: 'high',
      status: 'in-progress',
      category: 'Recording'
    },
    {
      id: '2',
      title: 'Mix harmonium layers',
      description: 'Balance the harmonium tracks and add appropriate reverb for the Sufi atmosphere.',
      assignee: 'Priya Sharma',
      assigneeAvatar: '/placeholder.svg',
      dueDate: '2024-02-08',
      priority: 'medium',
      status: 'todo',
      category: 'Production'
    },
    {
      id: '3',
      title: 'Finalize lyrics translation',
      description: 'Complete English translation and ensure cultural accuracy of Punjabi verses.',
      assignee: 'Amit Kumar',
      assigneeAvatar: '/placeholder.svg',
      dueDate: '2024-02-03',
      priority: 'high',
      status: 'review',
      category: 'Lyrics'
    },
    {
      id: '4',
      title: 'Set up recording session',
      description: 'Prepare studio equipment and sound check for tomorrow\'s vocal recording.',
      assignee: 'Sonia Patel',
      assigneeAvatar: '/placeholder.svg',
      dueDate: '2024-02-02',
      priority: 'medium',
      status: 'complete',
      category: 'Technical'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium' as const,
    category: ''
  });

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-gray-400/30 bg-gray-400/5' },
    { id: 'in-progress', title: 'In Progress', color: 'border-blue-400/30 bg-blue-400/5' },
    { id: 'review', title: 'Review', color: 'border-yellow-400/30 bg-yellow-400/5' },
    { id: 'complete', title: 'Complete', color: 'border-green-400/30 bg-green-400/5' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return CircleDashed;
      case 'in-progress': return Clock;
      case 'review': return AlertCircle;
      case 'complete': return CheckCircle;
      default: return CircleDashed;
    }
  };

  const createTask = () => {
    if (!newTask.title || !newTask.assignee) return;

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      assigneeAvatar: '/placeholder.svg',
      status: 'todo'
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      priority: 'medium',
      category: ''
    });
    setIsCreateDialogOpen(false);
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const TaskCard = ({ task }: { task: Task }) => {
    return (
      <Card className="mb-3 cursor-move hover:shadow-lg transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm leading-tight flex-1 mr-2">
              {task.title}
            </h4>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
              <Flag className="w-3 h-3 mr-1" />
              {task.priority}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {task.category}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {task.assignee.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{task.assignee}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{task.dueDate}</span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-1 mt-3">
            {task.status !== 'todo' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 text-xs"
                onClick={() => moveTask(task.id, 'todo')}
              >
                To Do
              </Button>
            )}
            {task.status !== 'in-progress' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 text-xs"
                onClick={() => moveTask(task.id, 'in-progress')}
              >
                Progress
              </Button>
            )}
            {task.status !== 'complete' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 text-xs"
                onClick={() => moveTask(task.id, 'complete')}
              >
                Complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Task Management</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              />
              <Select value={newTask.assignee} onValueChange={(value) => setNewTask(prev => ({ ...prev, assignee: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to" />
                </SelectTrigger>
                <SelectContent>
                  {collaborators.map((collab) => (
                    <SelectItem key={collab.id} value={collab.name}>
                      {collab.name} - {collab.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              />
              <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Category (e.g., Recording, Production)"
                value={newTask.category}
                onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
              />
              <Button onClick={createTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id as Task['status']);
          const StatusIcon = getStatusIcon(column.id);
          
          return (
            <Card key={column.id} className={`${column.color} border-2`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="w-4 h-4" />
                    <span>{column.title}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No tasks in {column.title.toLowerCase()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TasksTab;
