
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CulturalMediaPlayerProps {
  src: string;
  title: string;
  artist?: string;
  waveformData?: number[];
  onShare?: () => void;
  onDownload?: () => void;
  className?: string;
}

export const CulturalMediaPlayer: React.FC<CulturalMediaPlayerProps> = ({
  src,
  title,
  artist,
  waveformData,
  onShare,
  onDownload,
  className
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const WaveformVisualization = () => {
    if (!waveformData) return null;

    const progress = duration > 0 ? currentTime / duration : 0;
    const activeIndex = Math.floor(progress * waveformData.length);

    return (
      <div className="flex items-end space-x-0.5 h-16 w-full px-4">
        {waveformData.map((height, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 transition-all duration-300 rounded-t-sm cursor-pointer",
              index <= activeIndex
                ? "bg-gradient-to-t from-saffron to-saffron/60"
                : "bg-gradient-to-t from-saffron/20 to-saffron/10"
            )}
            style={{ height: `${height * 100}%` }}
            onClick={() => {
              if (duration > 0) {
                const clickProgress = index / waveformData.length;
                const newTime = clickProgress * duration;
                handleSeek([newTime]);
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className={cn("bg-gradient-to-br from-saffron/5 to-primary/5", className)}>
      <CardContent className="p-6">
        <audio ref={audioRef} src={src} />
        
        {/* Track Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-foreground truncate">{title}</h3>
          {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
        </div>

        {/* Waveform or Progress */}
        {waveformData ? (
          <WaveformVisualization />
        ) : (
          <div className="px-4 mb-4">
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>
        )}

        {/* Time Display */}
        <div className="flex justify-between text-xs text-muted-foreground mb-4 px-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSeek([Math.max(0, currentTime - 10)])}
            className="text-saffron hover:text-saffron/80"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-saffron text-white hover:bg-saffron/90"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSeek([Math.min(duration, currentTime + 10)])}
            className="text-saffron hover:text-saffron/80"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 mb-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-saffron hover:text-saffron/80"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-2">
          {onShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="border-saffron/30 text-saffron hover:bg-saffron/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
          
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="border-saffron/30 text-saffron hover:bg-saffron/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
