# Recipe Book: Technical Reference

Last reviewed against the code and the live Supabase project: 2026-10-03. For setup, deployment and environment variables, see [README.md](README.md).

## Architecture

```
Browser (React SPA) ──supabase-js + anon key──▶ Supabase: Postgres (RLS) · Auth · Storage
        ▲
        │ static files
Vercel ─┴─ api/keepalive.ts ─────(anon key)──────────▶ Postgres (one tiny read)
        └─ api/storage-sweep.ts ─(service role key)──▶ Postgres (read refs) + Storage (list/delete)
           ▲ both triggered daily by Vercel Cron, authenticated with CRON_SECRET
```

There is no custom backend: the browser talks to Supabase directly, and **row-level security (RLS) is what enforces who can see and change what**. The two Vercel functions are maintenance jobs only.

## Frontend

### Routes (`src/App.tsx`)

| Path | Page | Access |
|---|---|---|
| `/` | Home (Discover feed) | Everyone |
| `/login`, `/register` | Login, Register | Everyone |
| `/recipes/:id` | RecipeDetail | Everyone (RLS decides whether the recipe is visible) |
| `/my-recipes`, `/favorites`, `/shared` | MyRecipes, Favorites, SharedWithMe | Signed in |
| `/create-recipe`, `/edit-recipe/:id` | RecipeForm | Signed in |
| `/profile` | Profile | Signed in |
| `/admin` | AdminDashboard | Signed in; the page redirects non-admins to `/` |

"Signed in" routes are wrapped in `components/auth/ProtectedRoute.tsx`, which redirects to `/login`.

### State and shared code

