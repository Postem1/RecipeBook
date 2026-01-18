-- Add username and avatar_url columns
ALTER TABLE public.rb_profiles
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add check constraint for username (alphanumeric, max 18)
ALTER TABLE public.rb_profiles
DROP CONSTRAINT IF EXISTS username_format;

ALTER TABLE public.rb_profiles
ADD CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9]{1,18}$');

-- Helper function to generate random usernames (if not exists)
CREATE OR REPLACE FUNCTION generate_random_username()
RETURNS TEXT AS $$
BEGIN
  -- using 'user' prefix without underscore to match alphanumeric constraint
  RETURN 'user' || substring(md5(random()::text) from 1 for 8);
END;
$$ LANGUAGE plpgsql;

-- Backfill usernames for existing profiles
UPDATE public.rb_profiles
SET username = generate_random_username()
WHERE username IS NULL;

-- Make username unique and not null
ALTER TABLE public.rb_profiles
ALTER COLUMN username SET NOT NULL;

DROP INDEX IF EXISTS idx_profiles_username_lower;
CREATE UNIQUE INDEX idx_profiles_username_lower ON public.rb_profiles (lower(username));

-- Insert avatars bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars." ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Users can upload their own avatars."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = owner );

CREATE POLICY "Users can update their own avatars."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner );
