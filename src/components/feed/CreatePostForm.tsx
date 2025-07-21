import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';
import { 
  Image, 
  Music, 
  Link, 
  AtSign, 
  Hash, 
  Globe, 
  Users,
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CreatePostFormProps {
  onPostCreated: () => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacy, setPrivacy] = useState<'public' | 'connections'>('public');
  const { profile } = useProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter some content for your post.');
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to create a post.');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('posts')
      .insert({
        content: content.trim(),
        user_id: user.id
      });

    if (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } else {
      toast.success('Post created successfully!');
      setContent('');
      onPostCreated();
    }

    setIsSubmitting(false);
  };

  const mediaButtons = [
    { icon: Image, label: 'Photo', color: 'text-blue-500' },
    { icon: Music, label: 'Audio', color: 'text-purple-500' },
    { icon: Link, label: 'Link', color: 'text-green-500' },
  ];

  const actionButtons = [
    { icon: AtSign, label: 'Mention', color: 'text-orange-500' },
    { icon: Hash, label: 'Hashtag', color: 'text-pink-500' },
  ];

  return (
    <Card className="glass-card hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border-2 border-primary/30 flex-shrink-0">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-primary">
                  {profile?.full_name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share your latest project, ask for collaboration, or just say hello!"
                className="min-h-[120px] resize-none border-none bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 p-0 leading-relaxed"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          {/* Media and Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center space-x-3">
              {/* Media Upload Buttons */}
              <div className="flex items-center space-x-2">
                {mediaButtons.map((button) => (
                  <Button
                    key={button.label}
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 hover:bg-muted/50 rounded-lg transition-all duration-200 group"
                    type="button"
                  >
                    <button.icon className={`w-4 h-4 ${button.color} group-hover:scale-110 transition-transform duration-200`} />
                    <span className="ml-2 text-sm text-muted-foreground group-hover:text-foreground">
                      {button.label}
                    </span>
                  </Button>
                ))}
              </div>
              
              {/* Separator */}
              <div className="w-px h-6 bg-border/50" />
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {actionButtons.map((button) => (
                  <Button
                    key={button.label}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 hover:bg-muted/50 rounded-lg transition-all duration-200 group"
                    type="button"
                  >
                    <button.icon className={`w-4 h-4 ${button.color} group-hover:scale-110 transition-transform duration-200`} />
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Privacy Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-3 hover:bg-muted/50 rounded-lg">
                    {privacy === 'public' ? (
                      <Globe className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <Users className="w-4 h-4 text-blue-500 mr-2" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {privacy === 'public' ? 'Public' : 'Connections'}
                    </span>
                    <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setPrivacy('public')}>
                    <Globe className="w-4 h-4 text-green-500 mr-2" />
                    Public
                    <Badge variant="secondary" className="ml-auto text-xs">Anyone</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPrivacy('connections')}>
                    <Users className="w-4 h-4 text-blue-500 mr-2" />
                    Connections Only
                    <Badge variant="secondary" className="ml-auto text-xs">Private</Badge>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Post Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting || !content.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
