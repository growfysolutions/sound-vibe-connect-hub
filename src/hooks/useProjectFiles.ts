
import { useState, useEffect, useCallback } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';

interface ProjectFile {
  id: string;
  project_id: number;
  user_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  duration?: number;
  metadata: any;
  version_number: number;
  is_current_version: boolean;
  created_at: string;
  updated_at: string;
}

export const useProjectFiles = (projectId?: number) => {
  const { profile } = useProfile();
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Fetch project files
  const fetchProjectFiles = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_current_version', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project files:', error);
        return;
      }

      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching project files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Upload a new file to the project
  const uploadFile = useCallback(async (file: File) => {
    if (!profile?.id || !projectId) return null;

    try {
      setIsLoading(true);
      setUploadProgress(0);

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `projects/${projectId}/${fileName}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      // Get duration for audio/video files
      let duration: number | undefined;
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        duration = await getMediaDuration(file);
      }

      // Save file metadata to database
      const { data: fileData, error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          user_id: profile.id,
          file_name: file.name,
          file_path: filePath,
          file_type: getFileType(file.type),
          file_size: file.size,
          mime_type: file.type,
          duration,
          metadata: {
            originalName: file.name,
            uploadedAt: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error saving file metadata:', dbError);
        return null;
      }

      await fetchProjectFiles();
      return fileData;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  }, [profile?.id, projectId, fetchProjectFiles]);

  // Delete a project file
  const deleteFile = useCallback(async (fileId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('projects')
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        console.error('Error deleting file from database:', dbError);
        return;
      }

      await fetchProjectFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }, [fetchProjectFiles]);

  // Get file download URL
  const getFileUrl = useCallback(async (filePath: string) => {
    const { data } = await supabase.storage
      .from('projects')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    return data?.signedUrl || null;
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!projectId) return;

    fetchProjectFiles();

    const filesChannel = supabase
      .channel('project-files')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_files',
          filter: `project_id=eq.${projectId}`
        },
        () => {
          fetchProjectFiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(filesChannel);
    };
  }, [projectId, fetchProjectFiles]);

  return {
    files,
    isLoading,
    uploadProgress,
    uploadFile,
    deleteFile,
    getFileUrl,
    fetchProjectFiles
  };
};

// Helper functions
const getFileType = (mimeType: string): string => {
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  return 'document';
};

const getMediaDuration = (file: File): Promise<number | undefined> => {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    
    audio.onloadedmetadata = () => {
      resolve(Math.round(audio.duration));
    };
    
    audio.onerror = () => {
      resolve(undefined);
    };
    
    audio.src = URL.createObjectURL(file);
  });
};
