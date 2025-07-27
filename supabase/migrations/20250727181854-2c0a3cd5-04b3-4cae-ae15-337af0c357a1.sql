
-- Add INSERT policy for media-uploads bucket to allow users to upload files to their own folders
INSERT INTO storage.policies (id, bucket_id, command, name, definition, check_expression)
VALUES (
  'media-uploads-insert-policy',
  'media-uploads',
  'INSERT',
  'Users can upload files to their own folder',
  '(auth.uid()::text = (storage.foldername(name))[1])',
  '(auth.uid()::text = (storage.foldername(name))[1])'
);

-- Also add SELECT policy to allow users to view files in their own folders
INSERT INTO storage.policies (id, bucket_id, command, name, definition, check_expression)
VALUES (
  'media-uploads-select-policy',
  'media-uploads',
  'SELECT',
  'Users can view files in their own folder',
  '(auth.uid()::text = (storage.foldername(name))[1])',
  NULL
);

-- Add UPDATE policy for users to update their own files
INSERT INTO storage.policies (id, bucket_id, command, name, definition, check_expression)
VALUES (
  'media-uploads-update-policy',
  'media-uploads',
  'UPDATE',
  'Users can update files in their own folder',
  '(auth.uid()::text = (storage.foldername(name))[1])',
  '(auth.uid()::text = (storage.foldername(name))[1])'
);

-- Add DELETE policy for users to delete their own files
INSERT INTO storage.policies (id, bucket_id, command, name, definition, check_expression)
VALUES (
  'media-uploads-delete-policy',
  'media-uploads',
  'DELETE',
  'Users can delete files in their own folder',
  '(auth.uid()::text = (storage.foldername(name))[1])',
  NULL
);
