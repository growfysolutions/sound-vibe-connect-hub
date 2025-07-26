
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/contexts/ProfileContext';
import { Message, SendMessageData } from '@/types/message';
import { toast } from 'sonner';

export const useRealTimeMessages = (conversationId: string) => {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(id, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages');
        toast.error('Failed to load messages');
      } else {
        const transformedMessages: Message[] = (data || []).map(msg => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          conversation_id: msg.conversation_id,
          created_at: msg.created_at,
          updated_at: msg.updated_at || undefined,
          file_path: msg.file_path,
          file_metadata: msg.file_metadata as any,
          sender: {
            id: msg.sender?.id || msg.sender_id,
            full_name: msg.sender?.full_name || 'Unknown User',
            avatar_url: msg.sender?.avatar_url || null
          }
        }));
        setMessages(transformedMessages);
      }
    } catch (err) {
      console.error('Error in fetchMessages:', err);
      setError('Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const validateMessage = (data: SendMessageData): boolean => {
    if (!data.content?.trim() && !data.file_path) {
      toast.error('Message cannot be empty');
      return false;
    }
    return true;
  };

  const sendMessage = useCallback(async (data: SendMessageData, retryCount = 0) => {
    if (!profile?.id || !conversationId) {
      toast.error('Unable to send message. Please try again.');
      return false;
    }

    if (!validateMessage(data)) {
      return false;
    }

    setSending(true);
    setError(null);

    try {
      // Check network connectivity
      if (!navigator.onLine) {
        toast.error('No internet connection. Please check your connection.');
        return false;
      }

      console.log('Sending message:', data);
      
      const messageData = {
        content: data.content || null,
        sender_id: profile.id,
        conversation_id: conversationId,
        file_path: data.file_path || null,
        file_metadata: data.file_metadata || null,
      };

      const { data: result, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select();

      if (error) {
        console.error('Error sending message:', error);
        
        // Retry logic for transient errors
        if (retryCount < 2 && (error.code === 'PGRST301' || error.message.includes('timeout'))) {
          console.log(`Retrying message send (attempt ${retryCount + 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return sendMessage(data, retryCount + 1);
        }
        
        toast.error(`Failed to send message: ${error.message}`);
        setError(error.message);
        return false;
      }

      console.log('Message sent successfully:', result);
      toast.success('Message sent!');
      return true;

    } catch (err: any) {
      console.error('Error in sendMessage:', err);
      
      // Retry for network errors
      if (retryCount < 2 && err.name === 'NetworkError') {
        console.log(`Retrying message send (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return sendMessage(data, retryCount + 1);
      }
      
      const errorMessage = err.message || 'Failed to send message';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setSending(false);
    }
  }, [profile?.id, conversationId]);

  useEffect(() => {
    fetchMessages();

    if (!conversationId) return;

    // Set up real-time subscription with error handling
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
          try {
            console.log('Real-time message received:', payload);
            
            // Fetch the complete message with sender info
            const { data, error } = await supabase
              .from('messages')
              .select(`
                *,
                sender:profiles!sender_id(id, full_name, avatar_url)
              `)
              .eq('id', payload.new.id)
              .single();

            if (error) {
              console.error('Error fetching new message details:', error);
              return;
            }

            if (data) {
              const transformedMessage: Message = {
                id: data.id,
                content: data.content,
                sender_id: data.sender_id,
                conversation_id: data.conversation_id,
                created_at: data.created_at,
                updated_at: data.updated_at || undefined,
                file_path: data.file_path,
                file_metadata: data.file_metadata as any,
                sender: {
                  id: data.sender?.id || data.sender_id,
                  full_name: data.sender?.full_name || 'Unknown User',
                  avatar_url: data.sender?.avatar_url || null
                }
              };
              
              setMessages(prev => {
                // Avoid duplicates
                if (prev.find(msg => msg.id === transformedMessage.id)) {
                  return prev;
                }
                return [...prev, transformedMessage];
              });
            }
          } catch (err) {
            console.error('Error handling real-time message:', err);
          }
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        if (status !== 'SUBSCRIBED') {
          console.error('Real-time subscription error, status:', status);
          toast.error('Real-time messaging temporarily unavailable');
        }
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refetch: fetchMessages,
  };
};
