# RecipeBook - Social Recipe Manager

RecipeBook is a modern, full-stack application for managing and sharing recipes. Built with React, Supabase, and a "Solar Flare" design system, it offers a fast, responsive, and visually engaging experience for food lovers.

## Features

### 🍳 Recipe Management
*   **Create & Edit**: Rich text editing for ingredients and steps.
*   **Private vs Public**: Keep secret family recipes private or share them with the world.
*   **Images**: Upload beautiful food photography (Supabase Storage).
*   **Filtering**: Filter by meal type (Breakfast, Lunch, Dinner, Snack) or search by keyword.

### 🤝 Social & Sharing
*   **Share Recipes**: Share private recipes with specific users via email.
*   **Favorites**: Save recipes you love for quick access.
*   **Community**: Public recipes appear in the global "Discover" feed.

### 🛡️ Admin Dashboard (Superusers)
*   **User Management**: View, promote, or delete users.
*   **Recipe Oversight**: Monitor all public/private recipes.
*   **Stats**: Quick view of total users and recipes.
*   **Mobile Optimized**: Fully responsive card-based layout for mobile admin tasks.

## Tech Stack

*   **Frontend**: React (Vite), TypeScript
*   **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
*   **Styling**: Custom CSS variables, "Solar Flare" Design System
*   **Deploy**: Vercel

## Design System: "Solar Flare"

The UI has been overhauled to follow the "Solar Flare" aesthetic:

*   **Palette**: Warm, organic tones (Coral Red, Amber Orange) against clean white backgrounds.
*   **Typography**: Modern sans-serif with optimized line heights and readability.
*   **Interactions**:
    *   **Buttons**: Gradient backgrounds with subtle hover lifts (`translateY`).
    *   **Inputs**: Global accessible input styling with focus rings.
    *   **Navbar**: Dynamic "glassmorphism" effect that responds to scroll position.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env` file with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

3.  **Run Locally**:
    ```bash
    npm run dev
    ```

4.  **Build**:
    ```bash
    npm run build
    ```
