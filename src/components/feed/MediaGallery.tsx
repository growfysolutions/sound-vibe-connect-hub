
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MediaGalleryProps {
  mediaUrls: string[];
  mediaType: string;
}

export default function MediaGallery({ mediaUrls, mediaType }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!mediaUrls || mediaUrls.length === 0) return null;

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaUrls.length);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
  };

  const renderMedia = (url: string, index: number) => {
    switch (mediaType) {
      case 'image':
        return (
          <img
            key={index}
            src={url}
            alt={`Media ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        );
      case 'video':
        return (
          <video
            key={index}
            src={url}
            controls
            muted={isMuted}
            className="w-full h-full rounded-lg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        );
      case 'audio':
        return (
          <div key={index} className="flex items-center justify-center h-32 bg-muted rounded-lg">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-primary"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
              <audio
                src={url}
                controls
                className="max-w-xs"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="relative">
        {renderMedia(mediaUrls[currentIndex], currentIndex)}
        
        {/* Navigation for multiple media */}
        {mediaUrls.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevMedia}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMedia}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Media controls for video */}
        {mediaType === 'video' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {/* Media indicators */}
      {mediaUrls.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {mediaUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
