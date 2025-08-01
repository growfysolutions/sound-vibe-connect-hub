
-- Drop the current recursive policy that's causing infinite recursion
DROP POLICY "conversation_participants_select_policy" ON public.conversation_participants;

-- Create a new policy that uses the existing security definer function
CREATE POLICY "conversation_participants_select_policy" ON public.conversation_participants
FOR SELECT USING (
  public.is_member_of_conversation(conversation_id, auth.uid())
);
