
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Headphones, 
  Download, 
  Settings,
  Radio,
  Users,
  Eye
} from 'lucide-react';

interface AudioMixerPanelProps {
  projectId: string;
}

interface Track {
  id: string;
  name: string;
  artist: string;
  type: 'vocal' | 'instrument' | 'percussion' | 'effect';
  volume: number;
  isMuted: boolean;
  isSolo: boolean;
  isPlaying: boolean;
  waveform: number[];
  collaboratorId: string;
  collaboratorName: string;
  lastEdited: string;
}

const AudioMixerPanel = ({ projectId }: AudioMixerPanelProps) => {
  console.log('AudioMixerPanel loaded for project:', projectId);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState([75]);
  const [playhead] = useState(0);
  
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      name: 'Lead Vocal',
      artist: 'Jasbir Singh',
      type: 'vocal',
      volume: 80,
      isMuted: false,
      isSolo: false,
      isPlaying: true,
      waveform: [0.2, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.3, 0.8, 0.5],
      collaboratorId: '1',
      collaboratorName: 'Jasbir Singh',
      lastEdited: '2 min ago'
    },
    {
      id: '2',
      name: 'Harmonium',
      artist: 'Priya Sharma',
      type: 'instrument',
      volume: 65,
      isMuted: false,
      isSolo: false,
      isPlaying: true,
      waveform: [0.3, 0.4, 0.6, 0.5, 0.7, 0.6, 0.5, 0.8, 0.4, 0.6],
      collaboratorId: '2',
      collaboratorName: 'Priya Sharma',
      lastEdited: '15 min ago'
    },
    {
      id: '3',
      name: 'Tabla',
      artist: 'Amit Kumar',
      type: 'percussion',
      volume: 70,
      isMuted: false,
      isSolo: false,
      isPlaying: true,
      waveform: [0.4, 0.7, 0.3, 0.8, 0.5, 0.9, 0.2, 0.6, 0.7, 0.4],
      collaboratorId: '3',
      collaboratorName: 'Amit Kumar',
      lastEdited: '1 hour ago'
    },
    {
      id: '4',
      name: 'Reverb Bus',
      artist: 'Sonia Patel',
      type: 'effect',
      volume: 45,
      isMuted: false,
      isSolo: false,
      isPlaying: false,
      waveform: [0.1, 0.2, 0.3, 0.2, 0.4, 0.3, 0.2, 0.5, 0.1, 0.3],
      collaboratorId: '4',
      collaboratorName: 'Sonia Patel',
      lastEdited: '3 hours ago'
    }
  ]);

  const [collaboratorCursors] = useState([
    { id: '2', name: 'Priya Sharma', position: 45, color: 'bg-blue-400' },
    { id: '3', name: 'Amit Kumar', position: 32, color: 'bg-green-400' }
  ]);

  const getTrackTypeColor = (type: string) => {
    switch (type) {
      case 'vocal': return 'text-purple-400 bg-purple-400/20';
      case 'instrument': return 'text-blue-400 bg-blue-400/20';
      case 'percussion': return 'text-orange-400 bg-orange-400/20';
      case 'effect': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setTracks(prev => 
      prev.map(track => ({ ...track, isPlaying: !isPlaying }))
    );
  };

  const updateTrackVolume = (trackId: string, volume: number) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId ? { ...track, volume } : track
      )
    );
  };

  const toggleMute = (trackId: string) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId ? { ...track, isMuted: !track.isMuted } : track
      )
    );
  };

  const toggleSolo = (trackId: string) => {
    setTracks(prev =>
      prev.map(track =>
        track.id === trackId ? { ...track, isSolo: !track.isSolo } : track
      )
    );
  };

  const WaveformVisualization = ({ waveform, isPlaying }: { waveform: number[], isPlaying: boolean }) => (
    <div className="relative flex items-end space-x-1 h-16 bg-muted/30 rounded p-2">
      {waveform.map((height, index) => (
        <div
          key={index}
          className={`w-2 transition-all duration-300 ${
            isPlaying ? 'bg-primary animate-pulse' : 'bg-muted-foreground/50'
          }`}
          style={{ height: `${height * 80}%` }}
        />
      ))}
      
      {/* Playhead */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 transition-all"
        style={{ left: `${playhead}%` }}
      />
      
      {/* Collaborative Cursors */}
      {collaboratorCursors
        .filter(() => Math.random() > 0.5) // Simulate some cursors on this track
        .map((collaboratorCursor) => (
          <div
            key={collaboratorCursor.id}
            className={`absolute top-0 bottom-0 w-0.5 ${collaboratorCursor.color} opacity-70`}
            style={{ left: `${collaboratorCursor.position}%` }}
          >
            <div className={`absolute -top-6 -left-2 px-1 py-0.5 text-xs text-white rounded ${collaboratorCursor.color} text-nowrap`}>
              {collaboratorCursor.name}
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="h-full space-y-6">
      {/* Transport Controls */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={togglePlay}>
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <Square className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono">02:35</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm font-mono text-muted-foreground">03:42</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <div className="w-24">
                  <Slider
                    value={masterVolume}
                    onValueChange={setMasterVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <span className="text-sm font-mono w-8">{masterVolume[0]}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Active Collaborators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Live Collaboration</span>
            <Badge variant="secondary" className="text-xs">
              {collaboratorCursors.length + 1} editing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm">You</span>
            </div>
            {collaboratorCursors.map((collaboratorCursor) => (
              <div key={collaboratorCursor.id} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${collaboratorCursor.color}`} />
                <span className="text-sm">{collaboratorCursor.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Track Mixer */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Audio Tracks</h3>
        
        {tracks.map((track) => (
          <Card key={track.id} className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Track Info */}
                <div className="col-span-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {track.collaboratorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{track.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`text-xs ${getTrackTypeColor(track.type)}`}>
                          {track.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{track.lastEdited}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Waveform */}
                <div className="col-span-5">
                  <WaveformVisualization
                    waveform={track.waveform}
                    isPlaying={track.isPlaying}
                  />
                </div>

                {/* Controls */}
                <div className="col-span-4 flex items-center space-x-3">
                  {/* Volume */}
                  <div className="flex items-center space-x-2 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMute(track.id)}
                      className={track.isMuted ? 'text-red-400' : ''}
                    >
                      {track.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    <div className="flex-1">
                      <Slider
                        value={[track.volume]}
                        onValueChange={(value) => updateTrackVolume(track.id, value[0])}
                        max={100}
                        step={1}
                        className="w-full"
                        disabled={track.isMuted}
                      />
                    </div>
                    
                    <span className="text-xs font-mono w-8">{track.volume}</span>
                  </div>

                  {/* Solo */}
                  <Button
                    variant={track.isSolo ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSolo(track.id)}
                  >
                    <Headphones className="w-4 h-4" />
                  </Button>

                  {/* Live indicator */}
                  {track.isPlaying && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <Eye className="w-3 h-3 text-green-400" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Options */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export & Bounce</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Radio className="w-4 h-4 mr-2" />
              Bounce Mix
            </Button>
            <Button variant="outline">
              Export Stems
            </Button>
            <Button variant="outline">
              Save Project
            </Button>
            <div className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Last saved: 2 minutes ago
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioMixerPanel;
