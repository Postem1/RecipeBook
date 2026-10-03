# Recipe Book

A social recipe app: browse public recipes, keep your own (public or private), share private ones with friends, comment, and save favorites. React + TypeScript frontend, Supabase backend, hosted on Vercel.

**Live:** https://recipe-book-theta.vercel.app

- [PROJECT_WALKTHROUGH.md](PROJECT_WALKTHROUGH.md): how to use the app
- [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md): technical reference (data model, access rules, storage, serverless functions, design system)

## Features

- **Accounts**: sign up with email, password and username; change your username and upload an avatar on the Profile page.
- **Recipes**: title, description, category, prep/cook time, servings, ingredient list, instructions, a photo, and a video (upload a file or paste a YouTube/Vimeo link). Each recipe is public or private.
- **Discover**: home feed of public recipes with search (title and description), category filters (All, Breakfast, Lunch, Dinner), and 10 recipes per page.
- **Social**: favorites, comments, and sharing private recipes with other users by email (they appear on the recipient's *Shared with Me* page).
- **Admin dashboard** (admins only): recipe and user counts; promote/demote users; delete users; edit, reassign or delete any recipe.
- **Maintenance jobs**: a daily keep-alive so the free-tier database doesn't pause, and a daily sweep that deletes uploaded files no recipe or profile uses any more (when `STORAGE_SWEEP_DELETE=true`).

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.9, Vite 7, React Router 7 |
| UI | Hand-written CSS with design tokens (`src/styles/index.css`), Radix UI dialogs, Lucide icons, react-player |
| Backend | Supabase: Postgres 17 with row-level security, Auth, Storage (supabase-js 2) |
| Hosting | Vercel: static site, two serverless functions in `api/`, two daily cron jobs |
| CI | GitHub Actions: `npm ci`, `npm run lint`, `npm run build` on Node 24 |

## Project layout

```
.
├── recipe-book-client/          # The app (Vercel project root)
│   ├── api/                     # Vercel serverless functions (cron targets)
│   │   ├── keepalive.ts         #   daily DB ping so Supabase doesn't pause
│   │   └── storage-sweep.ts     #   daily cleanup of unused uploads
│   ├── src/
│   │   ├── components/          # Navbar, RecipeCard, VideoPlayer, CommentSection, Pagination, ...
│   │   ├── context/             # AuthContext (session, profile, isAdmin) + useAuth()
│   │   ├── lib/                 # Supabase client, shared constants
│   │   ├── pages/               # One file per route (Home, RecipeDetail, RecipeForm, AdminDashboard, ...)
│   │   └── styles/index.css     # Design tokens and global styles
│   ├── supabase/migrations/     # SQL migrations (applied manually; see below)
│   ├── scripts/                 # One-off recipe scraping / seed-data generators
│   └── vercel.json              # Crons, SPA rewrite, security headers
├── .agent/                      # Antigravity Kit (AI development tooling)
└── .github/workflows/ci.yml     # CI
```

## Getting started

Requires **Node.js 20.19+ or 22.12+** (CI and Vercel use Node 24) and access to a Supabase project.

```bash
git clone https://github.com/Postem1/RecipeBook.git
cd RecipeBook/recipe-book-client
npm install
```

Create `recipe-book-client/.env`:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon / publishable key>
```

Then run `npm run dev` and open http://localhost:5173.

The Vite dev server only serves the frontend. The `api/` functions run on Vercel.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build locally |

## Deployment and operations

The Vercel project `recipe-book` deploys from this repo with **root directory `recipe-book-client`**. Pushes to `master` go to production, and pull requests get preview deployments.

### Environment variables (Vercel → Settings → Environment Variables)

| Variable | Used by | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend build, both functions | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Frontend build, keep-alive | Public anon key; it ships to browsers by design |
| `CRON_SECRET` | Both functions | Vercel sends it on cron calls. The sweep refuses to run without it |
| `SUPABASE_SERVICE_ROLE_KEY` | Storage sweep | **Server-only.** Never give it a `VITE_` prefix, or it gets bundled into the site |
| `STORAGE_SWEEP_DELETE` | Storage sweep | `true` = delete unused files. Unset = dry run (report only) |

Changes to these variables take effect only after a **redeploy**.

### Cron jobs (`vercel.json`)

| Path | Schedule (UTC) | Purpose |
|---|---|---|
| `/api/keepalive` | daily 12:00 | One small database read. Free-tier Supabase pauses after about 7 days without activity |
| `/api/storage-sweep` | daily 13:00 | Deletes stored files that nothing references and that are more than 24h old |

Vercel registers crons only from **production** deployments. To check a job, open **Settings → Cron Jobs → Run**, then read the function's logs. Calling the URL yourself returns 401 because `CRON_SECRET` is enforced.

If the Supabase project does pause, restore it from the Supabase dashboard. Wait for its status to read **Healthy** before you test the app.

### Database migrations

SQL files in `recipe-book-client/supabase/migrations/` are **not applied automatically**. Vercel builds only the frontend. Apply each one yourself (Supabase SQL editor, CLI, or MCP), then verify it against the live database. Merging a migration does not make it live.

## AI tooling

The project was built with the **Antigravity Kit** (`.agent/`): 16 specialist agent personas (`.agent/agents/`), 40 skill modules (`.agent/skills/`), and 11 slash-command workflows (`.agent/workflows/`, e.g. `/enhance`, `/debug`, `/deploy`). See `.agent/ARCHITECTURE.md`.
