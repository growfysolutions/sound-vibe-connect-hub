
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Music, Camera, Video, Radio, Users, Heart, Smile, Music2, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CreatePostFormProps {
  onPostCreated: () => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { profile } = useProfile();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showCollabForm, setShowCollabForm] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);

  const placeholders = [
    'ਅੱਜ ਤੁਸੀਂ ਕੀ ਨਵਾਂ ਸਿੱਖਿਆ? Share your musical journey...',
    'Share your latest raag practice, collaborate on a bhangra beat, or celebrate a milestone!',
    'What traditional song touched your heart today? ਅੱਜ ਕਿਹੜਾ ਗਾਣਾ ਦਿਲ ਨੂੰ ਛੂਹ ਗਿਆ?',
    'Connect with fellow artists, share your progress, inspire the community...',
    'From classical to modern Punjabi - what are you working on today?'
  ];

  const mediaOptions = [
    { 
      icon: Music, 
      label: 'Audio Track', 
      punjabi: 'ਆਡੀਓ ਟਰੈਕ', 
      color: 'text-hsl(var(--color-primary-500))',
      action: () => handleMediaUpload('audio/*')
    },
    { 
      icon: Camera, 
      label: 'Performance Pic', 
      punjabi: 'ਪਰਫਾਰਮੈਂਸ ਫੋਟੋ', 
      color: 'text-hsl(var(--color-secondary-500))',
      action: () => handleMediaUpload('image/*')
    },
    { 
      icon: Video, 
      label: 'Music Video', 
      punjabi: 'ਮਿਊਜਿਕ ਵੀਡੀਓ', 
      color: 'text-hsl(var(--color-primary-600))',
      action: () => handleMediaUpload('video/*')
    },
    { 
      icon: Radio, 
      label: 'Go Live', 
      punjabi: 'ਲਾਈਵ ਪ੍ਰੋਗਰਾਮ', 
      color: 'text-hsl(var(--color-error-500))',
      action: () => setShowLiveModal(true)
    },
    { 
      icon: Users, 
      label: 'Seek Collaborator', 
      punjabi: 'ਸਹਿਯੋਗੀ ਚਾਹੀਦਾ', 
      color: 'text-hsl(var(--color-success-500))',
      action: () => setShowCollabForm(true)
    }
  ];

  const handleMediaUpload = (acceptTypes: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptTypes;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedMedia(file);
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => setMediaPreview(e.target?.result as string);
          reader.readAsDataURL(file);
        } else {
          setMediaPreview(file.name);
        }
      }
    };
    input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedMedia) {
      toast.error('Please add some content or media to share.');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let mediaUrl = null;
      if (selectedMedia) {
        const fileExt = selectedMedia.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio_media')
          .upload(fileName, selectedMedia);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio_media')
          .getPublicUrl(fileName);
        
        mediaUrl = publicUrl;
      }

      const { error } = await supabase.from('posts').insert({
        content: content.trim(),
        user_id: user.id,
        media_url: mediaUrl,
        media_type: selectedMedia?.type || null
      });

      if (error) throw error;

      setContent('');
      setSelectedMedia(null);
      setMediaPreview(null);
      setShowCollabForm(false);
      toast.success('Post shared successfully! ਪੋਸਟ ਸਫਲਤਾਪੂਰਵਕ ਸਾਂਝੀ ਕੀਤੀ!');
      onPostCreated();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          <Avatar className="w-12 h-12 border-2 border-hsl(var(--color-primary-500))/30 flex-shrink-0">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-to-r from-hsl(var(--color-primary-500)) to-hsl(var(--color-secondary-500)) text-white font-semibold">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  className="min-h-[120px] border-hsl(var(--color-primary-500))/30 focus:border-hsl(var(--color-primary-500)) bg-white/50 resize-none text-hsl(var(--color-primary-900)) placeholder:text-hsl(var(--color-neutral-500))"
                  onFocus={() => setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)}
                />
                <div className="absolute bottom-3 right-3 flex space-x-1">
                  <Heart className="w-4 h-4 text-hsl(var(--color-error-500))/50" />
                  <Music2 className="w-4 h-4 text-hsl(var(--color-primary-500))/50" />
                  <Smile className="w-4 h-4 text-hsl(var(--color-warning-500))/50" />
                </div>
              </div>

              {/* Media Preview */}
              {mediaPreview && (
                <div className="relative p-4 bg-hsl(var(--color-primary-50))/50 rounded-lg border border-hsl(var(--color-primary-500))/20">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-hsl(var(--color-primary-100))"
                    onClick={removeMedia}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  {selectedMedia?.type.startsWith('image/') ? (
                    <img src={mediaPreview} alt="Preview" className="max-h-32 rounded" />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Upload className="w-4 h-4 text-hsl(var(--color-primary-500))" />
                      <span className="text-sm text-hsl(var(--color-primary-800))">{mediaPreview}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Collaboration Form */}
              {showCollabForm && (
                <div className="p-4 bg-hsl(var(--color-success-500))/10 rounded-lg border border-hsl(var(--color-success-500))/20">
                  <h4 className="font-medium text-hsl(var(--color-success-600)) mb-2">Seeking Collaboration</h4>
                  <Input 
                    placeholder="What kind of collaboration are you looking for?"
                    className="mb-2 bg-white/50 border-hsl(var(--color-success-500))/30"
                  />
                  <div className="flex space-x-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => setShowCollabForm(false)}>
                      Cancel
                    </Button>
                    <Button type="button" size="sm" className="bg-hsl(var(--color-success-500)) hover:bg-hsl(var(--color-success-600)) text-white">
                      Add to Post
                    </Button>
                  </div>
                </div>
              )}

              {/* Live Modal */}
              {showLiveModal && (
                <div className="p-4 bg-hsl(var(--color-error-500))/10 rounded-lg border border-hsl(var(--color-error-500))/20">
                  <h4 className="font-medium text-hsl(var(--color-error-600)) mb-2">Go Live</h4>
                  <p className="text-sm text-hsl(var(--color-neutral-600)) mb-3">Start a live performance or session</p>
                  <div className="flex space-x-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => setShowLiveModal(false)}>
                      Cancel
                    </Button>
                    <Button type="button" size="sm" className="bg-hsl(var(--color-error-500)) hover:bg-hsl(var(--color-error-600)) text-white">
                      Start Live Stream
                    </Button>
                  </div>
                </div>
              )}

              {/* Media Options */}
              <div className="flex flex-wrap gap-2 p-3 bg-hsl(var(--color-primary-50))/30 rounded-lg border border-hsl(var(--color-primary-500))/10">
                {mediaOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex-1 min-w-0 group hover:bg-hsl(var(--color-primary-100)) transition-all duration-300"
                      onClick={option.action}
                    >
                      <Icon className={`w-4 h-4 mr-2 ${option.color} group-hover:scale-110 transition-transform`} />
                      <div className="flex flex-col items-start min-w-0">
                        <span className="text-xs font-medium truncate text-hsl(var(--color-primary-800))">{option.label}</span>
                        <span className="text-xs opacity-60 truncate text-hsl(var(--color-primary-600))" style={{ fontFamily: 'serif' }}>
                          {option.punjabi}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-hsl(var(--color-neutral-600))">
                  <span>Share with the community</span>
                  <span style={{ fontFamily: 'serif' }}>• ਭਾਈਚਾਰੇ ਨਾਲ ਸਾਂਝਾ ਕਰੋ</span>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={(!content.trim() && !selectedMedia) || isLoading}
                  className="bg-gradient-to-r from-hsl(var(--color-primary-500)) to-hsl(var(--color-secondary-500)) hover:from-hsl(var(--color-primary-600)) hover:to-hsl(var(--color-secondary-600)) text-white group"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sharing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4 group-hover:animate-pulse" />
                      <span>Share</span>
                      <span style={{ fontFamily: 'serif' }}>ਸਾਂਝਾ ਕਰੋ</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
