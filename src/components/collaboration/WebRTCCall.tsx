
import { useWebRTC } from '@/hooks/useWebRTC';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Users,
  Settings
} from 'lucide-react';

interface WebRTCCallProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebRTCCall = ({ isOpen, onClose }: WebRTCCallProps) => {
  const {
    localStream,
    remoteStream,
    isCallActive,
    isConnecting,
    isAudioEnabled,
    isVideoEnabled,
    error,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    localVideoRef,
    remoteVideoRef
  } = useWebRTC();

  const handleStartAudioCall = () => {
    startCall(true);
  };

  const handleStartVideoCall = () => {
    startCall(false);
  };

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed top-4 right-4 w-96 z-50 bg-card/95 backdrop-blur-sm border-primary/20">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium">Live Session</span>
            </div>
            <div className="flex items-center space-x-2">
              {isCallActive && (
                <Badge variant="default" className="bg-green-500/20 text-green-400">
                  Connected
                </Badge>
              )}
              {isConnecting && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                  Connecting...
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Video Area */}
          <div className="space-y-2">
            {/* Remote Video */}
            {remoteStream && (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Remote
                </div>
              </div>
            )}

            {/* Local Video */}
            {localStream && (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  You
                </div>
              </div>
            )}

            {/* No Video Placeholder */}
            {!localStream && !remoteStream && (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No active video streams</p>
                </div>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-2">
            {!isCallActive && !isConnecting && (
              <>
                <Button onClick={handleStartAudioCall} size="sm" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Audio Call
                </Button>
                <Button onClick={handleStartVideoCall} size="sm" className="flex-1">
                  <Video className="w-4 h-4 mr-2" />
                  Video Call
                </Button>
              </>
            )}

            {(isCallActive || isConnecting) && (
              <>
                <Button
                  onClick={toggleAudio}
                  variant={isAudioEnabled ? "default" : "destructive"}
                  size="sm"
                >
                  {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={toggleVideo}
                  variant={isVideoEnabled ? "default" : "destructive"}
                  size="sm"
                >
                  {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button onClick={handleEndCall} variant="destructive" size="sm">
                  <PhoneOff className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebRTCCall;
