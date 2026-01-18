-- Fix Circular Dependency on rb_recipe_shares
-- The circular dependency exists because rb_recipes RLS checks rb_recipe_shares, 
-- and rb_recipe_shares RLS checks rb_recipes using a standard subquery.
-- Solution: Use the SECURITY DEFINER function get_recipe_owner() for rb_recipe_shares policies to bypass RLS on rb_recipes.

-- 1. Drop conflicting/recursive policies on rb_recipe_shares
DROP POLICY IF EXISTS "Recipe owners can view shares of their recipes" ON public.rb_recipe_shares;
DROP POLICY IF EXISTS "Recipe owners can revoke shares" ON public.rb_recipe_shares;
DROP POLICY IF EXISTS "Users can share their own recipes" ON public.rb_recipe_shares;
DROP POLICY IF EXISTS "Owner can manage shares" ON public.rb_recipe_shares;

-- 2. Create clean, non-recursive policies using get_recipe_owner()

-- A. SELECT: Recipient OR Owner (via function)
CREATE POLICY "Users can view relevant shares"
ON public.rb_recipe_shares FOR SELECT
USING (
  user_id = auth.uid() -- I am the recipient
  OR
  get_recipe_owner(recipe_id) = auth.uid() -- I am the owner (Bypasses RLS)
);

-- B. INSERT: Only Owner can create shares
CREATE POLICY "Recipe owners can create shares"
ON public.rb_recipe_shares FOR INSERT
WITH CHECK (
  get_recipe_owner(recipe_id) = auth.uid()
);

-- C. DELETE: Only Owner can delete/revoke shares
CREATE POLICY "Recipe owners can revoke shares"
ON public.rb_recipe_shares FOR DELETE
USING (
  get_recipe_owner(recipe_id) = auth.uid()
);

-- Note: No UPDATE policy needed usually for shares (you just delete and re-add), but if needed:
-- D. UPDATE: Only Owner
CREATE POLICY "Recipe owners can update shares"
ON public.rb_recipe_shares FOR UPDATE
USING (
  get_recipe_owner(recipe_id) = auth.uid()
);

-- 3. Reload Schema
NOTIFY pgrst, 'reload config';
