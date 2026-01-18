-- Add foreign key from rb_recipes.user_id to rb_profiles.id
-- This allows PostgREST to automatically detect the relationship for joins
ALTER TABLE public.rb_recipes
DROP CONSTRAINT IF EXISTS rb_recipes_user_id_fkey; -- Drop old FK to auth.users if it complicates things, or just add new one. 
-- Actually, let's keep it simple. PostgREST needs *a* foreign key.

-- It's better to reference rb_profiles because that's a public table.
-- Referencing auth.users directly is often problematic for public joins in Supabase/PostgREST due to permissions.

-- We try to add the constraint.
ALTER TABLE public.rb_recipes
ADD CONSTRAINT fk_recipes_profiles
FOREIGN KEY (user_id)
REFERENCES public.rb_profiles (id)
ON DELETE CASCADE;
