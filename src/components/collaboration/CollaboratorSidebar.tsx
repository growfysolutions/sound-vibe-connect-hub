
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Crown, Edit, Eye, UserCheck } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  avatar: string;
  permission: 'Admin' | 'Contributor' | 'Viewer';
}

interface CollaboratorSidebarProps {
  collaborators: Collaborator[];
}

const CollaboratorSidebar = ({ collaborators }: CollaboratorSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-teal';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'Admin': return Crown;
      case 'Contributor': return Edit;
      case 'Viewer': return Eye;
      default: return UserCheck;
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'Admin': return 'text-ocean-blue bg-ocean-blue/20';
      case 'Contributor': return 'text-teal bg-teal/20';
      case 'Viewer': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="w-80 bg-card/95 backdrop-blur-xl border-r border-border/50 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Collaborators</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-ocean-gradient hover:bg-ocean-gradient/90">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Collaborator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by name or email..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocalist">Vocalist</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="lyricist">Lyricist</SelectItem>
                  <SelectItem value="engineer">Sound Engineer</SelectItem>
                  <SelectItem value="musician">Musician</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Permission level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">Send Invitation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search collaborators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Collaborator List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {collaborators
          .filter(collab => 
            collab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collab.role.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((collaborator) => {
            const PermissionIcon = getPermissionIcon(collaborator.permission);
            
            return (
              <div
                key={collaborator.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                    <AvatarFallback className="bg-ocean-blue/20 text-ocean-blue font-semibold">
                      {collaborator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(collaborator.status)}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {collaborator.name}
                    </p>
                    <PermissionIcon className={`w-3 h-3 ${getPermissionColor(collaborator.permission).split(' ')[0]}`} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {collaborator.role}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs mt-1 ${getPermissionColor(collaborator.permission)}`}
                  >
                    {collaborator.permission}
                  </Badge>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(collaborator.status)}`} />
                  <span className="text-xs text-muted-foreground mt-1 capitalize">
                    {collaborator.status}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-ocean-blue">
              {collaborators.filter(c => c.status === 'online').length}
            </div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold text-teal">
              {collaborators.length}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorSidebar;
