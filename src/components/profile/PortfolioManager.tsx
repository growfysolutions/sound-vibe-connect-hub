import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type PortfolioMedia = Database['public']['Tables']['portfolio_media']['Row'];

interface PortfolioManagerProps {
  profileId: string;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({ profileId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<PortfolioMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const isOwner = user?.id === profileId;

  const fetchMedia = useCallback(async () => {
    const { data, error } = await supabase
      .from('portfolio_media')
      .select('*')
      .eq('user_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Could not fetch portfolio media.', variant: 'destructive' });
    } else {
      setMediaItems(data);
    }
  }, [profileId, toast]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio_media')
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: 'Upload Error', description: uploadError.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('portfolio_media')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase.from('portfolio_media').insert({
      user_id: user.id,
      file_url: publicUrlData.publicUrl,
      file_type: file.type,
      title,
      description,
    });

    if (dbError) {
      toast({ title: 'Database Error', description: dbError.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Media uploaded successfully!' });
      setFile(null);
      setTitle('');
      setDescription('');
      fetchMedia(); // Refresh the list
    }
    setUploading(false);
  };

  const handleDelete = async (itemId: number, fileUrl: string) => {
    // Extract file path from URL
    const filePath = fileUrl.split('/portfolio_media/').pop();
    if (!filePath) {
        toast({ title: 'Error', description: 'Invalid file path.', variant: 'destructive' });
        return;
    }

    // First, delete from storage
    const { error: storageError } = await supabase.storage
        .from('portfolio_media')
        .remove([filePath]);

    if (storageError) {
        toast({ title: 'Storage Error', description: storageError.message, variant: 'destructive' });
        return;
    }

    // Then, delete from database
    const { error: dbError } = await supabase
        .from('portfolio_media')
        .delete()
        .eq('id', itemId);

    if (dbError) {
        toast({ title: 'Database Error', description: dbError.message, variant: 'destructive' });
    } else {
        toast({ title: 'Success', description: 'Media deleted.' });
        fetchMedia(); // Refresh the list
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isOwner && (
          <form onSubmit={handleUpload} className="p-4 border rounded-lg space-y-4">
            <h3 className="font-medium">Add New Media</h3>
            <Input type="file" onChange={handleFileChange} disabled={uploading} />
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={uploading} />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={uploading} />
            <Button type="submit" disabled={uploading || !file}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </form>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaItems.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              {item.file_type.startsWith('image/') ? (
                <img src={item.file_url} alt={item.title || 'Portfolio item'} className="w-full h-48 object-cover" />
              ) : item.file_type.startsWith('audio/') ? (
                <div className="p-4">
                  <audio controls src={item.file_url} className="w-full" />
                </div>
              ) : (
                <div className="p-4 flex items-center justify-center h-48 bg-gray-100">
                  <p className="text-sm text-gray-500">Unsupported file type</p>
                </div>
              )}
              <div className="p-4">
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {isOwner && (
                  <Button variant="destructive" size="sm" className="mt-2" onClick={() => handleDelete(item.id, item.file_url)}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {mediaItems.length === 0 && <p className="text-muted-foreground">No portfolio items yet.</p>}
      </CardContent>
    </Card>
  );
};

export default PortfolioManager;
