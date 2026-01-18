-- Step-by-Step RLS Fix: Step 3 (Sharing + Write Access)

-- 1. Shared Recipes Access
CREATE POLICY "Users can view recipes shared with them"
ON public.rb_recipes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.rb_recipe_shares
    WHERE recipe_id = id
    AND user_id = auth.uid()
  )
);

-- 2. INSERT: Users can insert own recipes
CREATE POLICY "Users can insert own recipes"
ON public.rb_recipes FOR INSERT
WITH CHECK ( auth.uid() = user_id );

-- 3. UPDATE: Own recipes OR Admin
CREATE POLICY "Users and Admins can update recipes"
ON public.rb_recipes FOR UPDATE
USING ( 
  auth.uid() = user_id 
  OR public.is_admin() 
);

-- 4. DELETE: Own recipes OR Admin
CREATE POLICY "Users and Admins can delete recipes"
ON public.rb_recipes FOR DELETE
USING ( 
  auth.uid() = user_id 
  OR public.is_admin() 
);

-- 5. Reload Config
NOTIFY pgrst, 'reload config';