- `context/AuthContext.tsx`: session, `user`, the user's `rb_profiles` row (`profile`), `isAdmin` (`profile.role === 'admin'`), `signOut`, `refreshProfile`. Read it with `useAuth()`.
- `lib/supabase.ts`: the Supabase client (built from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`).
- `lib/constants.ts`: `ITEMS_PER_PAGE = 10`, `CATEGORIES` (`Breakfast`, `Lunch`, `Dinner`, `Dessert`, `Snacks`), and `RECIPE_CARD_COLUMNS` (the column list for card grids, which skips the heavy `ingredients` / `instructions`).
- Components: `layout/Navbar`, `layout/Layout`, `recipes/RecipeCard`, `recipes/VideoPlayer`, `comments/CommentSection`, `common/Pagination`, `common/UserAvatar`, `admin/UserSelector`.

### Video playback (`components/recipes/VideoPlayer.tsx`)

YouTube links are embedded via `youtube-nocookie.com`, and Vimeo links via `player.vimeo.com`. Direct video files play in a `<video>` element, and any other URL falls back to react-player. The CSP in `vercel.json` allows frames only from YouTube and Vimeo, and media (`media-src`) only from the site itself and Supabase Storage. A direct video file hosted anywhere else is blocked, so uploaded videos and YouTube/Vimeo links are the supported options.

### Pagination and scroll behavior

Home, My Recipes, Shared with Me and Favorites all page on the server with `.range(from, to)`, 10 items per page:

```ts
const from = (currentPage - 1) * ITEMS_PER_PAGE;
const to = from + ITEMS_PER_PAGE - 1;
query.range(from, to);
```

Home search is debounced and matches `title` or `description` (`ilike`). The category filter is an `eq('category', …)`. Changing either resets to page 1. The category buttons are *All* plus every entry in `CATEGORIES`.

Scrolling uses an explicit opt-in so the page doesn't jump on load:

1. **Initial load:** a `useLayoutEffect` sets `history.scrollRestoration = 'manual'` (restored to `'auto'` on unmount) and calls `window.scrollTo(0, 0)` before paint, so the hero is visible.
2. **User action:** clicking Next/Previous, searching, or picking a category sets `shouldScroll.current = true`.
3. **Scroll:** a second `useLayoutEffect` watches the page and filters. Only when the flag is set does it scroll to the top of the recipe list (`recipesSectionRef`), then it clears the flag.

## Data model (Postgres, `public` schema)

| Table | Columns |
|---|---|
| `rb_profiles` | `id` (= auth user id), `email`, `role` (`user` / `admin`), `username`, `avatar_url` |
| `rb_recipes` | `id`, `user_id`, `title`, `description`, `ingredients` (JSON array of strings), `instructions`, `prep_time`, `cook_time`, `servings`, `category`, `photo_url`, `video_url`, `is_private`, `created_at`, `updated_at` |
| `rb_comments` | `id`, `recipe_id`, `user_id`, `content`, `created_at` |
| `rb_favorites` | `user_id`, `recipe_id`, `created_at` |
| `rb_recipe_shares` | `id`, `recipe_id`, `user_id` (the recipient), `created_at` |

`photo_url` / `video_url` hold either a Supabase Storage public URL or an external link.

### Access rules (RLS summary)

| Table | Read | Write |
|---|---|---|
| `rb_recipes` | Public recipes: everyone. Private: owner, admins, and users it's shared with* | Insert: own. Update/delete: owner or admin |
| `rb_comments` | Anyone who can see the recipe | Insert: signed in. Delete: comment author, recipe owner, or admin |
| `rb_favorites` | Own only | Own only |
| `rb_recipe_shares` | Recipient, recipe owner, admins | Recipe owner or admin |
| `rb_profiles` | Everyone (usernames and avatars appear on recipes and comments) | Own profile, or admin. Only admins may change `role` |

\* The "shared with them" read policy currently compares the wrong columns and never matches, so non-admin recipients can't open private recipes shared with them. A fix is tracked separately.

### Database functions

| Function | Purpose |
|---|---|
| `is_admin()` | `true` if the caller's profile has `role = 'admin'`; used throughout RLS |
| `get_recipe_owner(recipe_id)` | Owner of a recipe; lets share policies check ownership without a circular RLS dependency |
| `handle_new_user()` | Trigger on new auth users: creates the `rb_profiles` row (role `user`, the username from sign-up or a random `user…` name) |
| `check_role_change()` | Trigger: blocks role changes unless the caller is an admin |
| `admin_delete_user(target_user_id)` | Admin-only RPC: deletes the user's shares, favorites, comments, their recipes (with everything attached to them) and their profile. Their Supabase Auth login is **not** removed; delete it in the Supabase dashboard if needed. Not executable by signed-out callers |
| `generate_random_username()` | Helper returning `user` + 8 random hex characters |

## Storage

All four buckets are public-read. Listing is disabled and only the owner can delete their files.

| Bucket | Used for | Max size | Allowed types |
|---|---|---|---|
| `recipe-photos` | Recipe photos | 5 MB | JPEG, PNG, WebP, GIF, HEIC, HEIF |
| `recipe-videos` | Uploaded recipe videos | 50 MB | MP4, WebM, Ogg, QuickTime |
| `avatars` | Profile pictures | 2 MB | JPEG, PNG, WebP, GIF, HEIC, HEIF |
| `recipe-images` | Legacy; the app no longer uploads here | 5 MB | JPEG, PNG, WebP, GIF, HEIC, HEIF |

Uploads go to `<user-id>/<random>.<ext>`. For recipe photos and videos, storage policies require the first path segment to be the uploader's id. Recipe photos and videos are uploaded as soon as they're picked in the form, before the recipe is saved. A new avatar is uploaded and saved to the profile in one step, which leaves the previous avatar unused. The storage sweep below removes files like these.

## Serverless functions (`recipe-book-client/api/`)

Both are `GET` handlers called by Vercel Cron (see the schedules in README).

### `keepalive.ts`

Runs `rb_recipes?select=id&limit=1` through PostgREST with the anon key so the free-tier project registers activity. Responses: 200 `{"ok":true,"supabaseStatus":200}`, 401 (bad secret), 500 (env vars missing), 502 (Supabase error). If `CRON_SECRET` is set, it requires `Authorization: Bearer <CRON_SECRET>`. Without it, the endpoint stays open, because a rejected ping would let the database pause and the read is harmless.

### `storage-sweep.ts`

1. Reads every `photo_url` / `video_url` in `rb_recipes` and `avatar_url` in `rb_profiles` with the **service role key**. The anon key can't see private recipes, so their files would look unused.
2. Lists every file in `recipe-photos`, `recipe-videos`, `recipe-images` and `avatars`, walking into per-user folders.
3. Deletes files that nothing references and that are more than 24 hours old.

Safety rules:
- It's a dry run unless `STORAGE_SWEEP_DELETE=true`.
- It requires `CRON_SECRET`; with no secret configured, every call is rejected.
- It deletes nothing and returns an error if the reference read fails, returns no recipes, or comes back truncated, or if more than 25 files would be deleted in one run.

Each run logs `storage-sweep {"dryRun":…,"filesListed":…,"orphans":[…]}`, plus `storage-sweep deleted N` when it deletes.

## Security

- **RLS** on every `rb_` table (see above); privileged operations go through `SECURITY DEFINER` functions with a pinned `search_path`.
- **Storage:** no listing, owner-only delete, per-user folders, size and type limits per bucket.
- **Secrets:** only the anon key ships to the browser. The service role key and `CRON_SECRET` exist only as Vercel environment variables.
- **HTTP headers** (`vercel.json`, all routes): `Content-Security-Policy` (self plus Supabase, YouTube/Vimeo frames, Vercel analytics script, Google Fonts; `img-src https:` so external recipe photos load), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-XSS-Protection: 0`.
- **Dependencies:** pinned by `package-lock.json`; CI installs with `npm ci`.

## Design system (`src/styles/index.css`)

| Token group | Values |
|---|---|
| Brand colors | `--color-primary` #FF6B6B (coral; hover #EE5D5D), `--color-secondary` #4ECDC4 (teal), `--color-accent` #FFE66D (yellow) |
| Text | `--color-text-primary` #2D3748, `--color-text-secondary` #718096, `--color-text-light` #A0AEC0 |
| Backgrounds | `--color-bg-primary` #F7F9FC, `--color-bg-white`, `--color-bg-subtle` / `--color-bg-alt` #EDF2F7, `--color-bg-secondary` #F1F5F9, `--color-border` #E2E8F0 |
| Status | `--color-success` #48BB78, `--color-error` #F56565, `--color-warning` #ECC94B |
| Spacing | `--spacing-xs` 0.25rem → `--spacing-xxl` 4rem |
| Radius | `--radius-sm` 12px, `--radius-md` 20px, `--radius-lg` 32px, `--radius-full` |
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-hover` |

- **Type:** the body font stack is `'Outfit', 'Inter', system-ui, …` with line-height 1.6. No web fonts are loaded, so visitors see Outfit or Inter only if they're installed locally, and the system UI font otherwise.
- **Global classes:** `.container`, `.card`, `.btn`, `.btn-primary` (coral gradient), `.btn-outline`, `.fade-in-up` with `.delay-100`…`.delay-500`, `.animate-spin`, `.hidden-mobile` / `.hidden-desktop`, `.recipe-action-header`, `.admin-header`, `.admin-tabs`.
- **Navbar:** transparent over the Home hero. Once you scroll (and on every other page) it becomes a 90%-white bar with a 12px backdrop blur and a light shadow. On mobile it collapses into a menu.
- Most component styling is inline `style={{ … }}` that refers to these tokens.

## Migrations

`recipe-book-client/supabase/migrations/` holds the schema history:

- **January 2026:** admin policies, profile fields and triggers, the RLS rework, video support
- **June 2026:** security hardening, bucket listing and upload restrictions
- **October 2026:** `admin_delete_user` lockdown `backfill_profiles.sql` is a one-off script, not a migration.

These files are applied manually and are **not** the full base schema, because the original tables were created in the Supabase dashboard. Treat the live database as the source of truth, and check the live migration history (Supabase dashboard → Database → Migrations) before assuming a file is live.
