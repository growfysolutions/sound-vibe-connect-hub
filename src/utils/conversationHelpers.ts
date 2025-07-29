
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CreateConversationParams {
  participantIds: string[];
  isGroupChat?: boolean;
  name?: string;
  projectId?: number;
}

export const createConversation = async (params: CreateConversationParams) => {
  const { participantIds, isGroupChat = false, name, projectId } = params;

  // Validate participants
  if (participantIds.length < 2) {
    throw new Error('A conversation must have at least 2 participants');
  }

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Ensure current user is included in participants
    const uniqueParticipants = Array.from(new Set([user.id, ...participantIds]));
    
    if (uniqueParticipants.length < 2) {
      throw new Error('A conversation must have at least 2 unique participants');
    }

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        created_by: user.id,
        is_group_chat: isGroupChat,
        name: isGroupChat ? name : null,
        project_id: projectId || null,
      })
      .select()
      .single();

    if (convError) {
      console.error('Error creating conversation:', convError);
      throw new Error(`Failed to create conversation: ${convError.message}`);
    }

    // Add all participants
    const participantInserts = uniqueParticipants.map(userId => ({
      conversation_id: conversation.id,
      user_id: userId,
    }));

    const { error: participantError } = await supabase
      .from('conversation_participants')
      .insert(participantInserts);

    if (participantError) {
      console.error('Error adding participants:', participantError);
      // Try to cleanup the conversation if participant insertion fails
      await supabase.from('conversations').delete().eq('id', conversation.id);
      throw new Error(`Failed to add participants: ${participantError.message}`);
    }

    console.log('Conversation created successfully:', conversation.id);
    return conversation;

  } catch (error: any) {
    console.error('Error in createConversation:', error);
    toast.error(error.message || 'Failed to create conversation');
    throw error;
  }
};

export const findOrCreateDirectConversation = async (otherUserId: string) => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    if (user.id === otherUserId) {
      throw new Error('Cannot create conversation with yourself');
    }

    // Look for existing direct conversation between these two users
    const { data: existingConversations, error: searchError } = await supabase
      .from('conversations')
      .select(`
        id,
        is_group_chat,
        conversation_participants (
          user_id
        )
      `)
      .eq('is_group_chat', false);

    if (searchError) {
      console.error('Error searching for existing conversations:', searchError);
    } else if (existingConversations) {
      // Find a conversation that has exactly these two users
      const directConversation = existingConversations.find(conv => {
        const participantIds = conv.conversation_participants.map(p => p.user_id);
        return participantIds.length === 2 && 
               participantIds.includes(user.id) && 
               participantIds.includes(otherUserId);
      });

      if (directConversation) {
        console.log('Found existing direct conversation:', directConversation.id);
        return directConversation;
      }
    }

    // Create new direct conversation
    console.log('Creating new direct conversation between', user.id, 'and', otherUserId);
    return await createConversation({
      participantIds: [otherUserId],
      isGroupChat: false,
    });

  } catch (error: any) {
    console.error('Error in findOrCreateDirectConversation:', error);
    throw error;
  }
};

export const validateConversationStructure = async (conversationId: string) => {
  try {
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select(`
        id,
        conversation_participants (
          user_id,
          profiles (id, full_name)
        )
      `)
      .eq('id', conversationId)
      .single();

    if (error) {
      console.error('Error validating conversation structure:', error);
      return { isValid: false, error: error.message };
    }

    const participants = conversation?.conversation_participants || [];
    
    if (participants.length < 2) {
      return { 
        isValid: false, 
        error: 'Conversation has insufficient participants',
        participantCount: participants.length 
      };
    }

    return { 
      isValid: true, 
      participantCount: participants.length,
      participants: participants.map(p => ({
        id: p.user_id,
        name: p.profiles?.full_name || 'Unknown User'
      }))
    };

  } catch (error: any) {
    console.error('Error in validateConversationStructure:', error);
    return { isValid: false, error: error.message };
  }
};
