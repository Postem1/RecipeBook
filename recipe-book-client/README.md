# recipe-book-client

The Recipe Book web app (React 19 + TypeScript + Vite, Supabase backend), plus the Vercel functions in `api/`. This folder is the Vercel project root.

```bash
npm install
npm run dev      # http://localhost:5173 (needs .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
npm run lint
npm run build    # tsc -b && vite build
```

Full documentation lives at the repo root:

- [README.md](../README.md): features, setup, deployment, environment variables, cron jobs, migrations
- [PROJECT_DOCUMENTATION.md](../PROJECT_DOCUMENTATION.md): technical reference
- [PROJECT_WALKTHROUGH.md](../PROJECT_WALKTHROUGH.md): user guide
