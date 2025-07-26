
-- First, let's clean up the messages table schema
-- Remove duplicate columns and fix the schema
ALTER TABLE public.messages DROP COLUMN IF EXISTS topic;
ALTER TABLE public.messages DROP COLUMN IF EXISTS extension;
ALTER TABLE public.messages DROP COLUMN IF EXISTS updated_at;
ALTER TABLE public.messages DROP COLUMN IF EXISTS inserted_at;

-- Ensure the table has the correct structure
-- Add updated_at column with proper default and trigger
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create or replace the update trigger for messages
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Clean up RLS policies - remove duplicates and conflicting policies
DROP POLICY IF EXISTS "Allow users to see messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Allow users to send messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Participants can send messages in their conversations." ON public.messages;
DROP POLICY IF EXISTS "Participants can view messages in their conversations." ON public.messages;

-- Create simplified RLS policies
CREATE POLICY "users_can_view_conversation_messages" ON public.messages
    FOR SELECT USING (is_member_of_conversation(conversation_id, auth.uid()));

CREATE POLICY "users_can_send_conversation_messages" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND 
        is_member_of_conversation(conversation_id, auth.uid())
    );

-- Update conversations table to have proper last_message_at trigger
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS update_conversation_last_message_trigger ON public.messages;
CREATE TRIGGER update_conversation_last_message_trigger
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();
