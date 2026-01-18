-- Clean Slate RLS Migration
-- Goal: Remove all duplicate/conflicting policies and prevent infinite recursion by using valid SECURITY DEFINER functions.

-- ==========================================
-- 1. RB_PROFILES
-- ==========================================

-- Drop ALL existing policies to ensure no duplicates
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.rb_profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.rb_profiles;
DROP POLICY IF EXISTS "Public read profiles" ON public.rb_profiles;
DROP POLICY IF EXISTS "Update own profile" ON public.rb_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.rb_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.rb_profiles;

-- Enable RLS (just in case)
ALTER TABLE public.rb_profiles ENABLE ROW LEVEL SECURITY;

-- A. SELECT: Open to everyone (needed for recipes username display)
CREATE POLICY "Profiles are viewable by everyone"
ON public.rb_profiles FOR SELECT
USING ( true );

-- B. INSERT: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.rb_profiles FOR INSERT
WITH CHECK ( auth.uid() = id );

-- C. UPDATE: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.rb_profiles FOR UPDATE
USING ( auth.uid() = id );

-- D. UPDATE: Admins can update any profile (Use is_admin() to avoid recursion)
CREATE POLICY "Admins can update all profiles"
ON public.rb_profiles FOR UPDATE
USING ( public.is_admin() );

-- ==========================================
-- 2. RB_RECIPES
-- ==========================================

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Admins can delete any recipe" ON public.rb_recipes;
DROP POLICY IF EXISTS "Admins can update all recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Admins can update any recipe" ON public.rb_recipes;
DROP POLICY IF EXISTS "Admins can view private recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Delete own or admin" ON public.rb_recipes;
DROP POLICY IF EXISTS "Insert own recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Public recipes are viewable by everyone" ON public.rb_recipes;
DROP POLICY IF EXISTS "Read public, own, or shared recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Update own or admin" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users can insert own recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users can view own private recipes" ON public.rb_recipes;
DROP POLICY IF EXISTS "Users can view recipes shared with them" ON public.rb_recipes;

-- Enable RLS
ALTER TABLE public.rb_recipes ENABLE ROW LEVEL SECURITY;

-- A. SELECT: Public recipes
CREATE POLICY "Public recipes are viewable by everyone"
ON public.rb_recipes FOR SELECT
USING ( is_private = false );

-- B. SELECT: Own Private recipes
CREATE POLICY "Users can view own private recipes"
ON public.rb_recipes FOR SELECT
USING ( auth.uid() = user_id );

-- C. SELECT: Admin view all
CREATE POLICY "Admins can view all recipes"
ON public.rb_recipes FOR SELECT
USING ( public.is_admin() );

-- D. SELECT: Shared with me
CREATE POLICY "Users can view recipes shared with them"
ON public.rb_recipes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.rb_recipe_shares
    WHERE recipe_id = id
    AND user_id = auth.uid()
  )
);

-- E. INSERT: Own recipes
CREATE POLICY "Users can insert own recipes"
ON public.rb_recipes FOR INSERT
WITH CHECK ( auth.uid() = user_id );

-- F. UPDATE: Own recipes OR Admin
CREATE POLICY "Users and Admins can update recipes"
ON public.rb_recipes FOR UPDATE
USING ( 
  auth.uid() = user_id 
  OR public.is_admin() 
);

-- G. DELETE: Own recipes OR Admin
CREATE POLICY "Users and Admins can delete recipes"
ON public.rb_recipes FOR DELETE
USING ( 
  auth.uid() = user_id 
  OR public.is_admin() 
);

-- ==========================================
-- 3. SCHEMA CACHE RELOAD
-- ==========================================
NOTIFY pgrst, 'reload config';
