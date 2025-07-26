
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Play, 
  Pause, 
  Download, 
  FileAudio, 
  Clock, 
  MessageCircle, 
  MoreVertical,
  History,
  Trash2
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useProjectFiles } from '@/hooks/useProjectFiles';
import { useProjectComments } from '@/hooks/useProjectComments';

interface FilesTabProps {
  projectId: number;
}

const FilesTab = ({ projectId }: FilesTabProps) => {
  console.log('FilesTab loaded for project:', projectId);
  
  const { files, isLoading, uploadFile, deleteFile, getFileUrl } = useProjectFiles(projectId);
  const { comments, createComment } = useProjectComments(projectId);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    
    for (const file of acceptedFiles) {
      await uploadFile(file);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.aiff', '.flac', '.m4a']
    },
    multiple: true
  });

  const togglePlay = (fileId: string) => {
    setPlayingId(prev => prev === fileId ? null : fileId);
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    const url = await getFileUrl(filePath);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = async (fileId: string, filePath: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      await deleteFile(fileId, filePath);
    }
  };

  const getFileCommentCount = (fileId: string) => {
    return comments.filter(comment => comment.file_id === fileId).length;
  };

  const WaveformVisualization = ({ isPlaying }: { isPlaying: boolean }) => {
    const waveform = Array.from({ length: 10 }, () => Math.random());
    
    return (
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
  };

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
          <Button className="mt-4" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Browse Files'}
          </Button>
        </CardContent>
      </Card>

      {/* File List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Project Files</h3>
          <Badge variant="secondary" className="text-xs">
            {files.length} files
          </Badge>
        </div>

        {files.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <FileAudio className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No files uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Upload your first audio file to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          files.map((file) => (
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
                      {playingId === file.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <FileAudio className="w-4 h-4 text-primary shrink-0" />
                        <h4 className="font-medium truncate">{file.file_name}</h4>
                        <Badge variant="outline" className="text-xs">
                          v{file.version_number}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{(file.file_size / 1024 / 1024).toFixed(1)} MB</span>
                        {file.duration && (
                          <span>{Math.floor(file.duration / 60)}:{(file.duration % 60).toString().padStart(2, '0')}</span>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(file.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Waveform */}
                    <div className="hidden md:block w-32">
                      <WaveformVisualization isPlaying={playingId === file.id} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {getFileCommentCount(file.id)}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <History className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownload(file.file_path, file.file_name)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(file.id, file.file_path)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FilesTab;
