
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string;
  };
}

export const useRealTimeMessages = (conversationId: string) => {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      // Transform the data to match our Message type
      const transformedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        content: msg.content || '',
        sender_id: msg.sender_id,
        conversation_id: msg.conversation_id,
        created_at: msg.created_at,
        sender: {
          full_name: msg.sender?.full_name || 'Unknown User',
          avatar_url: msg.sender?.avatar_url || ''
        }
      }));
      setMessages(transformedMessages);
    }
    setLoading(false);
  }, [conversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!profile?.id || !conversationId) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        content,
        sender_id: profile.id,
        conversation_id: conversationId,
      });

    if (error) {
      console.error('Error sending message:', error);
    }
  }, [profile?.id, conversationId]);

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!sender_id(full_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            // Transform the data to match our Message type
            const transformedMessage: Message = {
              id: data.id,
              content: data.content || '',
              sender_id: data.sender_id,
              conversation_id: data.conversation_id,
              created_at: data.created_at,
              sender: {
                full_name: data.sender?.full_name || 'Unknown User',
                avatar_url: data.sender?.avatar_url || ''
              }
            };
            setMessages(prev => [...prev, transformedMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  return {
    messages,
    loading,
    sendMessage,
  };
};
