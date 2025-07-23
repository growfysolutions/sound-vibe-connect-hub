
import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Music, Video, Play, Pause, Download, Trash2, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface MediaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  duration?: number;
  uploadProgress: number;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
  file: File;
  url?: string;
  waveformData?: number[];
}

interface SoundVibeMediaUploadProps {
  onUploadComplete?: (files: MediaFile[]) => void;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  acceptedTypes?: string[];
  className?: string;
}

const SUPPORTED_FORMATS = [
  'audio/mpeg',
  'audio/wav',
  'audio/flac',
  'audio/aac',
  'audio/m4a',
  'video/mp4',
  'video/quicktime',
  'video/webm'
];

const DEFAULT_MAX_SIZE = 50; // MB
const DEFAULT_MAX_FILES = 10;

export const SoundVibeMediaUpload: React.FC<SoundVibeMediaUploadProps> = ({
  onUploadComplete,
  maxFileSize = DEFAULT_MAX_SIZE,
  maxFiles = DEFAULT_MAX_FILES,
  acceptedTypes = SUPPORTED_FORMATS,
  className
}) => {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [playingFile, setPlayingFile] = useState<string | null>(null);

  // Generate mock waveform data
  const generateWaveform = useCallback(() => {
    return Array.from({ length: 50 }, () => Math.random() * 0.8 + 0.2);
  }, []);

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const uploadToSupabase = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('media-uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media-uploads')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const saveToDatabase = async (file: File, url: string, waveformData?: number[]) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('media_uploads')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_path: url,
        file_size: file.size,
        mime_type: file.type,
        waveform_data: waveformData || null,
        upload_status: 'success',
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      });

    if (error) throw error;
  };

  const handleFileUpload = async (mediaFile: MediaFile) => {
    try {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === mediaFile.id 
            ? { ...f, uploadStatus: 'uploading', uploadProgress: 0 }
            : f
        )
      );

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === mediaFile.id 
              ? { ...f, uploadProgress: Math.min(f.uploadProgress + 10, 90) }
              : f
          )
        );
      }, 200);

      const url = await uploadToSupabase(mediaFile.file);
      const waveformData = mediaFile.type.startsWith('audio/') ? generateWaveform() : undefined;
      
      await saveToDatabase(mediaFile.file, url, waveformData);

      clearInterval(progressInterval);

      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === mediaFile.id 
            ? { 
                ...f, 
                uploadStatus: 'success', 
                uploadProgress: 100, 
                url,
                waveformData 
              }
            : f
        )
      );

      toast.success(`${mediaFile.name} uploaded successfully!`);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === mediaFile.id 
            ? { ...f, uploadStatus: 'error', uploadProgress: 0 }
            : f
        )
      );
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: MediaFile[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      uploadStatus: 'pending',
      file,
      waveformData: file.type.startsWith('audio/') ? generateWaveform() : undefined
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Start uploading files
    setIsUploading(true);
    newFiles.forEach(handleFileUpload);
    
    setTimeout(() => setIsUploading(false), 1000);
  }, [uploadedFiles.length, maxFiles, generateWaveform]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize * 1024 * 1024,
    multiple: true
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryUpload = (id: string) => {
    const file = uploadedFiles.find(f => f.id === id);
    if (file) {
      handleFileUpload(file);
    }
  };

  const togglePlayback = (fileId: string, url?: string) => {
    if (!url) return;

    if (playingFile === fileId) {
      audioRefs.current[fileId]?.pause();
      setPlayingFile(null);
    } else {
      // Pause other playing files
      Object.values(audioRefs.current).forEach(audio => audio.pause());
      
      if (!audioRefs.current[fileId]) {
        audioRefs.current[fileId] = new Audio(url);
        audioRefs.current[fileId].onended = () => setPlayingFile(null);
      }
      
      audioRefs.current[fileId].play();
      setPlayingFile(fileId);
    }
  };

  const WaveformVisualization = ({ waveform, isPlaying }: { waveform: number[], isPlaying: boolean }) => (
    <div className="flex items-end space-x-0.5 h-12 w-full">
      {waveform.map((height, index) => (
        <div
          key={index}
          className={cn(
            "w-1 transition-all duration-300 rounded-t-sm",
            isPlaying 
              ? "bg-gradient-to-t from-saffron to-saffron/60 animate-pulse" 
              : "bg-gradient-to-t from-saffron/40 to-saffron/20"
          )}
          style={{ height: `${height * 100}%` }}
        />
      ))}
    </div>
  );

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Upload Drop Zone */}
      <Card className="border-2 border-dashed border-saffron/30 bg-gradient-to-br from-saffron/5 to-primary/5 hover:border-saffron/50 transition-all">
        <CardContent 
          {...getRootProps()}
          className={cn(
            "p-8 text-center cursor-pointer transition-all duration-300",
            isDragActive && "border-saffron bg-saffron/10 scale-105"
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff6b35' fill-opacity='0.03'%3E%3Cpath d='M20 0l10 10-10 10-10-10z'/%3E%3Cpath d='M0 20l10 10-10 10-10-10z'/%3E%3Cpath d='M20 20l10 10-10 10-10-10z'/%3E%3Cpath d='M40 20l10 10-10 10-10-10z' transform='translate(-20,0)'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="relative">
              <Upload className="w-16 h-16 mx-auto text-saffron animate-bounce" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-saffron/20 rounded-full flex items-center justify-center">
                <Music className="w-4 h-4 text-saffron" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {isDragActive ? "Release to upload your tracks" : "Drop your music files here"}
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse your device
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground max-w-md mx-auto">
              <div className="space-y-1">
                <p><strong>Supported:</strong> MP3, WAV, FLAC, AAC, M4A, MP4</p>
                <p><strong>Max size:</strong> {maxFileSize}MB per file</p>
              </div>
              <div className="space-y-1">
                <p><strong>Batch upload:</strong> Up to {maxFiles} files</p>
                <p><strong>Auto-optimize:</strong> Web playback ready</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="mt-4 border-saffron/30 text-saffron hover:bg-saffron/10"
              type="button"
            >
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      {uploadedFiles.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Your Media Files</h3>
            <Badge variant="secondary">{uploadedFiles.length}/{maxFiles}</Badge>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      )}

      {/* File Display */}
      {uploadedFiles.length > 0 && (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-3"
        )}>
          {uploadedFiles.map((file) => (
            <Card key={file.id} className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all">
              <CardContent className="p-4">
                {viewMode === 'grid' ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {file.type.startsWith('audio/') ? (
                        <Music className="w-5 h-5 text-saffron" />
                      ) : (
                        <Video className="w-5 h-5 text-saffron" />
                      )}
                      <h4 className="font-medium truncate flex-1">{file.name}</h4>
                    </div>
                    
                    {file.waveformData && (
                      <WaveformVisualization 
                        waveform={file.waveformData} 
                        isPlaying={playingFile === file.id}
                      />
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      {file.duration && <span>{formatDuration(file.duration)}</span>}
                    </div>
                    
                    {file.uploadStatus === 'uploading' && (
                      <div className="space-y-2">
                        <Progress value={file.uploadProgress} className="w-full" />
                        <p className="text-xs text-center text-muted-foreground">
                          Uploading... {file.uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      {file.uploadStatus === 'success' && file.url && file.type.startsWith('audio/') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePlayback(file.id, file.url)}
                        >
                          {playingFile === file.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      )}
                      
                      {file.uploadStatus === 'success' && file.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {file.uploadStatus === 'error' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => retryUpload(file.id)}
                        >
                          <AlertCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 flex-1">
                      {file.type.startsWith('audio/') ? (
                        <Music className="w-5 h-5 text-saffron" />
                      ) : (
                        <Video className="w-5 h-5 text-saffron" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{file.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          {file.duration && <span>{formatDuration(file.duration)}</span>}
                          <span>Uploaded {new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {file.uploadStatus === 'uploading' && (
                      <div className="w-24">
                        <Progress value={file.uploadProgress} className="w-full" />
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      {file.uploadStatus === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {file.uploadStatus === 'error' && (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
