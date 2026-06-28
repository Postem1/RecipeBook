import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import RecipeCard, { type Recipe } from '../components/recipes/RecipeCard';
import Pagination from '../components/common/Pagination';
import { ITEMS_PER_PAGE, RECIPE_CARD_COLUMNS } from '../lib/constants';

const Favorites = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const recipesSectionRef = useRef<HTMLDivElement>(null);
    const shouldScroll = useRef(false);
    const latestRequest = useRef(0);

    const fetchFavorites = useCallback(async () => {
        if (!user) return;
        const requestId = ++latestRequest.current;
        try {
            setLoading(true);
            const from = (currentPage - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            // Join with rb_favorites
            const { data, count, error } = await supabase
                .from('rb_favorites')
                .select(`
          recipe_id,
          rb_recipes (
            ${RECIPE_CARD_COLUMNS},
            rb_profiles (username)
          )
        `, { count: 'exact' })
                .eq('user_id', user.id)
                .range(from, to);

            if (error) throw error;
            if (requestId !== latestRequest.current) return;

            // Extract recipes from the join
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const favRecipes = data?.map((item: any) => item.rb_recipes as Recipe) || [];
            setRecipes(favRecipes);
            setTotalCount(count || 0);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            if (requestId === latestRequest.current) setLoading(false);
        }
    }, [user, currentPage]);

    // Initial load effect
    useLayoutEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        if (user) {
            fetchFavorites();
        }

        return () => {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'auto';
            }
        };
    }, [user, fetchFavorites]);

    // Scroll handling
    useLayoutEffect(() => {
        if (shouldScroll.current) {
            if (recipesSectionRef.current) {
                const yOffset = -100;
                const element = recipesSectionRef.current;
                const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
            shouldScroll.current = false;
        }
    }, [currentPage]);

    // Snap back to the last valid page if the current page is now out of range.
    useEffect(() => {
        const pages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        if (pages > 0 && currentPage > pages) {
            setCurrentPage(pages);
        }
    }, [totalCount, currentPage]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '2rem' }}>My Favorites</h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
            ) : recipes.length > 0 ? (
                <div ref={recipesSectionRef}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {recipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            shouldScroll.current = true;
                            setCurrentPage(page);
                        }}
                    />
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ color: 'var(--color-text-light)' }}>You haven't favorited any recipes yet.</p>
                    <p>Go explore and find something delicious!</p>
                </div>
            )}
        </div>
    );
};

export default Favorites;
