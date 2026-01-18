-- Allow Admins to update any recipe
CREATE POLICY "Admins can update all recipes"
ON public.rb_recipes
FOR UPDATE
TO authenticated
USING (
  exists (
    select 1 from public.rb_profiles
    where id = auth.uid()
    and role = 'admin'
  )
)
WITH CHECK (
  exists (
    select 1 from public.rb_profiles
    where id = auth.uid()
    and role = 'admin'
  )
);
