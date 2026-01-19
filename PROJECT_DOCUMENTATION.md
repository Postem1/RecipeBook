# Recipe Book Project Documentation

## Overview
This project is a modern, social Recipe Book application built with a React frontend and Supabase backend. It is developed using a 3-layer Agentic Architecture to ensure reliability and scalability in AI-assisted development.

## Architecture

## Architecture

### The Antigravity Agent System
This project utilizes the **Antigravity Kit** to drive AI-assisted development:

-   **Specialist Agents**: Role-based personas like `frontend-specialist` and `database-architect` ensure expert-level code generation.
-   **Skill Modules**: dynamic knowledge bases loaded from `.agent/skills/` provide vetted patterns for Security, UI/UX, and Performance.
-   **Automated Workflows**: Slash commands (e.g., `/enhance`) trigger structured multi-step processes for reliable execution.

### Design System
The application uses a refined design system defined in `src/styles/index.css`:
-   **Typography**: 'Outfit' and 'Inter' font stack with optimized line heights (1.5 body) and readable line lengths (`max-width: 65ch`).
-   **Visual Depth**: A tiered shadow system (`--shadow-soft`, `--shadow-hover`) to create hierarchy and depth.
-   **Interactions**: Standardized transition timings for smooth hover and focus states.
-   **Mobile Responsiveness**:
    -   **Action Buttons**: Adaptive layouts (Flex Row → Flex Column) for action buttons on mobile.
    -   **Admin Wrappers**: Flex-wrapping enabled for superuser controls to prevent overflow on small screens.

### Security Enhancements
-   **HTTP Headers**: Strict security headers (CSP, X-Frame-Options, X-Content-Type-Options) configured in `vercel.json`.
    -   *Update*: CSP `img-src` relaxed to allow HTTPS images for reliable loading.
    -   *Update*: `Referrer-Policy: no-referrer` added to bypass external image hotlink protections.
-   **Dependency Integrity**: Enforced via `package-lock.json` to prevent supply chain attacks.
-   **Auth**: Row Level Security (RLS) policies on Supabase ensure data isolation.

### Tech Stack
-   **Frontend**: React (v18), TypeScript, Vite (v6)
-   **Backend / Database**: Supabase (PostgreSQL, Auth, Storage)
-   **Styling**: CSS Modules / Vanilla CSS with a focus on modern, responsive design.
-   **Icons**: Lucide React

## Recipe Book Client

The client application (`recipe-book-client`) provides a rich user interface for managing and discovering recipes.

### Key Features
-   **Authentication**: User Sign Up, Login, and Session Management via Supabase Auth.
-   **Recipe Management**:
    -   Create, Edit, and Delete recipes.
    -   Upload recipe photos.
    -   Set privacy controls (Public/Private).
-   **Social Features**:
    -   **Sharing**: Share private recipes with other users via email (case-insensitive). View list of users with access and revoke access.
    -   **Comments**: Discuss recipes with a built-in commenting system.
    -   **Favorites**: improved bookmarking of recipes.
-   **Discovery**:
    -   Search capabilities.
    -   Category filtering (Breakfast, Lunch, Dinner, etc.).
-   **Admin Dashboard** (Superuser Only):
    -   **System Stats**: View key metrics (Total Users, Recipes, Sessions).
    -   **User Management**: Promote users to Admins or demote them using a secure confirmation dialog.
    -   **Recipe Oversight**: Monitor all recipes and reassign ownership if necessary (e.g., for imported content).

### Directory Structure (`recipe-book-client/src`)
-   `components/`: Reusable UI components (RecipeCard, Navbar, specialized forms).
-   `context/`: React Context definitions (AuthContext).
-   `hooks/`: Custom hooks (useAuth).
-   `lib/`: Utility libraries and Supabase client initialization.
-   `pages/`: Main application views (Home, RecipeDetail, Login, etc.).
-   `styles/`: Global styles and variables.

## Development Setup

### Prerequisites
-   Node.js (v18+)
-   npm
-   Supabase project credentials

### Installation
1.  Navigate to the client directory:
    ```bash
    cd recipe-book-client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    -   Ensure `.env` exists with valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Running the App
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Linting & Type Checking
-   Lint: `npm run lint`
-   Type Check: `npx tsc -b`

## Deployment

The application is configured for deployment on **Vercel**.

### Configuration (`vercel.json`)
A `vercel.json` file is included to handle single-page application (SPA) routing and security:
-   **Rewrites**: Redirects all requests to `index.html` to support React Router.
-   **Headers**: Sets security headers including `Content-Security-Policy` (CSP) and `X-Content-Type-Options`.

### Deploying
1.  Connect your GitHub repository to Vercel.
2.  Import the project (root directory: `recipe-book-client`).
3.  Set the Environment Variables in Vercel project settings:
    -   `VITE_SUPABASE_URL`
    -   `VITE_SUPABASE_ANON_KEY`
4.  Deploy.
