
-- Create enum types for cultural data
CREATE TYPE user_language AS ENUM ('punjabi', 'english', 'both');
CREATE TYPE cultural_specialty AS ENUM ('traditional', 'folk', 'bhangra', 'sufi', 'qawwali', 'gurbani');
CREATE TYPE cultural_theme AS ENUM ('religious', 'celebratory', 'romantic', 'patriotic', 'spiritual', 'festive');
CREATE TYPE collaboration_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('collaboration_invite', 'project_update', 'message', 'cultural_content', 'verification_status');

-- Update profiles table with cultural fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language user_language DEFAULT 'english';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cultural_specialties cultural_specialty[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cultural_themes cultural_theme[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_date TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cultural_background TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instruments TEXT[] DEFAULT '{}';

-- Update projects table with cultural fields
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cultural_theme cultural_theme;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS language_requirements TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cultural_instruments TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS collaboration_status collaboration_status DEFAULT 'pending';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';

-- Create cultural_collaborations table
CREATE TABLE IF NOT EXISTS public.cultural_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  collaborator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  cultural_contribution TEXT,
  language_requirements TEXT[] DEFAULT '{}',
  status collaboration_status DEFAULT 'pending',
  invited_by UUID REFERENCES public.profiles(id),
  invited_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  cultural_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create cultural_content table for managing cultural assets
CREATE TABLE IF NOT EXISTS public.cultural_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'pattern', 'icon', 'sound', 'template'
  category cultural_specialty,
  file_url TEXT,
  description TEXT,
  cultural_significance TEXT,
  usage_permissions TEXT DEFAULT 'public',
  created_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approval_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create real_time_sessions table for tracking live collaboration
CREATE TABLE IF NOT EXISTS public.real_time_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL, -- 'collaboration', 'review', 'practice'
  status TEXT DEFAULT 'active',
  last_activity TIMESTAMPTZ DEFAULT now(),
  session_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create cultural_notifications table for enhanced notifications
CREATE TABLE IF NOT EXISTS public.cultural_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  cultural_context JSONB DEFAULT '{}',
  sound_alert TEXT, -- traditional sound file reference
  is_read BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'normal',
  related_project_id BIGINT REFERENCES public.projects(id),
  related_user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create file_versions table for version control
CREATE TABLE IF NOT EXISTS public.file_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  file_size BIGINT,
  checksum TEXT,
  created_by UUID REFERENCES public.profiles(id),
  change_description TEXT,
  cultural_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, file_path, version_number)
);

-- Enable RLS on new tables
ALTER TABLE public.cultural_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cultural_collaborations
CREATE POLICY "Users can view collaborations they're part of" ON public.cultural_collaborations
FOR SELECT USING (
  collaborator_id = auth.uid() OR 
  invited_by = auth.uid() OR
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);

CREATE POLICY "Project owners can invite collaborators" ON public.cultural_collaborations
FOR INSERT WITH CHECK (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);

CREATE POLICY "Collaborators can update their own status" ON public.cultural_collaborations
FOR UPDATE USING (collaborator_id = auth.uid());

-- RLS Policies for cultural_content
CREATE POLICY "Public cultural content is viewable by all" ON public.cultural_content
FOR SELECT USING (usage_permissions = 'public' AND approval_status = 'approved');

CREATE POLICY "Users can view their own content" ON public.cultural_content
FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create cultural content" ON public.cultural_content
FOR INSERT WITH CHECK (created_by = auth.uid());

-- RLS Policies for real_time_sessions
CREATE POLICY "Users can view their own sessions" ON public.real_time_sessions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own sessions" ON public.real_time_sessions
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions" ON public.real_time_sessions
FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for cultural_notifications
CREATE POLICY "Users can view their own notifications" ON public.cultural_notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.cultural_notifications
FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for file_versions
CREATE POLICY "Project members can view file versions" ON public.file_versions
FOR SELECT USING (
  project_id IN (
    SELECT p.id FROM public.projects p 
    LEFT JOIN public.cultural_collaborations cc ON p.id = cc.project_id
    WHERE p.user_id = auth.uid() OR cc.collaborator_id = auth.uid()
  )
);

CREATE POLICY "Project members can create file versions" ON public.file_versions
FOR INSERT WITH CHECK (
  project_id IN (
    SELECT p.id FROM public.projects p 
    LEFT JOIN public.cultural_collaborations cc ON p.id = cc.project_id
    WHERE p.user_id = auth.uid() OR cc.collaborator_id = auth.uid()
  ) AND created_by = auth.uid()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cultural_collaborations_project_id ON public.cultural_collaborations(project_id);
CREATE INDEX IF NOT EXISTS idx_cultural_collaborations_collaborator_id ON public.cultural_collaborations(collaborator_id);
CREATE INDEX IF NOT EXISTS idx_cultural_content_category ON public.cultural_content(category);
CREATE INDEX IF NOT EXISTS idx_cultural_content_approval_status ON public.cultural_content(approval_status);
CREATE INDEX IF NOT EXISTS idx_real_time_sessions_project_user ON public.real_time_sessions(project_id, user_id);
CREATE INDEX IF NOT EXISTS idx_cultural_notifications_user_unread ON public.cultural_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_file_versions_project_path ON public.file_versions(project_id, file_path);

-- Enable real-time for tables
ALTER TABLE public.cultural_collaborations REPLICA IDENTITY FULL;
ALTER TABLE public.real_time_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.cultural_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.cultural_collaborations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.real_time_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cultural_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create storage buckets for cultural assets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('cultural-assets', 'cultural-assets', true),
  ('audio-samples', 'audio-samples', true),
  ('project-files', 'project-files', false),
  ('cultural-sounds', 'cultural-sounds', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cultural assets
CREATE POLICY "Public read access to cultural assets" ON storage.objects
FOR SELECT USING (bucket_id = 'cultural-assets');

CREATE POLICY "Authenticated users can upload cultural assets" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cultural-assets');

-- Storage policies for audio samples
CREATE POLICY "Public read access to audio samples" ON storage.objects
FOR SELECT USING (bucket_id = 'audio-samples');

CREATE POLICY "Artists can upload audio samples" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'audio-samples');

-- Storage policies for project files (private)
CREATE POLICY "Project members can access project files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'project-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Project members can upload project files" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'project-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to get user's cultural profile
CREATE OR REPLACE FUNCTION public.get_user_cultural_profile(user_id UUID)
RETURNS TABLE (
  preferred_language user_language,
  cultural_specialties cultural_specialty[],
  cultural_themes cultural_theme[],
  verification_status TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    p.preferred_language,
    p.cultural_specialties,
    p.cultural_themes,
    p.verification_status
  FROM public.profiles p
  WHERE p.id = user_id;
$$;

-- Create function to update real-time session activity
CREATE OR REPLACE FUNCTION public.update_session_activity(session_id UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  UPDATE public.real_time_sessions 
  SET last_activity = now()
  WHERE id = session_id AND user_id = auth.uid();
$$;

-- Create function to send cultural notification
CREATE OR REPLACE FUNCTION public.send_cultural_notification(
  recipient_id UUID,
  notification_type notification_type,
  title TEXT,
  message TEXT,
  cultural_context JSONB DEFAULT '{}',
  sound_alert TEXT DEFAULT NULL,
  priority TEXT DEFAULT 'normal'
)
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  INSERT INTO public.cultural_notifications (
    user_id, type, title, message, cultural_context, sound_alert, priority
  ) VALUES (
    recipient_id, notification_type, title, message, cultural_context, sound_alert, priority
  )
  RETURNING id;
$$;
