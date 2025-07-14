import { useState, useRef } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  MessageSquare, 
  Music, 
  Users, 
  Briefcase, 
  Upload, 
  Smile, 
  AtSign,
  Hash,
  Eye,
  EyeOff,
  Image,
  Video,
  FileAudio
} from 'lucide-react';

export function EnhancedCreatePostForm({ onPostCreated }: { onPostCreated: () => void }) {
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('update');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [isCollaborationRequest, setIsCollaborationRequest] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const maxChars = 280;
  const charCount = content.length;
  const isOverLimit = charCount > maxChars;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverLimit) return;
    
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a post.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Post content cannot be empty.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Add collaboration badge if it's a collaboration request
    const finalContent = isCollaborationRequest 
      ? `${content} #collaboration #seekingcollaborators`
      : content;

    const { error } = await supabase
      .from('posts')
      .insert([{ 
        content: finalContent, 
        user_id: user.id,
      }]);

    if (error) {
      toast({
        title: 'Error creating post',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setContent('');
      setSelectedFiles([]);
      setIsExpanded(false);
      setIsCollaborationRequest(false);
      toast({
        title: 'Success',
        description: getSuccessMessage(),
      });
      onPostCreated();
    }

    setIsSubmitting(false);
  };

  const getSuccessMessage = () => {
    switch (activeTab) {
      case 'track': return 'Your track has been shared!';
      case 'collaboration': return 'Collaboration request posted!';
      case 'gig': return 'Gig posted successfully!';
      default: return 'Your post has been created.';
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'update': return "What's on your mind? Share your latest music thoughts...";
      case 'track': return "Tell us about your latest track. What's the story behind it?";
      case 'collaboration': return "What kind of collaboration are you looking for? Be specific about roles needed...";
      case 'gig': return "Describe your gig opportunity. Include details about budget, timeline, and requirements...";
      default: return "What's on your mind?";
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const insertMention = () => {
    setContent(prev => prev + '@');
  };

  const insertHashtag = () => {
    setContent(prev => prev + '#');
  };

  const insertEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
  };

  return (
    <Card className={`transition-all duration-300 ${isExpanded ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="update" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Share Update</span>
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Track</span>
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Collaborate</span>
            </TabsTrigger>
            <TabsTrigger value="gig" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Post Gig</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder={getPlaceholder()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`min-h-[100px] transition-all duration-200 ${isExpanded ? 'min-h-[120px]' : ''}`}
              onFocus={() => setIsExpanded(true)}
            />
            <div className={`absolute bottom-2 right-2 text-xs transition-colors ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
              {charCount}/{maxChars}
            </div>
          </div>

          {/* Enhanced Features */}
          {isExpanded && (
            <div className="space-y-4 animate-fade-in">
              {/* File Upload Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                  dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex gap-2">
                    <FileAudio className="w-6 h-6 text-muted-foreground" />
                    <Image className="w-6 h-6 text-muted-foreground" />
                    <Video className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop files here or <button type="button" className="text-primary underline" onClick={() => fileInputRef.current?.click()}>browse</button>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="audio/*,image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setSelectedFiles(prev => [...prev, ...files]);
                      }
                    }}
                  />
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {file.name}
                        <button
                          type="button"
                          onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={insertMention}>
                    <AtSign className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={insertHashtag}>
                    <Hash className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => insertEmoji('🎵')}>
                    <Smile className="w-4 h-4" />
                  </Button>
                  <div className="flex gap-1">
                    {['🎵', '🎸', '🎤', '🎹', '🥁', '🎺'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="hover:scale-110 transition-transform text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="visibility" checked={isPublic} onCheckedChange={setIsPublic} />
                    <Label htmlFor="visibility" className="flex items-center gap-2 text-sm">
                      {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {isPublic ? 'Public' : 'Connections Only'}
                    </Label>
                  </div>
                  
                  {activeTab === 'collaboration' && (
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="collaboration" 
                        checked={isCollaborationRequest} 
                        onCheckedChange={setIsCollaborationRequest} 
                      />
                      <Label htmlFor="collaboration" className="text-sm">Looking for collaborators</Label>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || isOverLimit || !content.trim()}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? 'Posting...' : 'Share'}
                </Button>
              </div>
            </div>
          )}

          {!isExpanded && (
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting || isOverLimit || !content.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}