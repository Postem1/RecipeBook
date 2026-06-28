-- ============================================================================
-- Security hardening (review follow-up)
-- ----------------------------------------------------------------------------
-- This database was provisioned through the Supabase dashboard, so the
-- migrations directory is NOT a complete, self-contained record of the schema
-- (there are no base `CREATE TABLE` statements, and `get_recipe_owner()` is
-- referenced by 20260118183000_fix_circular_dependency.sql but never defined
-- here). This file codifies the safe, clearly-correct hardening items found in
-- the code review. It is intended to be applied manually via the Supabase SQL
-- editor or `supabase db push` against the existing project, NOT to recreate
-- the database from scratch.
--
-- To capture the full dashboard-managed schema + RLS policies into version
-- control (recommended), run:  supabase db pull
-- ============================================================================

-- 1. Define the missing helper used by the rb_recipe_shares policies.
--    SECURITY DEFINER lets the share policies read rb_recipes' owner without
--    tripping over that table's own RLS (avoids the recursion this function
--    was introduced to solve). A fixed search_path is required for safety.
CREATE OR REPLACE FUNCTION public.get_recipe_owner(rid uuid)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT user_id FROM public.rb_recipes WHERE id = rid;
$$;

-- 2. Pin a stable search_path on every SECURITY DEFINER / trigger function.
--    Without this, a definer function can be hijacked by objects placed in an
--    attacker-controlled schema earlier on the search_path (this is exactly
--    what Supabase's "Function Search Path Mutable" advisor flags).
ALTER FUNCTION public.is_admin() SET search_path = public, pg_temp;
ALTER FUNCTION public.admin_delete_user(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.check_role_change() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_random_username() SET search_path = public, pg_temp;

-- 3. Add a WITH CHECK to the profile self-update policy.
--    The previous definition only had USING (which row can be updated) and no
--    WITH CHECK (what the row may become), so a user could in principle mutate
--    immutable columns (e.g. their own id). Role escalation is already blocked
--    by the tr_protect_role_change trigger; this is defense-in-depth.
DROP POLICY IF EXISTS "Users can update own profile" ON public.rb_profiles;
CREATE POLICY "Users can update own profile"
ON public.rb_profiles FOR UPDATE
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

NOTIFY pgrst, 'reload config';

-- ----------------------------------------------------------------------------
-- NOTES (not executed here — verified against the live DB, no change needed):
--
-- * rb_comments / rb_favorites: RLS IS enabled with working policies in the
--   live project (confirmed by direct DB inspection). The migrations simply
--   never recorded it. Run `supabase db pull` to capture the real policies.
--
-- * Storage buckets `recipe-videos` and `avatars` are public=true, so a video
--   attached to a PRIVATE recipe is still reachable by its public URL, and any
--   authenticated user can upload to an unscoped path. Hardening this is a
--   behavior change (the client would need signed URLs + per-user folders), so
--   it is intentionally left out of this migration. Recommended follow-up:
--     - make the bucket private and serve via createSignedUrl(), and
--     - scope uploads with: WITH CHECK (
--         bucket_id = 'recipe-videos'
--         AND auth.uid()::text = (storage.foldername(name))[1]
--       )
-- ----------------------------------------------------------------------------
