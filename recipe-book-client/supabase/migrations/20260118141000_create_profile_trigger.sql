-- Trigger function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.rb_profiles (id, email, role, username, avatar_url)
  VALUES (
    new.id,
    new.email,
    'user',
    -- Use provided username or generate a random one if missing to satisfy NOT NULL
    COALESCE(
      new.raw_user_meta_data->>'username', 
      'user' || substring(md5(random()::text) from 1 for 8)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email; -- Handle potential race conditions or re-inserts
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
