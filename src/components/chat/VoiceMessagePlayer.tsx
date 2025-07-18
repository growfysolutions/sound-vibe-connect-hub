import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Volume2, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VoiceMessagePlayerProps {
  filePath: string;
  duration?: number;
  className?: string;
}

export function VoiceMessagePlayer({ filePath, duration = 0, className }: VoiceMessagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadAudio = async () => {
      if (!audioUrl) {
        setIsLoading(true);
        try {
          const { data } = await supabase.storage
            .from('chat_attachments')
            .createSignedUrl(filePath, 3600); // 1 hour expiry
          
          if (data?.signedUrl) {
            setAudioUrl(data.signedUrl);
          }
        } catch (error) {
          console.error('Error loading audio:', error);
          toast.error('Failed to load voice message');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAudio();
  }, [filePath, audioUrl]);

  useEffect(() => {
    if (audioUrl && !audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setAudioDuration(Math.floor(audioRef.current.duration));
        }
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(Math.floor(audioRef.current.currentTime));
        }
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('timeupdate', () => {});
        audioRef.current.removeEventListener('ended', () => {});
      }
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current || isLoading) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Failed to play voice message');
      });
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && audioDuration > 0) {
      const seekTime = (value[0] / 100) * audioDuration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const downloadAudio = async () => {
    if (audioUrl) {
      try {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `voice_message_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        toast.success('Voice message downloaded');
      } catch (error) {
        console.error('Error downloading audio:', error);
        toast.error('Failed to download voice message');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg max-w-xs ${className}`}>
      <Button
        size="sm"
        variant="ghost"
        onClick={togglePlayPause}
        disabled={isLoading || !audioUrl}
        className="h-8 w-8 p-0 shrink-0"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Volume2 className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(audioDuration)}
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-1 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const percentage = (x / width) * 100;
            handleSeek([percentage]);
          }}
        />
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={downloadAudio}
        disabled={!audioUrl}
        className="h-8 w-8 p-0 shrink-0"
        title="Download voice message"
      >
        <Download className="w-3 h-3" />
      </Button>
    </div>
  );
}