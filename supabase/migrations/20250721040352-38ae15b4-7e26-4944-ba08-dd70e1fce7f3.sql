-- Fix conversation_participants RLS policies to avoid infinite recursion
-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Users can view participants of conversations they are in." ON conversation_participants;
DROP POLICY IF EXISTS "Allow viewing participants in one's own conversations" ON conversation_participants;

-- Create a new, simple policy without recursion
CREATE POLICY "Users can view conversation participants directly" 
ON conversation_participants 
FOR SELECT 
USING (
  -- Allow users to see participants of conversations they are in
  conversation_id IN (
    SELECT conversation_id 
    FROM conversation_participants cp 
    WHERE cp.user_id = auth.uid()
  )
);

-- Fix project_collaborators policies to avoid infinite recursion
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view collaborators on projects they are part of." ON project_collaborators;

-- Create a simple policy without recursion
CREATE POLICY "Users can view project collaborators simple" 
ON project_collaborators 
FOR SELECT 
USING (
  -- Users can see collaborators on projects they own
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
  OR
  -- Users can see their own collaboration records
  user_id = auth.uid()
);