import { useState, useRef } from 'react';
import { Mic, MicOff, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceMessageButtonProps {
  onSendVoiceMessage: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export const VoiceMessageButton: React.FC<VoiceMessageButtonProps> = ({ 
  onSendVoiceMessage, 
  disabled 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      toast.success('Recording stopped');
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioBlob(null);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      toast.info('Recording cancelled');
    } else if (audioBlob) {
      setAudioBlob(null);
      setRecordingTime(0);
      toast.info('Voice message discarded');
    }
  };

  const sendVoiceMessage = () => {
    if (audioBlob) {
      onSendVoiceMessage(audioBlob);
      setAudioBlob(null);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioBlob) {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">
            Voice message ({formatTime(recordingTime)})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={cancelRecording}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button variant="default" size="sm" onClick={sendVoiceMessage}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-600 dark:text-red-400">
            Recording... {formatTime(recordingTime)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={cancelRecording}
          className="text-red-600 hover:text-red-700 dark:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={stopRecording}
        >
          <MicOff className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={startRecording}
      disabled={disabled}
      className="hover:bg-primary/10"
    >
      <Mic className="w-4 h-4" />
    </Button>
  );
};