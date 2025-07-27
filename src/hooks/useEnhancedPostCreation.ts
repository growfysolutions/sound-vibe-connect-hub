
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface PostData {
  content: string;
  mediaFiles: File[];
  tags: string[];
  category: string;
}

export const useEnhancedPostCreation = () => {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${index}.${fileExt}`;
      // Updated path to match RLS policy: user-id/posts/filename
      const filePath = `${user?.id}/posts/${fileName}`;

      console.log('Uploading file to path:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-uploads')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media-uploads')
        .getPublicUrl(uploadData.path);

      console.log('File uploaded successfully:', publicUrl);
      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const createPost = async ({ content, mediaFiles, tags, category }: PostData) => {
    if (!user?.id) {
      toast.error('Please log in to create posts');
      return false;
    }

    if (!content.trim() && mediaFiles.length === 0) {
      toast.error('Post content or media is required');
      return false;
    }

    setCreating(true);
    setUploadProgress(0);

    try {
      let mediaUrls: string[] = [];
      let mediaType = 'text';

      // Handle media uploads with better error handling
      if (mediaFiles.length > 0) {
        try {
          console.log('Starting media upload for', mediaFiles.length, 'files');
          setUploadProgress(25);
          
          mediaUrls = await uploadMultipleFiles(mediaFiles);
          setUploadProgress(75);
          
          // Determine media type based on first file
          const firstFile = mediaFiles[0];
          mediaType = firstFile.type.startsWith('image/') ? 'image' : 
                     firstFile.type.startsWith('video/') ? 'video' : 
                     firstFile.type.startsWith('audio/') ? 'audio' : 'file';
          
          console.log('Media upload completed successfully');
        } catch (uploadError) {
          console.error('Media upload failed:', uploadError);
          toast.error('Failed to upload media files. Creating text-only post.');
          // Continue with text-only post instead of failing completely
          mediaUrls = [];
          mediaType = 'text';
        }
      }

      // Create the post
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          content,
          media_url: mediaUrls[0] || null,
          media_urls: mediaUrls.length > 0 ? mediaUrls : null,
          media_type: mediaType,
          tags: tags.length > 0 ? tags : null,
          category: category || null,
          user_id: user.id
        });

      if (postError) {
        console.error('Post creation error:', postError);
        throw postError;
      }

      setUploadProgress(100);
      toast.success('Post created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
      return false;
    } finally {
      setCreating(false);
      setUploadProgress(0);
    }
  };

  return {
    createPost,
    creating,
    uploadProgress
  };
};
