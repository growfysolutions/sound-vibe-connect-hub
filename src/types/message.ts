
import { Profile } from './index';

export interface Message {
  id: string;
  content: string | null;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  updated_at?: string;
  file_path?: string | null;
  file_metadata?: {
    name: string;
    type: string;
    size: number;
    duration?: number;
    isVoiceMessage?: boolean;
  } | null;
  sender: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface SendMessageData {
  content?: string;
  file_path?: string;
  file_metadata?: {
    name: string;
    type: string;
    size: number;
    duration?: number;
    isVoiceMessage?: boolean;
  };
}
