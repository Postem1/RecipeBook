-- Step-by-Step RLS Fix: Step 1 (Public Only)

-- 1. Enable RLS (it was disabled for debugging)
ALTER TABLE public.rb_recipes ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to be absolutely sure
DROP POLICY IF EXISTS "Admins can delete any recipe" ON public.rb_recipes;
DROP POLICY IF EXISTS "Admins can update all recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Admins can update any recipe" ON public.rb_recipes;
DROP POLICY IF EXISTS "Admins can view all recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Admins can view private recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Delete own or admin" ON public.rb_recipes;
DROP POLICY IF EXISTS "Insert own recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Public recipes are viewable by everyone" ON public.rb_recipes;
DROP POLICY IF EXISTS "Read public, own, or shared recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Update own or admin" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users and Admins can delete recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users and Admins can update recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users can insert own recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users can view own private recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users can view recipes shared with them" ON public.rb_recipes;

-- 3. Add ONLY the Public Policy (most critical for Home page)
-- Use legacy-compatible null check just in case
CREATE POLICY "Public recipes are viewable by everyone"
ON public.rb_recipes FOR SELECT
USING ( is_private IS NOT TRUE );

-- 4. Reload Schema Config
NOTIFY pgrst, 'reload config';
