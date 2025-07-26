
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const usePostCreation = () => {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);

  const createPost = async (content: string, mediaFile?: File) => {
    if (!user?.id) {
      toast.error('Please log in to create posts');
      return false;
    }

    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return false;
    }

    setCreating(true);

    try {
      let mediaUrl = null;
      let mediaType = 'text';

      // Upload media if provided
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media-uploads')
          .upload(filePath, mediaFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media-uploads')
          .getPublicUrl(uploadData.path);

        mediaUrl = publicUrl;
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 
                   mediaFile.type.startsWith('video/') ? 'video' : 
                   mediaFile.type.startsWith('audio/') ? 'audio' : 'file';
      }

      // Create the post
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          content,
          media_url: mediaUrl,
          media_type: mediaType,
          user_id: user.id
        });

      if (postError) throw postError;

      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
      return false;
    } finally {
      setCreating(false);
    }
  };

  return {
    createPost,
    creating
  };
};
