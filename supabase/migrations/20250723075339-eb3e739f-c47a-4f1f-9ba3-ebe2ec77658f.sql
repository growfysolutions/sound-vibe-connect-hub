
-- Add media_type column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS media_type VARCHAR(50) DEFAULT 'text';

-- Add media_url column as well since it's referenced in the code
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS media_url TEXT;

-- Update existing posts to have default media_type
UPDATE posts 
SET media_type = 'text' 
WHERE media_type IS NULL;

-- Add check constraint for valid media types
ALTER TABLE posts 
ADD CONSTRAINT posts_media_type_check 
CHECK (media_type IN ('text', 'image', 'video', 'audio', 'link'));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_posts_media_type ON posts(media_type);
