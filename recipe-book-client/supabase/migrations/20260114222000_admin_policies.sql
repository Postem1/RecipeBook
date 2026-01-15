-- Helper to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1
    from public.rb_profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$ language sql security definer;

-- ==========================================
-- RB_RECIPES Policies
-- ==========================================

-- Admin can view ALL recipes (including private ones)
create policy "Admins can view private recipes"
  on public.rb_recipes for select
  using ( public.is_admin() );

-- Admin can update ANY recipe
create policy "Admins can update any recipe"
  on public.rb_recipes for update
  using ( public.is_admin() );

-- Admin can delete ANY recipe
create policy "Admins can delete any recipe"
  on public.rb_recipes for delete
  using ( public.is_admin() );

-- ==========================================
-- RB_COMMENTS Policies
-- ==========================================

-- Admin can delete ANY comment
create policy "Admins can delete any comment"
  on public.rb_comments for delete
  using ( public.is_admin() );

-- ==========================================
-- USER MANAGEMENT (RPC)
-- ==========================================

-- Function to comprehensively delete a user's app data
-- This is necessary to enforce "delete user -> delete their recipes" logic
-- consistently, especially if FK cascades aren't guaranteed.
create or replace function public.admin_delete_user(target_user_id uuid)
returns void as $$
begin
  -- 1. Security Check
  if not public.is_admin() then
    raise exception 'Access denied: User is not an admin';
  end if;

  -- 2. Delete dependent data (Cascading manually to be safe)
  delete from public.rb_recipe_shares where user_id = target_user_id;
  delete from public.rb_favorites where user_id = target_user_id;
  delete from public.rb_comments where user_id = target_user_id;
  
  -- 3. Delete Owned Recipes (Crucial requirement)
  delete from public.rb_recipes where user_id = target_user_id;
  
  -- 4. Delete the Profile itself
  delete from public.rb_profiles where id = target_user_id;
  
  -- Note: We cannot delete from auth.users from here without pg_net or cron extensions
  -- but removing the profile effectively bans them from the app logic.
end;
$$ language plpgsql security definer;
