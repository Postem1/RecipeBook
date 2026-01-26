
-- Create the recipe-videos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-videos', 'recipe-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to view videos
CREATE POLICY "Public Videos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'recipe-videos' );

-- Policy to allow authenticated users to upload videos
CREATE POLICY "Authenticated Users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'recipe-videos' );

-- Policy to allow users to update their own videos (optional but good)
CREATE POLICY "Users can update their own videos"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'recipe-videos' AND owner = auth.uid() );

-- Policy to allow users to delete their own videos
CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'recipe-videos' AND owner = auth.uid() );
