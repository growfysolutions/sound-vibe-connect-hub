
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface MediaUploadData {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  duration?: number | null;
  waveform_data?: number[] | null;
  upload_status: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useMediaUpload = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState<MediaUploadData[]>([]);

  const fetchUploads = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: MediaUploadData[] = (data || []).map(upload => ({
        ...upload,
        duration: upload.duration ?? undefined,
        waveform_data: upload.waveform_data ?? undefined
      }));
      
      setUploads(transformedData);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast.error('Failed to fetch media files');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteUpload = useCallback(async (id: string, filePath: string) => {
    if (!user) return;

    try {
      // Delete from storage
      const fileName = filePath.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('media-uploads')
          .remove([`${user.id}/${fileName}`]);
        
        if (storageError) console.warn('Storage deletion failed:', storageError);
      }

      // Delete from database
      const { error } = await supabase
        .from('media_uploads')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setUploads(prev => prev.filter(upload => upload.id !== id));
      toast.success('Media file deleted successfully');
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast.error('Failed to delete media file');
    }
  }, [user]);

  const updateUploadStatus = useCallback(async (id: string, status: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('media_uploads')
        .update({ upload_status: status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setUploads(prev => 
        prev.map(upload => 
          upload.id === id ? { ...upload, upload_status: status } : upload
        )
      );
    } catch (error) {
      console.error('Error updating upload status:', error);
      toast.error('Failed to update upload status');
    }
  }, [user]);

  return {
    uploads,
    isLoading,
    fetchUploads,
    deleteUpload,
    updateUploadStatus
  };
};
