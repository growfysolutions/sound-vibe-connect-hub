
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Upload, 
  Play, 
  Pause, 
  Download, 
  FileAudio, 
  Clock, 
  MessageCircle, 
  MoreVertical,
  History
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FilesTabProps {
  projectId: string;
}

const FilesTab = ({ projectId }: FilesTabProps) => {
  console.log('FilesTab loaded for project:', projectId);
  
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: '1',
      name: 'Main_Vocal_Take_v3.wav',
      size: '24.5 MB',
      duration: '3:42',
      uploadedBy: 'Jasbir Singh',
      uploadedAt: '2 hours ago',
      comments: 3,
      isPlaying: false,
      waveform: [0.2, 0.4, 0.8, 0.6, 0.9, 0.3, 0.7, 0.5, 0.8, 0.4]
    },
    {
      id: '2', 
      name: 'Harmonium_Layer.wav',
      size: '18.2 MB',
      duration: '3:45',
      uploadedBy: 'Priya Sharma',
      uploadedAt: '4 hours ago',
      comments: 1,
      isPlaying: false,
      waveform: [0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.9, 0.3, 0.6]
    },
    {
      id: '3',
      name: 'Tabla_Rhythm_Final.wav', 
      size: '15.8 MB',
      duration: '3:40',
      uploadedBy: 'Amit Kumar',
      uploadedAt: '1 day ago',
      comments: 5,
      isPlaying: false,
      waveform: [0.4, 0.7, 0.5, 0.8, 0.3, 0.9, 0.4, 0.6, 0.7, 0.5]
    }
  ]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file upload logic here
    console.log('Files dropped:', acceptedFiles);
    
    // Add files to state (mock implementation)
    const newFiles = acceptedFiles.map((file, index) => ({
      id: `${Date.now()}_${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      duration: '0:00',
      uploadedBy: 'You',
      uploadedAt: 'Just now',
      comments: 0,
      isPlaying: false,
      waveform: Array.from({ length: 10 }, () => Math.random())
    }));

    setUploadedFiles(prev => [...newFiles, ...prev]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.aiff', '.flac', '.m4a']
    },
    multiple: true
  });

  const togglePlay = (fileId: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, isPlaying: !file.isPlaying }
          : { ...file, isPlaying: false }
      )
    );
  };

  const WaveformVisualization = ({ waveform, isPlaying }: { waveform: number[], isPlaying: boolean }) => (
    <div className="flex items-end space-x-1 h-8">
      {waveform.map((height, index) => (
        <div
          key={index}
          className={`w-1 transition-all duration-300 ${
            isPlaying ? 'bg-primary animate-pulse' : 'bg-muted-foreground/50'
          }`}
          style={{ height: `${height * 100}%` }}
        />
      ))}
    </div>
  );

  return (
    <div className="h-full space-y-6">
      {/* Upload Zone */}
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardContent 
          {...getRootProps()}
          className={`p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : ''
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive ? 'Drop files here' : 'Upload Audio Files'}
          </h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop your audio files or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supports: MP3, WAV, AIFF, FLAC, M4A (Max 100MB per file)
          </p>
          <Button className="mt-4">
            Browse Files
          </Button>
        </CardContent>
      </Card>

      {/* File List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Project Files</h3>
          <Badge variant="secondary" className="text-xs">
            {uploadedFiles.length} files
          </Badge>
        </div>

        {uploadedFiles.map((file) => (
          <Card key={file.id} className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Play Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePlay(file.id)}
                    className="shrink-0"
                  >
                    {file.isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <FileAudio className="w-4 h-4 text-primary shrink-0" />
                      <h4 className="font-medium truncate">{file.name}</h4>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{file.size}</span>
                      <span>{file.duration}</span>
                      <div className="flex items-center space-x-1">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-xs bg-primary/20">
                            {file.uploadedBy.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{file.uploadedBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{file.uploadedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Waveform */}
                  <div className="hidden md:block w-32">
                    <WaveformVisualization 
                      waveform={file.waveform} 
                      isPlaying={file.isPlaying} 
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {file.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <History className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FilesTab;
