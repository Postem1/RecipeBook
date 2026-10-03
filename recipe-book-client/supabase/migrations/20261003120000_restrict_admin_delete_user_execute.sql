-- ============================================================================
-- Block signed-out callers from admin_delete_user
-- ----------------------------------------------------------------------------
-- admin_delete_user is SECURITY DEFINER and exposed as an RPC at
-- /rest/v1/rpc/admin_delete_user. Its first statement already refuses anyone
-- who isn't an admin, so this was never exploitable -- but signed-out callers
-- could still reach the function body. (Supabase advisor:
-- anon_security_definer_function_executable.)
--
-- Postgres grants EXECUTE on new functions to PUBLIC, which every role
-- (including anon) inherits, so revoking from anon alone is not enough: we
-- revoke from both PUBLIC and anon, and re-grant to the roles that need it.
-- The only caller is the Admin Dashboard (src/pages/AdminDashboard.tsx), which
-- always runs as a signed-in user, so app behavior is unchanged.
--
-- Idempotent (REVOKE/GRANT are no-ops when already in place).
--
-- STATUS: applied to the live project (cmmqyxqydpqqynmxriuq) on 2026-10-03.
-- ============================================================================

REVOKE EXECUTE ON FUNCTION public.admin_delete_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated, service_role;
