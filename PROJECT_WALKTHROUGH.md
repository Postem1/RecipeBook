# Recipe Book: User Guide

How to use the app. Live at https://recipe-book-theta.vercel.app (or http://localhost:5173 when running `npm run dev`; see [README.md](README.md)).

## Navigation

The top bar:

- **RecipeBook.** (logo) and **Discover**: the home feed.
- Signed out: **Login** and **Sign Up**.
- Signed in: **My Recipes**, **Shared**, **Favorites**, and your avatar (opens **Profile**). Admins also see **Admin**.

On a phone, these links sit behind the menu button. Some names are longer there: *Shared With Me*, *Admin Dashboard*, *My Profile*.

## Accounts

- **Sign Up:** enter a username (letters and numbers only, up to 18 characters, must be unique), your email, and a password. You're then taken to the home page.
- **Login:** email and password.
- **Profile** (click your avatar):
  - **Avatar:** click your profile picture to upload a new one (JPEG, PNG, WebP, GIF or HEIC, up to 2 MB). It saves immediately.
  - **Username:** **Edit** → type a **New Username** → **Save**.
  - **Change Password:** enter it twice → **Update Password**.
  - **Sign Out**.

## Discovering recipes

The home page shows public recipes, 10 per page.

- **Search:** type in *"What are you craving today?"*. It matches recipe titles and descriptions.
- **Categories:** *All*, *Breakfast*, *Lunch*, *Dinner*, *Dessert*, *Snacks*.
- Click a card to open the recipe: ingredients, instructions, total time (prep + cook), servings, author, and comments. If the recipe has a video, click the play button on the photo to watch it.

## Creating and editing recipes

1. Go to **My Recipes** → **New Recipe** (or **Create Your First Recipe** if you have none yet).
2. Fill in:
   - **Recipe Title**, **Description**, **Category**
   - **Prep Time (mins)**, **Cook Time (mins)**, **Servings**
   - **Photo:** *Click to upload a photo* (JPEG, PNG, WebP, GIF or HEIC, up to 5 MB)
   - **Video:** either **Video URL (YouTube)**, which takes a YouTube or Vimeo link, or **Upload Video** (MP4, WebM, Ogg or QuickTime, up to 50 MB)
   - **Ingredients:** one per line. Use **Add Ingredient** for more lines and the ✕ to remove one.
   - **Instructions**
   - **Visibility:** tick **Make Private** to hide the recipe from everyone except you (and people you share it with).
3. Click **Save Recipe**. A title, instructions, and at least one ingredient are required.

On a recipe you own, the buttons under the photo let you:

| Button | Does |
|---|---|
| Heart | Add to / remove from Favorites (shown to everyone; signed-out visitors are sent to Login) |
| Lock | **Make Private** / **Make Public** |
| Share | Share the recipe with other users (see below) |
| Edit | Open the edit form |
| Trash | **Delete Recipe?** → **Yes, Delete** (permanent) |

## Sharing a private recipe

1. Open your recipe and click **Share**.
2. Enter the other person's **User Email** and click **Share**. Capitalization doesn't matter, but they must already have an account.
3. The recipe appears on their **Shared** (*Shared with Me*) page.
4. To stop sharing, open **Share** again, click the trash icon next to their name, then confirm with **Yes, Revoke**.

> Known issue: right now, private recipes shared with non-admin users don't appear for them because of a database rule bug. A fix is tracked; see *Access rules* in [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md).

## Comments

At the bottom of a recipe: type in *Add a comment...* → **Post Comment**. You must be logged in.

You can delete your own comments. A recipe's owner can delete any comment on it, and admins can delete any comment.

## Favorites

Click the heart on a recipe. Your saved recipes are listed under **Favorites** (*My Favorites*).

## Admin dashboard (admins only)

Click **Admin** to open the **Superuser Dashboard**:

- **Overview:** Total Users, Total Recipes, Private Recipes.
- **Users:** search by email.
  - **Promote to Admin** / **Demote to User** (shield icon, asks for confirmation).
  - Delete a user. This also deletes their recipes, comments, favorites and shares. Their login itself must be removed in the Supabase dashboard.
- **Recipes:** every recipe, public and private. You can **Edit**, **Make Public/Private**, **Reassign Owner** (pick a new owner from the list), or delete.

On a recipe page, admins also get the Edit, Share and Delete buttons, plus **Reassign Owner (Admin)**.

## Troubleshooting

- **No recipes load and you can't log in:** the free-tier database may have paused. The project owner can restore it from the Supabase dashboard. A daily keep-alive job normally prevents this.
- **Upload fails:** check the file type and size limits above.
- **"User with email … not found" when sharing:** the recipient needs to sign up first.
- **A recipe photo doesn't show:** photos linked from other websites can disappear or block embedding. Upload the photo instead.
