import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Scissors,
  Copy,
  Undo,
  Redo,
  Zap
} from 'lucide-react';

interface AdvancedMediaPlayerProps {
  fileUrl: string;
  fileName: string;
}

const AdvancedMediaPlayer = ({ fileUrl, fileName }: AdvancedMediaPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<{ start: number; end: number } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize audio and generate waveform
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(fileUrl);
      audioRef.current.volume = volume[0] / 100;
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
        generateWaveform();
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [fileUrl, volume]);

  const generateWaveform = async () => {
    // Mock waveform data generation
    // In a real app, you'd use Web Audio API to analyze the audio
    const mockWaveform = Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.2);
    setWaveformData(mockWaveform);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const WaveformCanvas = () => {
    useEffect(() => {
      if (!canvasRef.current || waveformData.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Draw waveform
      const barWidth = width / waveformData.length;
      waveformData.forEach((amplitude, index) => {
        const barHeight = amplitude * height * 0.8;
        const x = index * barWidth;
        const y = (height - barHeight) / 2;

        // Color based on playback position
        const progress = currentTime / duration;
        const isPlayed = index / waveformData.length < progress;
        
        ctx.fillStyle = isPlayed ? '#3b82f6' : '#64748b';
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      });

      // Draw playback position
      const playbackX = (currentTime / duration) * width;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playbackX, 0);
      ctx.lineTo(playbackX, height);
      ctx.stroke();

      // Draw selected region
      if (selectedRegion) {
        const startX = (selectedRegion.start / duration) * width;
        const endX = (selectedRegion.end / duration) * width;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.fillRect(startX, 0, endX - startX, height);
      }
    }, [waveformData, currentTime, duration, selectedRegion]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    };

    const handleRegionSelect = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.shiftKey) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const clickTime = percentage * duration;
        
        if (selectedRegion) {
          setSelectedRegion({
            start: Math.min(selectedRegion.start, clickTime),
            end: Math.max(selectedRegion.start, clickTime)
          });
        } else {
          setSelectedRegion({ start: clickTime, end: clickTime });
        }
      } else {
        handleCanvasClick(e);
      }
    };

    return (
      <canvas
        ref={canvasRef}
        width={800}
        height={100}
        className="w-full h-24 bg-muted rounded cursor-pointer"
        onClick={handleRegionSelect}
      />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="truncate">{fileName}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {formatTime(duration)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Waveform Display */}
        <div className="space-y-2">
          <WaveformCanvas />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Progress Slider */}
        <div className="space-y-2">
          <Slider
            value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-2">
          <Button variant="ghost" size="sm" onClick={skipBackward}>
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button onClick={togglePlay} size="sm">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleStop}>
            <Square className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={skipForward}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={toggleMute}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-8">{volume[0]}</span>
        </div>

        {/* Editing Tools */}
        <div className="flex items-center justify-center space-x-2 pt-2 border-t">
          <Button variant="outline" size="sm" disabled>
            <Scissors className="w-4 h-4 mr-1" />
            Cut
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Undo className="w-4 h-4 mr-1" />
            Undo
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Redo className="w-4 h-4 mr-1" />
            Redo
          </Button>
        </div>

        {selectedRegion && (
          <div className="text-xs text-muted-foreground text-center">
            Selected: {formatTime(selectedRegion.start)} - {formatTime(selectedRegion.end)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedMediaPlayer;
