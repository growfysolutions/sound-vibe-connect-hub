
-- Create a table for media uploads with metadata
CREATE TABLE public.media_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  duration INTEGER, -- in seconds for audio/video
  waveform_data JSONB, -- for audio visualization
  upload_status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;

-- Users can view their own uploads
CREATE POLICY "Users can view their own uploads" ON public.media_uploads
FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own uploads
CREATE POLICY "Users can insert their own uploads" ON public.media_uploads
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own uploads
CREATE POLICY "Users can update their own uploads" ON public.media_uploads
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own uploads
CREATE POLICY "Users can delete their own uploads" ON public.media_uploads
FOR DELETE USING (auth.uid() = user_id);

-- Create a storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('media-uploads', 'media-uploads', true);

-- Storage policies for media uploads
CREATE POLICY "Allow authenticated users to upload media" ON storage.objects
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'media-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own files
CREATE POLICY "Allow users to view their own media files" ON storage.objects
FOR SELECT USING (bucket_id = 'media-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own media files" ON storage.objects
FOR DELETE USING (bucket_id = 'media-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
