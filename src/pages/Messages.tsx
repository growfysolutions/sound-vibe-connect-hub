
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Send, Paperclip, AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileAttachment from '@/components/chat/FileAttachment';
import { VoiceMessageRecorder } from '@/components/chat/VoiceMessageRecorder';
import { VoiceMessagePlayer } from '@/components/chat/VoiceMessagePlayer';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';

const getOtherParticipants = (conversation: Conversation, currentUserId: string) => {
  return conversation.conversation_participants.filter(p => p.user_id !== currentUserId);
};

const getConversationDisplayInfo = (conversation: Conversation, currentUserId: string) => {
  if (conversation.is_group_chat) {
    return {
      name: conversation.name || 'Group Chat',
      avatar_url: '/group-avatar.png',
    };
  }
  const otherParticipant = getOtherParticipants(conversation, currentUserId)[0];
  return {
    name: otherParticipant?.profiles.full_name || 'Unknown User',
    avatar_url: otherParticipant?.profiles.avatar_url || '/placeholder.jpg',
  };
};

const Messages = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('messages');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Use the updated hook for real-time messages
  const { 
    messages, 
    loading: messagesLoading, 
    sending, 
    error: messagesError, 
    sendMessage, 
    refetch: refetchMessages 
  } = useRealTimeMessages(selectedConversation?.id || '');

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchConversations = async () => {
    try {
      setConversationsError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setCurrentUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        toast.error('Failed to fetch user profile.');
      } else {
        setCurrentUserProfile(profileData);
      }

      // Get conversations where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participantError) {
        throw participantError;
      }

      const conversationIds = participantData?.map(p => p.conversation_id) || [];
      
      if (conversationIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Fetch conversations with all participants
      const { data: conversationsData, error: conversationsError } = await supabase
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
        .in('id', conversationIds)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (conversationsError) {
        throw conversationsError;
      }

      setConversations(conversationsData as Conversation[] || []);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setConversationsError(error.message || 'Failed to load conversations');
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const passedConversation = location.state?.conversation as Conversation | undefined;
    if (passedConversation) {
      if (!conversations.find(c => c.id === passedConversation.id)) {
        setConversations(prev => [passedConversation, ...prev.filter(c => c.id !== passedConversation.id)]);
      }
      setSelectedConversation(passedConversation);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    if (!file || !selectedConversation || !currentUser || !isOnline) return;

    const fileId = uuidv4();
    const filePath = `${currentUser.id}/${selectedConversation.id}/${fileId}-${file.name}`;

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
    if (!selectedConversation || !currentUser || !isOnline) return;

    const fileId = uuidv4();
    const filePath = `${currentUser.id}/${selectedConversation.id}/voice_${fileId}.webm`;

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

  const renderMessage = (message: any) => {
    const isCurrentUser = message.sender_id === currentUser?.id;

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
        {isCurrentUser && currentUserProfile && (
          <img 
            src={currentUserProfile.avatar_url || '/placeholder.jpg'} 
            alt={currentUserProfile.full_name || 'Avatar'} 
            className="w-8 h-8 rounded-full object-cover" 
          />
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <DashboardSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
            <div className="text-sm text-muted-foreground">ਸੁਨੇਹੇ</div>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchConversations}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Messages Interface */}
        <div className="flex-1 flex min-h-0">
          {/* Conversations List */}
          <div className="w-80 border-r border-border bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-semibold">Chats</h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {loading ? (
                  <p className="p-4 text-muted-foreground">Loading conversations...</p>
                ) : conversationsError ? (
                  <Alert className="m-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {conversationsError}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchConversations}
                        className="ml-2"
                      >
                        Retry
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : conversations.length > 0 ? (
                  conversations.map(convo => {
                    const displayInfo = getConversationDisplayInfo(convo, currentUser?.id || '');
                    return (
                      <div
                        key={convo.id}
                        className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors ${
                          selectedConversation?.id === convo.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedConversation(convo)}
                      >
                        <img 
                          src={displayInfo.avatar_url} 
                          alt={displayInfo.name} 
                          className="w-12 h-12 rounded-full object-cover" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{displayInfo.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {convo.messages?.[0]?.content || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="p-4 text-muted-foreground">No conversations yet.</p>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-background">
            {selectedConversation && currentUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-card">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {getConversationDisplayInfo(selectedConversation, currentUser.id).name}
                    </h2>
                    {!isOnline && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <WifiOff className="w-4 h-4" />
                        Offline
                      </div>
                    )}
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
                      disabled={!selectedConversation || !isOnline || sending}
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
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <MessageSquare size={48} className="mb-4" />
                <p>Select a conversation to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};

export default Messages;
