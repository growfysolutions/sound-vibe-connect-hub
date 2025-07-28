
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Music, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { validateFile, sanitizeFileName } from '@/utils/fileValidation';
import { useSecureUpload } from '@/hooks/useSecureUpload';
import { cn } from '@/lib/utils';

interface CulturalFileUploadProps {
  onFilesChange: (files: File[]) => void;
  acceptedTypes: string[];
  maxFileSize: number;
  maxFiles: number;
  className?: string;
}

export const CulturalFileUpload: React.FC<CulturalFileUploadProps> = ({
  onFilesChange,
  acceptedTypes,
  maxFileSize,
  maxFiles,
  className
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { uploading } = useSecureUpload();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    const newErrors: string[] = [];
    const validFiles: File[] = [];
    
    // Validate each file using our secure validation
    acceptedFiles.forEach((file) => {
      const validation = validateFile(file);
      if (!validation.isValid) {
        newErrors.push(validation.error || `Invalid file: ${file.name}`);
      } else {
        validFiles.push(file);
      }
    });

    // Handle rejected files
    rejectedFiles.forEach((file) => {
      if (file.errors) {
        file.errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            newErrors.push(`File "${file.file.name}" is too large - Max ${maxFileSize / 1024 / 1024}MB`);
          } else if (error.code === 'file-invalid-type') {
            newErrors.push(`File "${file.file.name}" is not a valid file type`);
          }
        });
      }
    });

    // Check total files limit
    if (uploadedFiles.length + validFiles.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`);
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);
    
    if (validFiles.length > 0 && newErrors.length === 0) {
      // Sanitize file names
      const sanitizedFiles = validFiles.map(file => {
        const sanitizedName = sanitizeFileName(file.name);
        return new File([file], sanitizedName, { type: file.type });
      });
      
      const newFiles = [...uploadedFiles, ...sanitizedFiles];
      setUploadedFiles(newFiles);
      onFilesChange(newFiles);
    }
  }, [uploadedFiles, maxFiles, maxFileSize, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize,
    maxFiles: maxFiles - uploadedFiles.length,
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          "bg-gradient-to-br from-saffron/5 to-primary/5",
          isDragActive
            ? "border-saffron bg-saffron/10 transform scale-105"
            : "border-saffron/30 hover:border-saffron/50",
          "relative overflow-hidden"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff6b35' fill-opacity='0.03'%3E%3Cpath d='M20 0l10 10-10 10-10-10z'/%3E%3Cpath d='M0 20l10 10-10 10-10-10z'/%3E%3Cpath d='M20 20l10 10-10 10-10-10z'/%3E%3Cpath d='M40 20l10 10-10 10-10-10z' transform='translate(-20,0)'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-saffron border-t-transparent rounded-full mx-auto" />
            <p className="text-lg font-medium">Uploading your tracks...</p>
            <Progress value={75} className="w-full max-w-xs mx-auto" />
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-saffron mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? "Drop your files here" : "Upload Your Files"}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your files or click to browse
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Allowed file types: {acceptedTypes.join(', ')}</p>
              <p>Max {maxFileSize / 1024 / 1024}MB per file</p>
              <p>Up to {maxFiles} files</p>
            </div>
            <Button variant="outline" className="mt-4" type="button">
              Choose Files
            </Button>
          </>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-saffron/20"
              >
                <Music className="w-5 h-5 text-saffron" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
