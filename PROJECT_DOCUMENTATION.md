# Recipe Book Project Documentation

## Overview
This project is a modern, social Recipe Book application built with a React frontend and Supabase backend. It is developed using a 3-layer Agentic Architecture to ensure reliability and scalability in AI-assisted development.

## Architecture

### The 3-Layer Agentic System
The project structure is designed to separate intent from execution:
1.  **Directives (`directives/`)**: High-level Standard Operating Procedures (SOPs) written in Markdown. These define *what* needs to be done.
2.  **Orchestration (AI Agent)**: The reasoning layer that reads directives, plans, and invokes tools.
3.  **Execution (`execution/`)**: Deterministic Python scripts that perform the actual work (file manipulation, API calls, data processing).

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
    -   **Sharing**: Share private recipes with other users via email (case-insensitive).
    -   **Comments**: Discuss recipes with a built-in commenting system.
    -   **Favorites**: improved bookmarking of recipes.
-   **Discovery**:
    -   Search capabilities.
    -   Category filtering (Breakfast, Lunch, Dinner, etc.).

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
