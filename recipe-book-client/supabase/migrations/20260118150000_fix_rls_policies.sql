-- Enable RLS on tables (ensure it's on)
ALTER TABLE public.rb_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rb_recipes ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RB_PROFILES Policies
-- ==========================================

-- Allow everyone to read profiles (needed to see usernames on recipes)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.rb_profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.rb_profiles FOR SELECT
  USING ( true );

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.rb_profiles;
CREATE POLICY "Users can update own profile"
  ON public.rb_profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Users can insert their own profile (usually handled by trigger, but for safety)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.rb_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.rb_profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );


-- ==========================================
-- RB_RECIPES Policies
-- ==========================================

-- Allow everyone to read public recipes
DROP POLICY IF EXISTS "Public recipes are viewable by everyone" ON public.rb_recipes;
CREATE POLICY "Public recipes are viewable by everyone"
  ON public.rb_recipes FOR SELECT
  USING ( is_private = false );

-- Users can view their own private recipes
DROP POLICY IF EXISTS "Users can view own private recipes" ON public.rb_recipes;
CREATE POLICY "Users can view own private recipes"
  ON public.rb_recipes FOR SELECT
  USING ( auth.uid() = user_id );

-- Users can insert their own recipes
DROP POLICY IF EXISTS "Users can insert own recipes" ON public.rb_recipes;
CREATE POLICY "Users can insert own recipes"
  ON public.rb_recipes FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Users can update their own recipes
DROP POLICY IF EXISTS "Users can update own recipes" ON public.rb_recipes;
CREATE POLICY "Users can update own recipes"
  ON public.rb_recipes FOR UPDATE
  USING ( auth.uid() = user_id );

-- Users can delete their own recipes
DROP POLICY IF EXISTS "Users can delete own recipes" ON public.rb_recipes;
CREATE POLICY "Users can delete own recipes"
  ON public.rb_recipes FOR delete
  USING ( auth.uid() = user_id );
