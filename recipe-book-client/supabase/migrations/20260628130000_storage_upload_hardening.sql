-- ============================================================================
-- Storage upload hardening (review item #2, safe subset)
-- ----------------------------------------------------------------------------
-- Two no-decision-needed hardening steps for the media buckets:
--
--   1. Bucket size + MIME limits. Caps file size and restricts content types so
--      the public buckets can't host arbitrary or oversized files. Affects new
--      uploads only; existing files are untouched. Safe to apply any time.
--
--   2. Per-user upload folders for recipe-photos and recipe-videos. The client
--      now uploads to `<auth.uid()>/<file>` (matching how avatars already work),
--      and these INSERT policies enforce it. This also closes a gap where the
--      recipe-videos INSERT policy had NO role check at all.
--
-- !! ORDERING !! Step 2 tightens the INSERT policies to REQUIRE the per-user
-- folder, so the matching client change (RecipeForm.tsx) must be DEPLOYED FIRST.
-- Apply this migration AFTER the PR is merged and Vercel has deployed; otherwise
-- the still-live old client (flat upload path) would be rejected on upload.
-- This only gates INSERT -- existing files and their public URLs are unaffected.
--
-- (recipe-images is intentionally left as-is: the client never uploads there.)
--
-- STATUS: not yet applied. Apply via the Supabase SQL editor or `supabase db push`
-- once the client change is live in production.
-- ============================================================================

-- 1. Size + MIME limits (bytes): images 5 MB, avatars 2 MB, videos 50 MB.
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif']
where id in ('recipe-photos', 'recipe-images');

update storage.buckets
set file_size_limit = 2097152,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif']
where id = 'avatars';

update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array['video/mp4','video/webm','video/ogg','video/quicktime']
where id = 'recipe-videos';

-- 2. Per-user upload folders (enforced): first path segment must be the
--    uploader's uid, e.g. `<uid>/<random>.jpg`.
drop policy if exists "Authenticated upload photos" on storage.objects;
create policy "Authenticated upload photos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'recipe-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Authenticated Users can upload videos" on storage.objects;
create policy "Authenticated Users can upload videos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'recipe-videos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
