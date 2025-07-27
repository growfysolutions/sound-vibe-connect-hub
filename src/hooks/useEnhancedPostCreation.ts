
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
      const fileName = `${user?.id}-${Date.now()}-${index}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media-uploads')
        .getPublicUrl(uploadData.path);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const createPost = async ({ content, mediaFiles, tags, category }: PostData) => {
    if (!user?.id) {
      toast.error('Please log in to create posts');
      return false;
    }

    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return false;
    }

    setCreating(true);
    setUploadProgress(0);

    try {
      let mediaUrls: string[] = [];
      let mediaType = 'text';

      if (mediaFiles.length > 0) {
        setUploadProgress(25);
        mediaUrls = await uploadMultipleFiles(mediaFiles);
        setUploadProgress(75);
        
        // Determine media type based on first file
        const firstFile = mediaFiles[0];
        mediaType = firstFile.type.startsWith('image/') ? 'image' : 
                   firstFile.type.startsWith('video/') ? 'video' : 
                   firstFile.type.startsWith('audio/') ? 'audio' : 'file';
      }

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

      if (postError) throw postError;

      setUploadProgress(100);
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
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
