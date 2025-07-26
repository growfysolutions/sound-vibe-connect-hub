import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  Trash2, 
  FileAudio, 
  FileVideo, 
  FileImage, 
  File,
  Search,
  Filter
} from 'lucide-react';
import { useProjectFiles } from '@/hooks/useProjectFiles';

interface FilesTabProps {
  projectId: number;
}

const FilesTab: React.FC<FilesTabProps> = ({ projectId }) => {
  const { files, isLoading, uploadFile, deleteFile, getFileUrl } = useProjectFiles(projectId);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    for (let i = 0; i < uploadedFiles.length; i++) {
      await uploadFile(uploadedFiles[i]);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const url = await getFileUrl(filePath);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'audio': return <FileAudio className="w-6 h-6" />;
      case 'video': return <FileVideo className="w-6 h-6" />;
      case 'image': return <FileImage className="w-6 h-6" />;
      default: return <File className="w-6 h-6" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file =>
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Project Files</h3>
          <p className="text-sm text-white/60">{files.length} files uploaded</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost" 
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          
          <label htmlFor="file-upload">
            <Button 
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
        />
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-teal-400">
                    {getFileIcon(file.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm text-white truncate">
                      {file.file_name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className="bg-white/10 text-white/80 text-xs"
                      >
                        {file.file_type}
                      </Badge>
                      <span className="text-xs text-white/60">
                        {formatFileSize(file.file_size)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/60">
                  {file.duration && `${Math.floor(file.duration / 60)}:${(file.duration % 60).toString().padStart(2, '0')}`}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(file.file_path, file.file_name)}
                    className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteFile(file.id, file.file_path)}
                    className="text-red-400/60 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">No files found</h4>
          <p className="text-white/60 mb-4">
            {searchTerm ? 'No files match your search criteria.' : 'Upload your first file to get started.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FilesTab;
