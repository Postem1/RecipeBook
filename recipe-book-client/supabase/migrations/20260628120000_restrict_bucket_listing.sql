-- ============================================================================
-- Restrict storage bucket listing (review item #1)
-- ----------------------------------------------------------------------------
-- All four storage buckets (avatars, recipe-images, recipe-photos,
-- recipe-videos) are public and carry a broad SELECT policy on storage.objects
-- of the form `USING (bucket_id = '<bucket>')`. On a PUBLIC bucket that policy
-- is NOT needed to serve object URLs -- the /storage/v1/object/public/...
-- endpoint bypasses RLS -- but it does let any client call the storage `.list()`
-- API and enumerate every file in the bucket.
-- (Supabase advisor: public_bucket_allows_listing.)
--
-- The app only ever uses getPublicUrl()/upload(); it never lists. So we drop the
-- broad public-read SELECT policies: object URLs keep working, file enumeration
-- is disabled. If owner-only listing is ever needed, add a narrow policy such as
--   CREATE POLICY "Owners can list their own <bucket>"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = '<bucket>' AND owner = auth.uid());
--
-- Idempotent (DROP ... IF EXISTS). Scope: listing only -- this does not change
-- bucket privacy (see review item #2 for signed-URL privacy).
--
-- STATUS: not yet applied. Apply via the Supabase SQL editor or `supabase db push`.
-- ============================================================================

DROP POLICY IF EXISTS "Public Videos" ON storage.objects;
DROP POLICY IF EXISTS "Public read photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
