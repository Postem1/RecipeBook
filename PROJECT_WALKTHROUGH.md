# Recipe Book Application Walkthrough

Welcome to the Recipe Book! This guide will walk you through the key features and workflows of the application.

## Getting Started

1.  **Launch the App**: Ensure the development server is running (`npm run dev`) and navigate to `http://localhost:5173`.
2.  **Navigation**: The top navigation bar is your hub.
    -   **RecipeBook**: Returns to the home feed.
    -   **Discover**: Explore public recipes.
    -   **Login / Sign Up**: Access your account.

## Authentication

To use social features and manage recipes, you must be logged in.

-   **Sign Up**: Click "Sign Up", enter your email and a password. You will be automatically logged in upon success.
-   **Login**: Use your registered credentials to access your profile.

## Discovering Recipes

The **Home Page** displays a feed of recipes.

-   **Search**: Use the search bar at the top to find recipes by title or ingredients.
-   **Filters**: Click the category buttons (e.g., *Breakfast*, *Lunch*) to narrow down the list.
-   **View Details**: Click on any recipe card to view the full details, including ingredients and instructions.

## Managing Your Recipes

Once logged in, you can contribute to the community.

### Create a Recipe
1.  Click the **"Add Recipe"** button (usually a `+` icon or "New Recipe" link).
2.  **Details**: Enter the Title, Description, Servings, Prep Time, and Cook Time.
3.  **Ingredients**: Add ingredients one by one.
4.  **Instructions**: Write satisfied step-by-step instructions.
5.  **Privacy**: Toggle "Private" if you only want to share this recipe with specific people.

### Edit or Delete
-   Navigate to a recipe you created.
-   **Edit**: Click the pencil icon to modify details.
-   **Delete**: Click the trash can icon to remove the recipe permanently.

## Social Features

Connect with other food enthusiasts!

### Sharing Recipes
You can share your private recipes with friends who are also on the platform.
1.  Open your recipe.
2.  Click the **Share** button.
3.  Enter the recipient's **Email Address**.
    -   *Note*: The email search is case-insensitive (e.g., `User@Example.com` works even if they registered as `user@example.com`).
4.  If the user exists, the recipe will appear in their **"Shared With Me"** section.

### Comments
-   Scroll to the bottom of any recipe.
-   Type your comment and hit **Post**.
-   Engage in discussions with the recipe creator and other users.

### Favorites
-   Click the **Heart** icon on any recipe to save it to your Favorites list for quick access later.

## Troubleshooting

-   **Search not working?** Ensure you are spelling user emails correctly (though capitalization doesn't matter).
-   **Images not loading?** Check your internet connection as images are hosted externally.
