import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, AlertCircle, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileAttachment from '@/components/chat/FileAttachment';
import { VoiceMessageRecorder } from '@/components/chat/VoiceMessageRecorder';
import { VoiceMessagePlayer } from '@/components/chat/VoiceMessagePlayer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';
import { toast } from 'sonner';

interface ConversationViewProps {
  conversationId?: string;
  onBack?: () => void;
}

const ConversationView = ({ conversationId, onBack }: ConversationViewProps) => {
  const { conversationId: paramConversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const finalConversationId = conversationId || paramConversationId;
  
  const [conversation, setConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { 
    messages, 
    loading: messagesLoading, 
    sending, 
    error: messagesError, 
    sendMessage, 
    refetch: refetchMessages 
  } = useRealTimeMessages(finalConversationId || '');

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch conversation details
  useEffect(() => {
    const fetchConversation = async () => {
      if (!finalConversationId || !user) return;

      try {
        const { data: conversationData, error } = await supabase
          .from('conversations')
          .select(`
            *,
            conversation_participants (
              user_id,
              profiles (
                id,
                full_name,
                avatar_url
              )
            )
          `)
          .eq('id', finalConversationId)
          .single();

        if (error) {
          console.error('Error fetching conversation:', error);
          toast.error('Failed to load conversation');
          return;
        }

        setConversation(conversationData);
      } catch (error) {
        console.error('Error in fetchConversation:', error);
        toast.error('Failed to load conversation');
      }
    };

    fetchConversation();
  }, [finalConversationId, user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard', { state: { activeTab: 'messages' } });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !isOnline) return;

    const success = await sendMessage({ content: newMessage.trim() });
    if (success) {
      setNewMessage('');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !finalConversationId || !user || !isOnline) return;

    const fileId = uuidv4();
    const filePath = `${user.id}/${finalConversationId}/${fileId}-${file.name}`;

    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const { error: uploadError } = await supabase.storage
        .from('chat_attachments')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const success = await sendMessage({
        file_path: filePath,
        file_metadata: { 
          name: file.name, 
          type: file.type, 
          size: file.size 
        }
      });

      if (success) {
        toast.success('File sent!', { id: toastId });
      } else {
        toast.error('Failed to send file', { id: toastId });
      }
    } catch (error: any) {
      console.error('File upload error:', error);
      toast.error(`Failed to upload file: ${error.message}`, { id: toastId });
    }
  };

  const handleSendVoiceMessage = async (audioBlob: Blob, duration: number) => {
    if (!finalConversationId || !user || !isOnline) return;

    const fileId = uuidv4();
    const filePath = `${user.id}/${finalConversationId}/voice_${fileId}.webm`;

    const toastId = toast.loading('Sending voice message...');

    try {
      const { error: uploadError } = await supabase.storage
        .from('chat_attachments')
        .upload(filePath, audioBlob);

      if (uploadError) {
        throw uploadError;
      }

      const success = await sendMessage({
        file_path: filePath,
        file_metadata: { 
          name: `voice_message_${Date.now()}.webm`, 
          type: 'audio/webm', 
          size: audioBlob.size,
          duration: duration,
          isVoiceMessage: true
        }
      });

      if (success) {
        toast.success('Voice message sent!', { id: toastId });
      } else {
        toast.error('Failed to send voice message', { id: toastId });
      }
    } catch (error: any) {
      console.error('Voice message upload error:', error);
      toast.error(`Failed to upload voice message: ${error.message}`, { id: toastId });
    }
  };

  const getConversationDisplayName = () => {
    if (!conversation || !user) return 'Loading...';
    
    if (conversation.is_group_chat) {
      return conversation.name || 'Group Chat';
    }
    
    const otherParticipant = conversation.conversation_participants.find(
      (p: any) => p.user_id !== user.id
    );
    
    return otherParticipant?.profiles?.full_name || 'Unknown User';
  };

  const renderMessage = (message: any) => {
    const isCurrentUser = message.sender_id === user?.id;

    return (
      <div key={message.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : ''}`}>
        {!isCurrentUser && (
          <img 
            src={message.sender?.avatar_url || '/placeholder.jpg'} 
            alt={message.sender?.full_name || 'Avatar'} 
            className="w-8 h-8 rounded-full object-cover" 
          />
        )}
        <div className={`rounded-lg px-3 py-2 max-w-sm ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}>
          {message.content && <p className="text-sm">{message.content}</p>}
          {message.file_path && message.file_metadata && (
            message.file_metadata?.isVoiceMessage ? (
              <VoiceMessagePlayer 
                filePath={message.file_path} 
                duration={message.file_metadata?.duration}
              />
            ) : (
              <FileAttachment 
                filePath={message.file_path} 
                fileMetadata={message.file_metadata} 
              />
            )
          )}
          <p className={`text-xs mt-1 ${
            isCurrentUser 
              ? 'text-primary-foreground/80' 
              : 'text-muted-foreground/80'
          }`}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        {isCurrentUser && profile && (
          <img 
            src={profile.avatar_url || '/placeholder.jpg'} 
            alt={profile.full_name || 'Avatar'} 
            className="w-8 h-8 rounded-full object-cover" 
          />
        )}
      </div>
    );
  };

  if (!finalConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No conversation selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{getConversationDisplayName()}</h2>
            {!isOnline && (
              <p className="text-sm text-muted-foreground">Offline</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refetchMessages}
            disabled={messagesLoading}
          >
            <RefreshCw className={`w-4 h-4 ${messagesLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {messagesError && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {messagesError}
              <Button
                variant="outline"
                size="sm"
                onClick={refetchMessages}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {messagesLoading ? (
            <p className="text-center text-muted-foreground">Loading messages...</p>
          ) : messages.length > 0 ? (
            messages.map(renderMessage)
          ) : (
            <p className="text-center text-muted-foreground">No messages yet. Say hello!</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={() => fileInputRef.current?.click()}
            disabled={!isOnline || sending}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <VoiceMessageRecorder 
            onSendVoiceMessage={handleSendVoiceMessage}
            disabled={!finalConversationId || !isOnline || sending}
          />
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/jpeg,image/png,audio/mpeg,audio/wav,application/pdf"
          />
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isOnline ? "Type a message..." : "Connect to internet to send messages"}
            autoComplete="off"
            className="flex-1"
            disabled={!isOnline || sending}
          />
          
          <Button 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim() || sending || !isOnline}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {sending && (
          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Sending message...
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationView;
