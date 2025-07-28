
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { validateFile, sanitizeFileName } from '@/utils/fileValidation';
import { toast } from 'sonner';

export const useSecureUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, bucket: string, path?: string) => {
    setUploading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Sanitize filename
      const sanitizedName = sanitizeFileName(file.name);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${sanitizedName}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Record upload in media_uploads table for tracking
      const { error: dbError } = await supabase
        .from('media_uploads')
        .insert({
          user_id: user.id,
          file_name: sanitizedName,
          file_path: data.path,
          file_size: file.size,
          mime_type: file.type,
          upload_status: 'completed'
        });

      if (dbError) {
        console.error('Failed to record upload:', dbError);
        // Don't throw here as the upload succeeded
      }

      return { data, path: data.path };
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};
