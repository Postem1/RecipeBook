// Shared app constants — single source of truth for values that were previously
// duplicated as magic literals across multiple pages.

export const ITEMS_PER_PAGE = 10;

// Recipe categories (without the 'All' filter sentinel used on the Home page).
export const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'] as const;

// Columns needed to render a RecipeCard. Selecting these explicitly (instead of
// `*`) avoids over-fetching the heavy `ingredients`/`instructions` columns on
// list/grid views, which never display them.
export const RECIPE_CARD_COLUMNS: string =
    'id, title, description, photo_url, prep_time, cook_time, servings, category, video_url, is_private, user_id, created_at';
