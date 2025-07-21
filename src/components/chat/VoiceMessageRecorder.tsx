import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send, Trash2, Play, Pause, Square } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceMessageRecorderProps {
  onSendVoiceMessage: (audioBlob: Blob, duration: number) => void;
  disabled?: boolean;
}

export function VoiceMessageRecorder({ onSendVoiceMessage, disabled }: VoiceMessageRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Unable to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.success('Recording stopped');
    }
  };

  const playAudio = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setAudioBlob(null);
    setDuration(0);
    setIsPlaying(false);
  };

  const sendVoiceMessage = () => {
    if (audioBlob) {
      onSendVoiceMessage(audioBlob, duration);
      deleteRecording();
      toast.success('Voice message sent!');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If we have a recorded audio blob, show playback controls
  if (audioBlob) {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Button
          size="sm"
          variant="ghost"
          onClick={isPlaying ? pauseAudio : playAudio}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        <div className="flex-1 text-sm text-muted-foreground">
          Voice message • {formatDuration(duration)}
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={deleteRecording}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          onClick={sendVoiceMessage}
          disabled={disabled}
          className="h-8"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // Recording state
  if (isRecording) {
    return (
      <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
        <Button
          size="sm"
          variant="destructive"
          onClick={stopRecording}
          className="h-8 w-8 p-0 animate-pulse"
        >
          <Square className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 flex items-center gap-2">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <span className="text-sm font-medium">Recording • {formatDuration(duration)}</span>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={stopRecording}
          className="h-8"
        >
          Stop
        </Button>
      </div>
    );
  }

  // Default state - record button
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={startRecording}
      disabled={disabled}
      className="h-8 w-8 p-0"
      title="Record voice message"
    >
      <Mic className="w-4 h-4" />
    </Button>
  );
}