-- Step-by-Step RLS Fix: Step 2 (Admins + Own Private)

-- 1. Users can view own private recipes
CREATE POLICY "Users can view own private recipes"
ON public.rb_recipes FOR SELECT
USING ( auth.uid() = user_id );

-- 2. Admins can view all recipes
-- We rely on the verified SECURITY DEFINER function is_admin()
CREATE POLICY "Admins can view all recipes"
ON public.rb_recipes FOR SELECT
USING ( public.is_admin() );

-- 3. Reload Config
NOTIFY pgrst, 'reload config';
