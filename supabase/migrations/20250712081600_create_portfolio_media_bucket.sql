-- Create a new bucket for portfolio media, and make it public.
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio_media', 'portfolio_media', true);

-- Set up RLS policies for the portfolio_media bucket.

-- 1. Allow public read access to all files in the bucket.
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio_media');

-- 2. Allow authenticated users to upload files.
-- We will restrict uploads to a user-specific folder path in the client-side code.
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio_media');

-- 3. Allow users to update their own files.
-- The policy checks if the user's ID matches the folder name in the file path.
CREATE POLICY "Allow users to update their own files" ON storage.objects
FOR UPDATE USING (auth.uid() = (storage.foldername(name))[1]::uuid);

-- 4. Allow users to delete their own files.
-- The policy checks if the user's ID matches the folder name in the file path.
CREATE POLICY "Allow users to delete their own files" ON storage.objects
FOR DELETE USING (auth.uid() = (storage.foldername(name))[1]::uuid);