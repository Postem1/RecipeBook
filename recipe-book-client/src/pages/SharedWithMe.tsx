import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import RecipeCard, { type Recipe } from '../components/recipes/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { Share2 } from 'lucide-react';
import Pagination from '../components/common/Pagination';

const SharedWithMe = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const ITEMS_PER_PAGE = 10;

    const fetchSharedRecipes = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const from = (currentPage - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            // Fetch shared recipes
            const { data, count, error } = await supabase
                .from('rb_recipe_shares')
                .select(`
                    recipe_id,
                    recipe:rb_recipes (*)
                `, { count: 'exact' })
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            // Transform data to extract the recipe object
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sharedRecipes = (data as any[]).map((item) => item.recipe).filter((r) => r !== null);
            setRecipes(sharedRecipes || []);
            setTotalCount(count || 0);
        } catch (error) {
            console.error('Error fetching shared recipes:', error);
        } finally {
            setLoading(false);
        }
    }, [user, currentPage]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchSharedRecipes();
    }, [fetchSharedRecipes]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Share2 size={32} color="var(--color-primary)" />
                <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: 0 }}>Shared with Me</h1>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
            ) : recipes.length > 0 ? (
                <>
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
                        onPageChange={setCurrentPage}
                    />
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ marginBottom: '1rem', color: 'var(--color-text-light)' }}>No recipes have been shared with you yet.</p>
                </div>
            )}
        </div>
    );
};

export default SharedWithMe;
