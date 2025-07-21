-- Drop ALL existing policies on conversation_participants to ensure clean slate
DROP POLICY IF EXISTS "Users can view conversation participants directly" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants of conversations they are in." ON conversation_participants;
DROP POLICY IF EXISTS "Allow viewing participants in one's own conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Allow read access to conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Allow users to add themselves to conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to conversations they are in." ON conversation_participants;
DROP POLICY IF EXISTS "Allow insert access to conversation participants" ON conversation_participants;

-- Create a single, simple policy for conversation_participants
CREATE POLICY "conversation_participants_select_policy" 
ON conversation_participants 
FOR SELECT 
USING (
  user_id = auth.uid()
);

-- Allow users to insert their own participation records
CREATE POLICY "conversation_participants_insert_policy" 
ON conversation_participants 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid()
);

-- Drop ALL existing policies on project_collaborators to ensure clean slate
DROP POLICY IF EXISTS "Users can view project collaborators simple" ON project_collaborators;
DROP POLICY IF EXISTS "Users can view collaborators on projects they are part of." ON project_collaborators;
DROP POLICY IF EXISTS "Allow users to view their own collaborations" ON project_collaborators;
DROP POLICY IF EXISTS "Project owners can add collaborators." ON project_collaborators;
DROP POLICY IF EXISTS "Project owners can remove collaborators." ON project_collaborators;

-- Create simple policies for project_collaborators
CREATE POLICY "project_collaborators_select_policy" 
ON project_collaborators 
FOR SELECT 
USING (
  user_id = auth.uid() 
  OR 
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "project_collaborators_insert_policy" 
ON project_collaborators 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()
  )
);

CREATE POLICY "project_collaborators_delete_policy" 
ON project_collaborators 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid()
  )
);