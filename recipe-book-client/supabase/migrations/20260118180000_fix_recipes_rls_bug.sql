-- Fix broken RLS policies on rb_recipes that were causing empty results

-- 1. Drop the malformed "mega-policy" if it exists
-- This policy had incorrect subquery logic and might have been causing conflicts/errors
DROP POLICY IF EXISTS "Read public, own, or shared recipes" ON public.rb_recipes;

-- 2. Ensure we have clean, separate policies for each access type

-- A. Public Access (Keep existing or Ensure it exists)
-- "Public recipes are viewable by everyone" (Already likely exists from previous migration, but safe to re-assert if needed, 
-- though CREATE POLICY fails if exists, so we leave it be or drop/recreate to be sure)
DROP POLICY IF EXISTS "Public recipes are viewable by everyone" ON public.rb_recipes;
CREATE POLICY "Public recipes are viewable by everyone"
ON public.rb_recipes FOR SELECT
USING ( is_private = false );

-- B. Own Private Access (Keep existing)
DROP POLICY IF EXISTS "Users can view own private recipes" ON public.rb_recipes;
CREATE POLICY "Users can view own private recipes"
ON public.rb_recipes FOR SELECT
USING ( auth.uid() = user_id );

-- C. Admin Access (Restore explicit admin view)
-- "Admins can view private recipes"
DROP POLICY IF EXISTS "Admins can view private recipes" ON public.rb_recipes;
CREATE POLICY "Admins can view private recipes"
ON public.rb_recipes FOR SELECT
USING ( public.is_admin() );

-- D. Shared Access (Fix the logic)
-- logic: Recipient can view if there is a share record for this recipe_id targeting them
DROP POLICY IF EXISTS "Users can view recipes shared with them" ON public.rb_recipes;
CREATE POLICY "Users can view recipes shared with them"
ON public.rb_recipes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.rb_recipe_shares
    WHERE recipe_id = id  -- Correlates to rb_recipes.id
    AND user_id = auth.uid()
  )
);
