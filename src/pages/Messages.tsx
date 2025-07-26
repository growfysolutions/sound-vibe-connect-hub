import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Send, Paperclip } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import FileAttachment from '@/components/chat/FileAttachment';
import { VoiceMessageRecorder } from '@/components/chat/VoiceMessageRecorder';
import { VoiceMessagePlayer } from '@/components/chat/VoiceMessagePlayer';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Message } from '@/types';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const getOtherParticipants = (conversation: Conversation, currentUserId: string) => {
  return conversation.conversation_participants.filter(p => p.user_id !== currentUserId);
};

const getConversationDisplayInfo = (conversation: Conversation, currentUserId: string) => {
  if (conversation.is_group_chat) {
    return {
      name: conversation.name || 'Group Chat',
      avatar_url: '/group-avatar.png', // Placeholder for group avatar
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
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
        toast.error('Failed to fetch user profile.');
      } else {
        setCurrentUserProfile(profileData);
      }

      // Use a simple approach - get all conversations and then filter by participants
      const { data: directConversations, error: directError } = await supabase
        .from('conversations')
        .select(`
          id,
          name,
          is_group_chat,
          last_message_at,
          created_at,
          created_by
        `)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (directError) {
        toast.error('Failed to fetch user conversations.');
        console.error('Error fetching conversations:', directError);
        setLoading(false);
        return;
      }

      // For each conversation, get participants separately to avoid recursion
      const conversationsWithParticipants = [];
      
      for (const conv of directConversations || []) {
        try {
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select(`
              user_id,
              profiles (
                id,
                full_name,
                avatar_url
              )
            `)
            .eq('conversation_id', conv.id);

          // Only include conversations where current user is a participant
          if (participants?.some(p => p.user_id === user.id)) {
            conversationsWithParticipants.push({
              ...conv,
              conversation_participants: participants || []
            });
          }
        } catch (error) {
          console.error(`Error fetching participants for conversation ${conv.id}:`, error);
        }
      }

      setConversations(conversationsWithParticipants as Conversation[]);
      setLoading(false);
    };

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
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      setLoadingMessages(true);
      // Fetch messages first
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });

      if (error) {
        toast.error('Failed to fetch messages.');
        setLoadingMessages(false);
        return;
      }

      // Then fetch sender profiles for each message
      const messagesWithSenders = await Promise.all(
        messagesData.map(async (message) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', message.sender_id)
            .single();
          
          return {
            ...message,
            sender: senderData
          };
        })
      );

      setMessages(messagesWithSenders as Message[]);
      setLoadingMessages(false);
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages:${selectedConversation?.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversation?.id}` },
        async (payload) => {
          const newMessage = payload.new as Message;
          const { data: senderData, error: senderError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();
          
          if (senderError) {
            console.error('Error fetching sender profile for new message', senderError);
          } else {
            const messageWithSender = { ...newMessage, sender: senderData };
            setMessages(currentMessages => [...currentMessages, messageWithSender as any]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const { error } = await supabase.from('messages').insert({
      conversation_id: selectedConversation.id,
      sender_id: currentUser.id,
      content: newMessage,
    });

    if (error) {
      toast.error('Failed to send message.');
    } else {
      setNewMessage('');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation || !currentUser) return;

    const fileId = uuidv4();
    const filePath = `${currentUser.id}/${selectedConversation.id}/${fileId}-${file.name}`;

    const toastId = toast.loading(`Uploading ${file.name}...`);

    const { error: uploadError } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, file);

    if (uploadError) {
      toast.error(`Failed to upload file: ${uploadError.message}`, { id: toastId });
      return;
    }

    const { error: messageError } = await supabase.from('messages').insert({
      conversation_id: selectedConversation.id,
      sender_id: currentUser.id,
      file_path: filePath,
      file_metadata: { name: file.name, type: file.type, size: file.size },
    });

    if (messageError) {
      toast.error('Failed to send file message.', { id: toastId });
    } else {
      toast.success('File sent!', { id: toastId });
    }
  };

  const handleSendVoiceMessage = async (audioBlob: Blob, duration: number) => {
    if (!selectedConversation || !currentUser) return;

    const fileId = uuidv4();
    const filePath = `${currentUser.id}/${selectedConversation.id}/voice_${fileId}.webm`;

    const toastId = toast.loading('Sending voice message...');

    const { error: uploadError } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, audioBlob);

    if (uploadError) {
      toast.error(`Failed to upload voice message: ${uploadError.message}`, { id: toastId });
      return;
    }

    const { error: messageError } = await supabase.from('messages').insert({
      conversation_id: selectedConversation.id,
      sender_id: currentUser.id,
      file_path: filePath,
      file_metadata: { 
        name: `voice_message_${Date.now()}.webm`, 
        type: 'audio/webm', 
        size: audioBlob.size,
        duration: duration,
        isVoiceMessage: true
      },
    });

    if (messageError) {
      toast.error('Failed to send voice message.', { id: toastId });
    } else {
      toast.success('Voice message sent!', { id: toastId });
    }
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
        <div className="h-16 border-b border-border bg-card px-6 flex items-center">
          <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
          <div className="ml-4 text-sm text-muted-foreground">ਸੁਨੇਹੇ</div>
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
                  <h2 className="text-lg font-semibold">
                    {getConversationDisplayInfo(selectedConversation, currentUser.id).name}
                  </h2>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {loadingMessages ? (
                      <p className="text-center text-muted-foreground">Loading messages...</p>
                    ) : messages.length > 0 ? (
                      messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender_id === currentUser.id ? 'justify-end' : ''}`}>
                          {msg.sender_id !== currentUser.id && (
                            <img 
                              src={msg.sender?.avatar_url || '/placeholder.jpg'} 
                              alt={msg.sender?.full_name || 'Avatar'} 
                              className="w-8 h-8 rounded-full object-cover" 
                            />
                          )}
                          <div className={`rounded-lg px-3 py-2 max-w-sm ${
                            msg.sender_id === currentUser.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            {msg.content && <p className="text-sm">{msg.content}</p>}
                            {msg.file_path && msg.file_metadata && (
                              (msg.file_metadata as any)?.isVoiceMessage ? (
                                <VoiceMessagePlayer 
                                  filePath={msg.file_path} 
                                  duration={(msg.file_metadata as any)?.duration}
                                />
                              ) : (
                                <FileAttachment 
                                  filePath={msg.file_path} 
                                  fileMetadata={msg.file_metadata as { name: string; size: number; type: string; }} 
                                />
                              )
                            )}
                            <p className={`text-xs mt-1 ${
                              msg.sender_id === currentUser.id 
                                ? 'text-primary-foreground/80' 
                                : 'text-muted-foreground/80'
                            }`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {msg.sender_id === currentUser.id && currentUserProfile && (
                            <img 
                              src={currentUserProfile.avatar_url || '/placeholder.jpg'} 
                              alt={currentUserProfile.full_name || 'Avatar'} 
                              className="w-8 h-8 rounded-full object-cover" 
                            />
                          )}
                        </div>
                      ))
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
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <VoiceMessageRecorder 
                      onSendVoiceMessage={handleSendVoiceMessage}
                      disabled={!selectedConversation}
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
                      placeholder="Type a message..."
                      autoComplete="off"
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
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
