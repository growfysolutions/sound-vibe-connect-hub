import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [artist, setArtist] = useState('');
  const [role, setRole] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const resetForm = () => {
    setTitle('');
    setGenre('');
    setArtist('');
    setRole('');
    setFile(null);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please upload an audio file.');
      return;
    }

    setIsUploading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('You must be logged in to create a project.');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: newProject, error: dbError } = await supabase.from('projects').insert(
        {
          title,
          genre,
          artist,
          role,
          audio_path: uploadData.path,
          user_id: user.id,
        },
      ).select('id').single();

      if (dbError || !newProject) {
        throw dbError || new Error('Failed to create project or get its ID.');
      }

      // Create a group chat for the project
      const { data: newConversation, error: chatError } = await supabase
        .from('conversations')
        .insert({
          project_id: newProject.id,
          name: `${title} Chat`,
          is_group_chat: true,
          created_by: user.id,
        })
        .select('id')
        .single();

      if (chatError || !newConversation) {
        throw chatError || new Error('Failed to create project chat.');
      }

      // Add the creator as the first participant
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert({
          conversation_id: newConversation.id,
          user_id: user.id,
        });

      if (participantError) {
        // If adding participant fails, we should ideally roll back the chat creation
        // For now, we'll just log the error and notify the user
        console.error('Failed to add creator to project chat:', participantError);
        toast.warning('Project created, but failed to set up chat room correctly.');
      }

      if (dbError) {
        throw dbError;
      }

      toast.success('Project created successfully!');
      onProjectCreated(); // Re-fetch projects in dashboard
      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Start a new masterpiece. Fill in the details below to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genre" className="text-right">Genre</Label>
              <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="artist" className="text-right">Artist</Label>
              <Input id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Your Role</Label>
              <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="track-upload" className="text-right pt-2">Track</Label>
              <div
                className={`col-span-3 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${isDragging ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('track-upload-input')?.click()}
              >
                <input id="track-upload-input" type="file" className="sr-only" onChange={handleFileChange} accept="audio/*" />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">Audio files (MP3, WAV, etc.)</p>
                  {file && <p className="text-sm font-medium mt-2">{file.name}</p>}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
