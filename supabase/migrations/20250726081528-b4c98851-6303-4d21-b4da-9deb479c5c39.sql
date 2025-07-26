
-- Create project sessions table for real-time collaboration tracking
CREATE TABLE public.project_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL DEFAULT 'collaboration',
  status TEXT NOT NULL DEFAULT 'active',
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project files table for project-specific file management
CREATE TABLE public.project_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  duration INTEGER NULL,
  metadata JSONB DEFAULT '{}',
  version_number INTEGER NOT NULL DEFAULT 1,
  is_current_version BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project comments table for timeline comments and annotations
CREATE TABLE public.project_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_id UUID NULL REFERENCES public.project_files(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp_ms INTEGER NULL, -- For audio/video comments at specific times
  position_data JSONB NULL, -- For visual annotations
  parent_comment_id UUID NULL REFERENCES public.project_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project versions table for version control
CREATE TABLE public.project_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL,
  description TEXT,
  changes JSONB DEFAULT '[]',
  file_snapshot JSONB DEFAULT '{}',
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project tasks table for enhanced task management
CREATE TABLE public.project_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assignee_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tags JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security policies
ALTER TABLE public.project_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

-- Project sessions policies
CREATE POLICY "Users can view sessions for projects they collaborate on" 
  ON public.project_sessions FOR SELECT 
  USING (
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create sessions for projects they collaborate on"
  ON public.project_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their own sessions"
  ON public.project_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Project files policies
CREATE POLICY "Users can view files for projects they collaborate on"
  ON public.project_files FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can upload files to projects they collaborate on"
  ON public.project_files FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid() AND pc.role IN ('Admin', 'Contributor')
      )
    )
  );

-- Project comments policies
CREATE POLICY "Users can view comments for projects they collaborate on"
  ON public.project_comments FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create comments on projects they collaborate on"
  ON public.project_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid()
      )
    )
  );

-- Project versions policies
CREATE POLICY "Users can view versions for projects they collaborate on"
  ON public.project_versions FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create versions for projects they collaborate on"
  ON public.project_versions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid() AND pc.role IN ('Admin', 'Contributor')
      )
    )
  );

-- Project tasks policies
CREATE POLICY "Users can view tasks for projects they collaborate on"
  ON public.project_tasks FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create tasks for projects they collaborate on"
  ON public.project_tasks FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id AND
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid() AND pc.role IN ('Admin', 'Contributor')
      )
    )
  );

CREATE POLICY "Users can update tasks for projects they collaborate on"
  ON public.project_tasks FOR UPDATE
  USING (
    project_id IN (
      SELECT p.id FROM public.projects p 
      WHERE p.user_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.project_collaborators pc 
        WHERE pc.project_id = p.id AND pc.user_id = auth.uid() AND pc.role IN ('Admin', 'Contributor')
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_project_sessions_project_id ON public.project_sessions(project_id);
CREATE INDEX idx_project_sessions_user_id ON public.project_sessions(user_id);
CREATE INDEX idx_project_sessions_status ON public.project_sessions(status);

CREATE INDEX idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX idx_project_files_user_id ON public.project_files(user_id);
CREATE INDEX idx_project_files_current_version ON public.project_files(is_current_version);

CREATE INDEX idx_project_comments_project_id ON public.project_comments(project_id);
CREATE INDEX idx_project_comments_file_id ON public.project_comments(file_id);
CREATE INDEX idx_project_comments_parent ON public.project_comments(parent_comment_id);

CREATE INDEX idx_project_versions_project_id ON public.project_versions(project_id);
CREATE INDEX idx_project_versions_current ON public.project_versions(is_current);

CREATE INDEX idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX idx_project_tasks_assignee ON public.project_tasks(assignee_id);
CREATE INDEX idx_project_tasks_status ON public.project_tasks(status);

-- Add triggers for updated_at columns
CREATE TRIGGER update_project_sessions_updated_at 
  BEFORE UPDATE ON public.project_sessions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_files_updated_at 
  BEFORE UPDATE ON public.project_files 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_comments_updated_at 
  BEFORE UPDATE ON public.project_comments 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at 
  BEFORE UPDATE ON public.project_tasks 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable real-time subscriptions for collaboration features
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_files;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_versions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_tasks;

-- Set replica identity for real-time updates
ALTER TABLE public.project_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.project_files REPLICA IDENTITY FULL;
ALTER TABLE public.project_comments REPLICA IDENTITY FULL;
ALTER TABLE public.project_versions REPLICA IDENTITY FULL;
ALTER TABLE public.project_tasks REPLICA IDENTITY FULL;
