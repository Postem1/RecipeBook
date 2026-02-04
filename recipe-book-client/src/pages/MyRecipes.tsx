import { useEffect, useState, useCallback } from 'react'; import { supabase } from '../lib/supabase';
import RecipeCard, { type Recipe } from '../components/recipes/RecipeCard'; import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Pagination from '../components/common/Pagination';
import { Plus } from 'lucide-react';

const MyRecipes = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const ITEMS_PER_PAGE = 10;

    const fetchMyRecipes = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const from = (currentPage - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data, count, error } = await supabase
                .from('rb_recipes')
                .select('*', { count: 'exact' })
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;
            setRecipes(data || []);
            setTotalCount(count || 0);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    }, [user, currentPage]);

    useEffect(() => {
        if (user) {
            window.scrollTo(0, 0);
            fetchMyRecipes();
        }
    }, [user, fetchMyRecipes]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>My Recipes</h1>
                <Link to="/create-recipe" className="btn btn-primary">
                    <Plus size={20} />
                    <span>New Recipe</span>
                </Link>
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
                    <p style={{ marginBottom: '1rem', color: 'var(--color-text-light)' }}>You haven't created any recipes yet.</p>
                    <Link to="/create-recipe" className="btn btn-primary">Create Your First Recipe</Link>
                </div>
            )}
        </div>
    );
};

export default MyRecipes;
