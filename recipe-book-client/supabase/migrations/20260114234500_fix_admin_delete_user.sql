-- Update the admin_delete_user function to handle INCOMING dependencies
-- i.e., delete favorites/shares/comments ON the user's recipes before deleting the recipes themselves

create or replace function public.admin_delete_user(target_user_id uuid)
returns void as $$
begin
  -- 1. Security Check
  if not public.is_admin() then
    raise exception 'Access denied: User is not an admin';
  end if;

  -- 2. Delete OUTGOING dependencies (Things this user created)
  delete from public.rb_recipe_shares where user_id = target_user_id;
  delete from public.rb_favorites where user_id = target_user_id;
  delete from public.rb_comments where user_id = target_user_id;

  -- 3. Delete INCOMING dependencies (Things referencing this user's recipes)
  -- If we don't do this, we can't delete the recipes because of FK constraints from these tables.
  
  -- Delete favorites on user's recipes
  delete from public.rb_favorites 
  where recipe_id in (select id from public.rb_recipes where user_id = target_user_id);
  
  -- Delete comments on user's recipes
  delete from public.rb_comments 
  where recipe_id in (select id from public.rb_recipes where user_id = target_user_id);
  
  -- Delete shares of user's recipes
  delete from public.rb_recipe_shares 
  where recipe_id in (select id from public.rb_recipes where user_id = target_user_id);
  
  -- 4. Delete Owned Recipes (Now safe)
  delete from public.rb_recipes where user_id = target_user_id;
  
  -- 5. Delete the Profile itself
  delete from public.rb_profiles where id = target_user_id;
end;
$$ language plpgsql security definer;
