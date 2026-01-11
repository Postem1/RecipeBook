INSERT INTO public.rb_profiles (id, email, role)
SELECT id, email, 'user'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
