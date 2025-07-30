
-- Update the conversation_participants RLS policy to allow users to see all participants
-- in conversations they are part of, while maintaining security

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "conversation_participants_select_policy" ON public.conversation_participants;

-- Create a new policy that allows users to see all participants in conversations they're part of
CREATE POLICY "conversation_participants_select_policy" ON public.conversation_participants
FOR SELECT USING (
  EXISTS (
    SELECT 1 
    FROM public.conversation_participants cp 
    WHERE cp.conversation_id = conversation_participants.conversation_id 
    AND cp.user_id = auth.uid()
  )
);
