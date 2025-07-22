
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  FileAudio, 
  Image as ImageIcon,
  AtSign,
  MoreVertical
} from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar: string;
  permission: string;
}

interface ChatTabProps {
  projectId: string;
  collaborators: Collaborator[];
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'voice' | 'mention';
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  isEdited?: boolean;
  mentions?: string[];
}

const ChatTab = ({ projectId, collaborators }: ChatTabProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'Jasbir Singh',
      senderAvatar: '/placeholder.svg',
      content: 'Just uploaded the latest vocal take. What do you all think?',
      timestamp: '2 hours ago',
      type: 'text'
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'Priya Sharma',
      senderAvatar: '/placeholder.svg',
      content: 'Sounds amazing! The emotion in your voice is perfect for this track.',
      timestamp: '2 hours ago',
      type: 'text'
    },
    {
      id: '3',
      senderId: '2',
      senderName: 'Priya Sharma',
      senderAvatar: '/placeholder.svg',
      content: 'Main_Vocal_Take_v3.wav',
      timestamp: '1 hour ago',
      type: 'file',
      fileUrl: '/audio/sample.wav',
      fileName: 'Main_Vocal_Take_v3.wav',
      fileType: 'audio'
    },
    {
      id: '4',
      senderId: '3',
      senderName: 'Amit Kumar',
      senderAvatar: '/placeholder.svg',
      content: '@Jasbir Singh Can we add a slight reverb to the chorus? It might enhance the Sufi feel.',
      timestamp: '45 minutes ago',
      type: 'mention',
      mentions: ['Jasbir Singh']
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: '/placeholder.svg',
      content: newMessage,
      timestamp: 'Just now',
      type: newMessage.includes('@') ? 'mention' : 'text',
      mentions: newMessage.includes('@') ? extractMentions(newMessage) : undefined
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowMentions(false);
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+\s\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // Check for @ mentions
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1 && atIndex === value.length - 1) {
      setShowMentions(true);
      setMentionQuery('');
    } else if (atIndex !== -1) {
      const query = value.slice(atIndex + 1);
      if (query.includes(' ')) {
        setShowMentions(false);
      } else {
        setMentionQuery(query);
        setShowMentions(true);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (collaborator: Collaborator) => {
    const atIndex = newMessage.lastIndexOf('@');
    const beforeAt = newMessage.slice(0, atIndex);
    const newText = `${beforeAt}@${collaborator.name} `;
    setNewMessage(newText);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const filteredCollaborators = collaborators.filter(c => 
    c.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.senderId === 'current-user';

    return (
      <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 max-w-[80%]`}>
          {!isCurrentUser && (
            <Avatar className="w-8 h-8 mt-1">
              <AvatarImage src={message.senderAvatar} alt={message.senderName} />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {message.senderName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}

          <div className={`${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
            {!isCurrentUser && (
              <div className="text-xs text-muted-foreground mb-1">
                {message.senderName}
              </div>
            )}
            
            <div className={`rounded-lg p-3 ${
              isCurrentUser 
                ? 'bg-primary text-primary-foreground' 
                : message.type === 'mention' 
                  ? 'bg-amber-400/20 border border-amber-400/30' 
                  : 'bg-muted'
            }`}>
              {message.type === 'file' ? (
                <div className="flex items-center space-x-2">
                  {message.fileType === 'audio' ? (
                    <FileAudio className="w-4 h-4" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{message.fileName}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
              
              {message.mentions && message.mentions.length > 0 && (
                <div className="mt-1">
                  {message.mentions.map((mention, index) => (
                    <Badge key={index} variant="secondary" className="text-xs mr-1">
                      @{mention}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
              {message.timestamp}
              {message.isEdited && <span className="ml-1">(edited)</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <span>Project Chat</span>
            <Badge variant="secondary" className="text-xs">
              {collaborators.filter(c => c.status === 'online').length} online
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-card/30 rounded-lg backdrop-blur-sm">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* Mentions Dropdown */}
      {showMentions && (
        <Card className="mb-2 border-primary/30">
          <CardContent className="p-2">
            <div className="text-xs text-muted-foreground mb-2">Mention a collaborator:</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {filteredCollaborators.map((collaborator) => (
                <button
                  key={collaborator.id}
                  onClick={() => insertMention(collaborator)}
                  className="w-full flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors text-left"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {collaborator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{collaborator.name}</div>
                    <div className="text-xs text-muted-foreground">{collaborator.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Input */}
      <div className="flex items-center space-x-2 p-4 bg-card/50 rounded-lg backdrop-blur-sm">
        <Button variant="ghost" size="sm">
          <Paperclip className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={toggleRecording}
          className={isRecording ? 'text-red-500' : ''}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
        
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message... Use @ to mention collaborators"
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <AtSign className="w-3 h-3" />
          </Button>
        </div>
        
        <Button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatTab;
