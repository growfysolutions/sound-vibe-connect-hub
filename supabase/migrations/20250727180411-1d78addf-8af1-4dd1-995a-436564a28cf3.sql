
-- Create bookmarks table for saving posts
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Add Row Level Security (RLS) for bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" 
  ON public.bookmarks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
  ON public.bookmarks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.bookmarks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create mentions table for @mentions in posts and comments
CREATE TABLE public.mentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  mentioned_user_id UUID REFERENCES auth.users NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT mentions_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Add Row Level Security (RLS) for mentions
ALTER TABLE public.mentions ENABLE ROW LEVEL SECURITY;

-- Create policies for mentions
CREATE POLICY "Users can view mentions" 
  ON public.mentions 
  FOR SELECT 
  USING (auth.uid() = mentioned_user_id OR auth.uid() = user_id);

CREATE POLICY "Users can create mentions" 
  ON public.mentions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add media_urls column to posts table to support multiple images
ALTER TABLE public.posts ADD COLUMN media_urls TEXT[];

-- Add filter fields to posts table
ALTER TABLE public.posts ADD COLUMN tags TEXT[];
ALTER TABLE public.posts ADD COLUMN category TEXT;

-- Create index for better performance on bookmarks
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON public.bookmarks(post_id);
CREATE INDEX idx_mentions_mentioned_user ON public.mentions(mentioned_user_id);
CREATE INDEX idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX idx_posts_category ON public.posts(category);
