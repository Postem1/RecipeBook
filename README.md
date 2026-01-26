# Recipe Book Application

A modern, social Recipe Book application built with React, TypeScript, and Supabase. This application allows users to discover, create, share, and manage recipes in a social environment.

## Features

-   **User Authentication**: Secure Sign Up, Login, and Profile management including Avatar uploads.
-   **Recipe Management**: Create, Read, Update, and Delete (CRUD) recipes with rich details (ingredients, instructions, photos).
-   **Social Interaction**:
    -   **Sharing**: Share private recipes with specific users via email and manage access permissions.
    -   **Comments**: engage in discussions on recipe pages.
    -   **Favorites**: Bookmark your favorite recipes.
    -   **Video Support**: Upload and watch recipe videos directly within the application (MP4/WebM supported).
-   **Admin Dashboard**:
    -   **Overview**: View system statistics (Total Users, Recipes, Active Sessions).
    -   **User Management**: Promote users to Admins or demote them.
    -   **Recipe Oversight**: Reassign recipe ownership or delete inappropriate content.
-   **Discovery**: Search and filter recipes by category.

## Tech Stack

-   **Frontend**: React 18, TypeScript, Vite
-   **Styling**: Modern CSS (Modules & Vanilla), Responsive Design
-   **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
-   **Icons**: Lucide React

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd recipe-book-client
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the `recipe-book-client` directory with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the application**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Architecture

This project is powered by the **Antigravity Kit**, a comprehensive AI development system:

1.  **Agents** (`.agent/agents/`): 16 specialist personas (e.g., `frontend-specialist`, `security-auditor`) that provide domain-specific expertise.
2.  **Skills** (`.agent/skills/`): 40+ modular knowledge bases covering React patterns, Security best practices, Database design, and more.
3.  **Workflows** (`.agent/workflows/`): Standardized procedures executed via slash commands (e.g., `/enhance`, `/debug`, `/deploy`) to ensure consistent, high-quality results.
