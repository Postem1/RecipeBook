-- Allow Admins to update any profile (specifically for role management)
CREATE POLICY "Admins can update all profiles"
ON public.rb_profiles
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
