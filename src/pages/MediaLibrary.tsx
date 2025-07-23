
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Search, 
  Grid3X3, 
  List, 
  Music, 
  Video, 
  Play,
  MoreVertical,
  Folder,
  Clock,
  HardDrive
} from 'lucide-react';
import { SoundVibeMediaUpload } from '@/components/media/SoundVibeMediaUpload';
import { CulturalMediaPlayer } from '@/components/media/CulturalMediaPlayer';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useModal } from '@/hooks/useModal';
import { FileUploadModal } from '@/components/modals/FileUploadModal';
import { cn } from '@/lib/utils';

const MediaLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'audio' | 'video'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  const { uploads, isLoading, fetchUploads, deleteUpload } = useMediaUpload();
  const uploadModal = useModal();

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = upload.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'audio' && upload.mime_type.startsWith('audio/')) ||
      (selectedFilter === 'video' && upload.mime_type.startsWith('video/'));
    
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getFileIcon = (mimeType: string) => {
    return mimeType.startsWith('audio/') ? 
      <Music className="w-5 h-5 text-saffron" /> : 
      <Video className="w-5 h-5 text-saffron" />;
  };

  const totalSize = uploads.reduce((sum, upload) => sum + upload.file_size, 0);
  const audioFiles = uploads.filter(upload => upload.mime_type.startsWith('audio/')).length;
  const videoFiles = uploads.filter(upload => upload.mime_type.startsWith('video/')).length;

  const handleFileUpload = async (file: File, metadata: any) => {
    // The SoundVibeMediaUpload component handles the actual upload
    // This is just for the modal integration
    console.log('File uploaded:', file.name, metadata);
    fetchUploads(); // Refresh the list
  };

  const handleDeleteFile = async (id: string, filePath: string) => {
    await deleteUpload(id, filePath);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your audio and video files with cultural aesthetics
          </p>
        </div>
        
        <Button 
          onClick={uploadModal.openModal}
          className="bg-saffron text-white hover:bg-saffron/90"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5 text-saffron" />
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{uploads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Music className="w-5 h-5 text-saffron" />
              <div>
                <p className="text-sm text-muted-foreground">Audio Files</p>
                <p className="text-2xl font-bold">{audioFiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-saffron" />
              <div>
                <p className="text-sm text-muted-foreground">Video Files</p>
                <p className="text-2xl font-bold">{videoFiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-saffron" />
              <div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-saffron" />
            <span>Upload New Media</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SoundVibeMediaUpload
            onUploadComplete={() => fetchUploads()}
            maxFileSize={50}
            maxFiles={10}
          />
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
            >
              All
            </Button>
            <Button
              variant={selectedFilter === 'audio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('audio')}
            >
              Audio
            </Button>
            <Button
              variant={selectedFilter === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('video')}
            >
              Video
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Files Display */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-saffron border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your media files...</p>
        </div>
      ) : filteredUploads.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No media files found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search or filters' : 'Upload your first media file to get started'}
          </p>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
            : "space-y-3"
        )}>
          {filteredUploads.map((upload) => (
            <Card key={upload.id} className="group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                {viewMode === 'grid' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(upload.mime_type)}
                        <Badge variant="secondary" className="text-xs">
                          {upload.mime_type.split('/')[0]}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteFile(upload.id, upload.file_path)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div>
                      <h4 className="font-medium truncate" title={upload.file_name}>
                        {upload.file_name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(upload.file_size)}
                      </p>
                    </div>
                    
                    {upload.mime_type.startsWith('audio/') && (
                      <div className="h-12 bg-gradient-to-r from-saffron/10 to-saffron/5 rounded flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(upload.id)}
                          className="text-saffron hover:text-saffron/80"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(upload.created_at).toLocaleDateString()}
                      </span>
                      <Badge 
                        variant={upload.upload_status === 'success' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {upload.upload_status}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(upload.mime_type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{upload.file_name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(upload.file_size)}</span>
                          <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                          <Badge variant="secondary" className="text-xs">
                            {upload.mime_type.split('/')[0]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {upload.mime_type.startsWith('audio/') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(upload.id)}
                          className="text-saffron hover:text-saffron/80"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteFile(upload.id, upload.file_path)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Media Player */}
      {selectedFile && (
        <div className="fixed bottom-4 right-4 w-80 z-50">
          <CulturalMediaPlayer
            src={uploads.find(u => u.id === selectedFile)?.file_path || ''}
            title={uploads.find(u => u.id === selectedFile)?.file_name || ''}
            waveformData={uploads.find(u => u.id === selectedFile)?.waveform_data || undefined}
            onShare={() => console.log('Share clicked')}
            onDownload={() => window.open(uploads.find(u => u.id === selectedFile)?.file_path, '_blank')}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFile(null)}
            className="absolute top-2 right-2"
          >
            ×
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={uploadModal.isOpen}
        onClose={uploadModal.closeModal}
        onUpload={handleFileUpload}
        acceptedTypes="audio/*,video/*"
        maxSize={50}
        title="Upload Media File"
      />
    </div>
  );
};

export default MediaLibrary;
