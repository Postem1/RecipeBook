-- Add video_url column to rb_recipes table
ALTER TABLE rb_recipes 
ADD COLUMN IF NOT EXISTS video_url text;

-- Create recipe-videos storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('recipe-videos', 'recipe-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public access to view videos
CREATE POLICY "Public Videos" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'recipe-videos' );

-- Policy: Allow authenticated users to upload videos
CREATE POLICY "Authenticated Users Upload Videos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'recipe-videos' 
  AND auth.role() = 'authenticated'
);

-- Policy: Allow users to update their own videos (optional but good)
-- Assuming we stick to simple insert for now, but update/delete is good practice
CREATE POLICY "Users Update Own Videos" 
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'recipe-videos' 
  AND auth.uid() = owner
);

CREATE POLICY "Users Delete Own Videos" 
ON storage.objects FOR DELETE
USING (
  bucket_id = 'recipe-videos' 
  AND auth.uid() = owner
);
