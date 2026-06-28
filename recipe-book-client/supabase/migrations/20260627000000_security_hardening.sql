-- ============================================================================
-- Security hardening (review follow-up)
-- ----------------------------------------------------------------------------
-- This database was provisioned through the Supabase dashboard, so the
-- migrations directory is NOT a complete, self-contained record of the schema
-- (there are no base `CREATE TABLE` statements). This file is a hardening
-- OVERLAY for the existing project, not a from-scratch build. Every statement
-- is idempotent and safe to re-run.
--
-- STATUS: applied to the live project (cmmqyxqydpqqynmxriuq) on 2026-06-28.
--
-- To capture the full dashboard-managed schema + RLS policies into version
-- control (recommended), run:  supabase db pull
-- ============================================================================

-- 1. Pin a stable search_path on the SECURITY DEFINER / trigger functions.
--    Without this, a definer function can be hijacked by objects placed in an
--    attacker-controlled schema earlier on the search_path (this is exactly
--    what Supabase's "Function Search Path Mutable" advisor flags).
--
--    NOTE: get_recipe_owner() already exists in the live DB (created via the
--    dashboard with a `recipe_id` parameter), so we only ALTER its search_path
--    here. We intentionally do NOT CREATE OR REPLACE it: that would both rename
--    the parameter (which Postgres rejects) and depend on rb_recipes existing.
ALTER FUNCTION public.is_admin() SET search_path = public, pg_temp;
ALTER FUNCTION public.admin_delete_user(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.check_role_change() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_random_username() SET search_path = public, pg_temp;
ALTER FUNCTION public.get_recipe_owner(uuid) SET search_path = public, pg_temp;

-- 2. Add a WITH CHECK to the profile self-update policy.
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
-- NOTES — items verified against the live DB but intentionally left to a
-- separate change (tracked for follow-up):
--
-- * rb_comments / rb_favorites: RLS IS enabled with working policies in the
--   live project (confirmed by direct DB inspection). The migrations simply
--   never recorded it. Run `supabase db pull` to capture the real policies.
--
-- * Public buckets allow file listing (avatars, recipe-images, recipe-photos,
--   recipe-videos): their broad SELECT policies let clients list all objects.
--   Public object URLs don't need listing — narrow these SELECT policies.
--
-- * Storage privacy: a video on a PRIVATE recipe is still reachable via its
--   public URL, and any authenticated user can upload to an unscoped path.
--   Hardening this is a behavior change (client needs signed URLs + per-user
--   folders), e.g.:
--     - make the bucket private and serve via createSignedUrl(), and
--     - scope uploads with: WITH CHECK (
--         bucket_id = 'recipe-videos'
--         AND auth.uid()::text = (storage.foldername(name))[1]
--       )
--
-- * SECURITY DEFINER helpers (is_admin, get_recipe_owner, admin_delete_user)
--   are RPC-executable by anon/authenticated. Low risk (admin_delete_user
--   re-checks is_admin() internally), but EXECUTE could be revoked on the
--   trigger-only functions (check_role_change, handle_new_user). Verify RLS
--   policy evaluation still works before revoking on is_admin/get_recipe_owner.
--
-- * Auth: enable leaked-password protection (HaveIBeenPwned) in dashboard.
-- ----------------------------------------------------------------------------
