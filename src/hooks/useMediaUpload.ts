
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
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
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState<MediaUploadData[]>([]);

  const uploadFile = useCallback(async (file: File) => {
    if (!profile?.id) {
      toast.error('Please log in to upload files');
      return null;
    }

    setIsLoading(true);
    
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${profile.id}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media-uploads')
        .getPublicUrl(uploadData.path);

      // Save metadata to database
      const { data: mediaData, error: dbError } = await supabase
        .from('media_uploads')
        .insert({
          user_id: profile.id,
          file_name: file.name,
          file_path: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          upload_status: 'completed',
          metadata: {
            original_name: file.name,
            uploaded_at: new Date().toISOString(),
          },
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const transformedData: MediaUploadData = {
        ...mediaData,
        duration: mediaData.duration ?? null,
        waveform_data: Array.isArray(mediaData.waveform_data) ? mediaData.waveform_data as number[] : null
      };

      setUploads(prev => [transformedData, ...prev]);
      toast.success('File uploaded successfully!');
      
      return transformedData;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [profile?.id]);

  const fetchUploads = useCallback(async () => {
    if (!profile?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_uploads')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData: MediaUploadData[] = (data || []).map(upload => ({
        ...upload,
        duration: upload.duration ?? null,
        waveform_data: Array.isArray(upload.waveform_data) ? upload.waveform_data as number[] : null
      }));
      
      setUploads(transformedData);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast.error('Failed to fetch media files');
    } finally {
      setIsLoading(false);
    }
  }, [profile?.id]);

  const deleteUpload = useCallback(async (id: string, filePath: string) => {
    if (!profile?.id) return;

    try {
      // Delete from storage
      const fileName = filePath.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('media-uploads')
          .remove([`${profile.id}/${fileName}`]);
        
        if (storageError) console.warn('Storage deletion failed:', storageError);
      }

      // Delete from database
      const { error } = await supabase
        .from('media_uploads')
        .delete()
        .eq('id', id)
        .eq('user_id', profile.id);

      if (error) throw error;

      setUploads(prev => prev.filter(upload => upload.id !== id));
      toast.success('Media file deleted successfully');
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast.error('Failed to delete media file');
    }
  }, [profile?.id]);

  return {
    uploads,
    isLoading,
    uploadFile,
    fetchUploads,
    deleteUpload,
  };
};
