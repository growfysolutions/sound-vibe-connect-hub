import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Download, File as FileIcon } from 'lucide-react';

interface FileAttachmentProps {
  filePath: string;
  fileMetadata: {
    name: string;
    type: string;
    size: number;
  };
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ filePath, fileMetadata }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const downloadFile = async () => {
      const { data, error } = await supabase.storage
        .from('chat_attachments')
        .createSignedUrl(filePath, 60 * 5); // URL valid for 5 minutes

      if (error) {
        setError('Failed to get file URL.');
        console.error('Error creating signed URL:', error);
      } else {
        setUrl(data.signedUrl);
      }
    };

    if (filePath) {
      downloadFile();
    }
  }, [filePath]);

  if (error) {
    return <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">{error}</div>;
  }

  if (!url) {
    return <div className="p-2">Loading attachment...</div>;
  }

  if (fileMetadata.type.startsWith('image/')) {
    return <img src={url} alt={fileMetadata.name} className="max-w-xs rounded-lg my-2" />;
  }

  if (fileMetadata.type.startsWith('audio/')) {
    return <audio controls src={url} className="w-full max-w-xs my-2" />;
  }

  return (
    <div className="flex items-center gap-3 p-2 my-2 border rounded-lg bg-background/50 max-w-xs">
      <FileIcon className="w-8 h-8 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 overflow-hidden">
        <p className="font-semibold truncate text-sm">{fileMetadata.name}</p>
        <p className="text-xs text-muted-foreground">
          {(fileMetadata.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      <Button asChild variant="ghost" size="icon" className="flex-shrink-0">
        <a href={url} download={fileMetadata.name} target="_blank" rel="noopener noreferrer">
          <Download className="w-5 h-5" />
        </a>
      </Button>
    </div>
  );
};

export default FileAttachment;
