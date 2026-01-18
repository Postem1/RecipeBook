-- 1. Secure Role Updates (Privilege Escalation Fix)

-- Function to check if the user is authorized to change roles
CREATE OR REPLACE FUNCTION public.check_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If the role is being changed...
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if the current user is an admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can change user roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run before update on profiles
DROP TRIGGER IF EXISTS tr_protect_role_change ON public.rb_profiles;
CREATE TRIGGER tr_protect_role_change
BEFORE UPDATE ON public.rb_profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_role_change();


-- 2. Fix Missing Policies for rb_recipe_shares

ALTER TABLE public.rb_recipe_shares ENABLE ROW LEVEL SECURITY;

-- Insert: Users can share recipes they own.
DROP POLICY IF EXISTS "Users can share their own recipes" ON public.rb_recipe_shares;
CREATE POLICY "Users can share their own recipes"
ON public.rb_recipe_shares
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.rb_recipes
    WHERE id = rb_recipe_shares.recipe_id
    AND user_id = auth.uid()
  )
);

-- Select: Users can view shares sent to them
DROP POLICY IF EXISTS "Users can view shares sent to them" ON public.rb_recipe_shares;
CREATE POLICY "Users can view shares sent to them"
ON public.rb_recipe_shares
FOR SELECT
USING ( user_id = auth.uid() );

-- Select: Recipe owners can view shares of their recipes
DROP POLICY IF EXISTS "Recipe owners can view shares of their recipes" ON public.rb_recipe_shares;
CREATE POLICY "Recipe owners can view shares of their recipes"
ON public.rb_recipe_shares
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.rb_recipes
    WHERE id = rb_recipe_shares.recipe_id
    AND user_id = auth.uid()
  )
);

-- Delete: Recipe owners can revoke shares
DROP POLICY IF EXISTS "Recipe owners can revoke shares" ON public.rb_recipe_shares;
CREATE POLICY "Recipe owners can revoke shares"
ON public.rb_recipe_shares
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.rb_recipes
    WHERE id = rb_recipe_shares.recipe_id
    AND user_id = auth.uid()
  )
);
