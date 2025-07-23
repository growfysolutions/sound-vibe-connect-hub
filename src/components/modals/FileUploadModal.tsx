
import React, { useState, useRef } from 'react';
import { CulturalModal } from './CulturalModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, File, Music, Video, Image } from 'lucide-react';
import { DholLoader } from '@/components/ui/DholLoader';
import { toast } from 'sonner';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, metadata: any) => Promise<void>;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  title?: string;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  acceptedTypes = "audio/*,video/*,image/*",
  maxSize = 100,
  title = "Upload File"
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [metadata, setMetadata] = useState({ title: '', description: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('audio/')) return <Music className="w-8 h-8 text-saffron" />;
    if (file.type.startsWith('video/')) return <Video className="w-8 h-8 text-saffron" />;
    if (file.type.startsWith('image/')) return <Image className="w-8 h-8 text-saffron" />;
    return <File className="w-8 h-8 text-saffron" />;
  };

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }
    setSelectedFile(file);
    setMetadata({ title: file.name.split('.')[0], description: '' });
  };

  const handleDragEvents = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    handleDragEvents(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    handleDragEvents(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDragEvents(e);
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFile, metadata);
      toast.success('File uploaded successfully!');
      onClose();
      setSelectedFile(null);
      setMetadata({ title: '', description: '' });
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <CulturalModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="lg"
      hasUnsavedChanges={!!selectedFile}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging 
              ? 'border-saffron bg-saffron/5 scale-105' 
              : 'border-saffron/30 hover:border-saffron/50'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragEvents}
          onDrop={handleDrop}
          style={{
            backgroundImage: isDragging ? 
              `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Cpath d='M15 0l7.5 7.5L15 15l-7.5-7.5z'/%3E%3Cpath d='M15 15l7.5 7.5L15 30l-7.5-7.5z'/%3E%3C/g%3E%3C/svg%3E")` : 
              'none'
          }}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                {getFileIcon(selectedFile)}
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedFile(null)}
                className="border-saffron/20 text-saffron hover:bg-saffron/5"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-saffron/60" />
              <div>
                <p className="text-lg font-medium text-foreground mb-2">
                  Drop your file here or{' '}
                  <button
                    type="button"
                    className="text-saffron hover:text-saffron/80 underline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-muted-foreground">
                  Maximum file size: {maxSize}MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept={acceptedTypes}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>
          )}
        </div>

        {/* Metadata Form */}
        {selectedFile && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-title" className="text-sm font-medium text-foreground">
                Title
              </Label>
              <Input
                id="file-title"
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                className="focus:ring-saffron focus:border-saffron"
              />
            </div>
            <div>
              <Label htmlFor="file-description" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <Input
                id="file-description"
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                className="focus:ring-saffron focus:border-saffron"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-saffron/20">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
            className="border-saffron/20 text-foreground hover:bg-saffron/5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="bg-saffron text-white hover:bg-saffron/90 focus:ring-saffron focus:ring-opacity-50"
          >
            {isUploading ? (
              <>
                <DholLoader size="sm" className="mr-2" />
                Uploading...
              </>
            ) : (
              'Upload File'
            )}
          </Button>
        </div>
      </form>
    </CulturalModal>
  );
};
