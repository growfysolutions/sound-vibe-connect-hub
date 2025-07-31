import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MessageCircle, Search, Plus, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface Conversation {
  id: string;
  name: string | null;
  is_group_chat: boolean;
  last_message_at: string | null;
  created_at: string;
  conversation_participants: {
    user_id: string;
    profiles: Profile;
  }[];
}

export const MessagesTab = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
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
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError);
        throw conversationsError;
      }

      // Filter out conversations with insufficient participants
      const validConversations = [];
      const invalidConversations = [];

      for (const conv of conversationsData || []) {
        const participants = conv.conversation_participants;
        
        if (!Array.isArray(participants) || participants.length < 2) {
          invalidConversations.push(conv);
          continue;
        }

        const validParticipants = participants.filter(p => p.user_id && p.profiles);
        if (validParticipants.length < 2) {
          invalidConversations.push(conv);
          continue;
        }

        validConversations.push(conv);
      }

      if (invalidConversations.length > 0) {
        console.warn(`Found ${invalidConversations.length} invalid conversations that will be hidden`);
        toast.warning(`Found ${invalidConversations.length} invalid conversation(s) that will be hidden`);
      }

      setConversations(validConversations as Conversation[]);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Search by conversation name
    if (conversation.name && conversation.name.toLowerCase().includes(query)) {
      return true;
    }
    
    // Search by participant names
    return conversation.conversation_participants.some(participant => 
      participant.profiles?.full_name?.toLowerCase().includes(query)
    );
  });

  const getConversationDisplayName = (conversation: Conversation) => {
    if (conversation.name) {
      return conversation.name;
    }
    
    // For direct messages, show the other participant's name
    const otherParticipant = conversation.conversation_participants.find(
      p => p.user_id !== user?.id
    );
    
    return otherParticipant?.profiles?.full_name || 'Unknown User';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    const otherParticipant = conversation.conversation_participants.find(
      p => p.user_id !== user?.id
    );
    
    return otherParticipant?.profiles?.avatar_url;
  };

  const handleConversationClick = (conversationId: string) => {
    // Navigate to conversation - you can implement this based on your routing setup
    console.log('Opening conversation:', conversationId);
    toast.info('Conversation navigation not implemented yet');
  };

  const handleNewConversation = () => {
    toast.info('New conversation feature not implemented yet');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Button onClick={handleNewConversation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredConversations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-4">
              Start a new conversation to connect with other users
            </p>
            <Button onClick={handleNewConversation}>
              <Plus className="h-4 w-4 mr-2" />
              Start Chatting
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredConversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => handleConversationClick(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {getConversationAvatar(conversation) ? (
                      <img
                        src={getConversationAvatar(conversation)!}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        {conversation.is_group_chat ? (
                          <Users className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <MessageCircle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">
                        {getConversationDisplayName(conversation)}
                      </h3>
                      {conversation.last_message_at && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground">
                        {conversation.is_group_chat ? (
                          `${conversation.conversation_participants.length} participants`
                        ) : (
                          'Direct message'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
