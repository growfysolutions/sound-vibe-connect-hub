
import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageIcon, Music, Video, Send, X } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useEnhancedPostCreation } from '@/hooks/useEnhancedPostCreation';
import { useSecureUpload } from '@/hooks/useSecureUpload';
import { validateInput, sanitizeText } from '@/utils/sanitization';
import { toast } from 'sonner';

interface CreatePostFormProps {
  onPostCreated: () => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { profile } = useProfile();
  const { createPost, creating } = useEnhancedPostCreation();
  const { uploadFile, uploading } = useSecureUpload();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate files using secure upload validation
    const validFiles = files.filter(file => {
      try {
        const validation = validateFile(file);
        if (!validation.isValid) {
          toast.error(`${file.name}: ${validation.error}`);
          return false;
        }
        return true;
      } catch {
        toast.error(`${file.name}: Invalid file`);
        return false;
      }
    });

    if (validFiles.length === 0) return;

    setMediaFiles(prev => [...prev, ...validFiles]);

    // Create previews for images and videos
    const newPreviews: string[] = [];
    validFiles.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newPreviews.push(result);
          if (newPreviews.length === validFiles.length) {
            setMediaPreview(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate and sanitize content
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error('Please add some content or media to your post');
      return;
    }

    if (!validateInput(content, 500)) {
      toast.error('Content contains invalid characters or exceeds length limit');
      return;
    }

    const sanitizedContent = sanitizeText(content);

    const success = await createPost({
      content: sanitizedContent,
      mediaFiles,
      tags: [],
      category: 'general'
    });
    
    if (success) {
      setContent('');
      setMediaFiles([]);
      setMediaPreview([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onPostCreated();
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setContent(value);
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Avatar and Text Area */}
          <div className="flex space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind? Share your musical journey..."
                value={content}
                onChange={handleContentChange}
                className="min-h-[100px] resize-none border-none bg-transparent text-foreground placeholder-muted-foreground focus:ring-0 focus:border-none"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right mt-1">
                {content.length}/500
              </div>
            </div>
          </div>

          {/* Media Preview */}
          {mediaPreview.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {mediaPreview.map((preview, index) => (
                <div key={index} className="relative">
                  {mediaFiles[index]?.type.startsWith('image/') ? (
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  ) : mediaFiles[index]?.type.startsWith('video/') ? (
                    <video
                      src={preview}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  ) : null}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 w-6 h-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Non-preview media files */}
          {mediaFiles.filter((_, index) => !mediaPreview[index]).map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeMedia(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                multiple
                onChange={handleMediaUpload}
                className="hidden"
              />
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-foreground"
                disabled={uploading}
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                Photo
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = 'video/*';
                    fileInputRef.current.click();
                  }
                }}
                className="text-muted-foreground hover:text-foreground"
                disabled={uploading}
              >
                <Video className="w-4 h-4 mr-1" />
                Video
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = 'audio/*';
                    fileInputRef.current.click();
                  }
                }}
                className="text-muted-foreground hover:text-foreground"
                disabled={uploading}
              >
                <Music className="w-4 h-4 mr-1" />
                Audio
              </Button>
            </div>

            <Button
              type="submit"
              disabled={(!content.trim() && mediaFiles.length === 0) || creating || uploading}
              className="bg-primary hover:bg-primary/90"
            >
              {creating || uploading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {creating || uploading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
