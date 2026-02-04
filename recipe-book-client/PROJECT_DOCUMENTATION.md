# Project Documentation: Pagination & Scroll Architecture

## 1. Server-Side Pagination
The application uses Supabase's `.range(from, to)` method for efficient server-side pagination.

### Constants
- `ITEMS_PER_PAGE = 10`

### State Management
Each paginated component (`Home`, `MyRecipes`, etc.) manages:
- `currentPage` (number, starts at 1)
- `totalCount` (number, total items from DB)
- `loading` (boolean)

### Query Logic
```typescript
const from = (currentPage - 1) * ITEMS_PER_PAGE;
const to = from + ITEMS_PER_PAGE - 1;
// ... Supabase query ...
.range(from, to)
```

## 2. Scroll Logic Architecture
We implemented a robust "Opt-In" scroll strategy to handle Single Page Application (SPA) scroll behavior nuances, particularly with React Router and async data fetching.

### The Challenge
- Browsers often try to restore scroll position on reload.
- Changing pages (pagination) should scroll to the TOP of the list, not the top of the page (keeping context).
- Initial load MUST start at the top of the page (Hero section).

### The Solution: "Explicit Opt-In"
We use a `shouldScroll` ref to track whether a scroll action was user-initiated.

1.  **Initial Load (Force Top)**:
    - We use `useLayoutEffect` to run *before* paint.
    - We disable `history.scrollRestoration` momentarily to prevent the browser from overriding us.
    - We execute `window.scrollTo(0, 0)`.

2.  **User Interaction (Trigger Scroll)**:
    - When a user clicks "Next", "Search", or a "Category" filter, we set `shouldScroll.current = true`.

3.  **Scroll Execution**:
    - A `useLayoutEffect` observes `currentPage` (and other filters).
    - It checks `if (shouldScroll.current)`.
    - If true, it scrolls to the `recipesSectionRef` (Top of list) and resets the flag to `false`.

### Code Pattern
```typescript
// Initial Load
useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    // ... fetch ...
}, []);

// Scroll Update
useLayoutEffect(() => {
    if (shouldScroll.current) {
        scrollToRecipes(); // Scrolls to ref
        shouldScroll.current = false;
    }
}, [currentPage, ...]);
```

 This ensures predictable behavior across all network conditions and browser types.
