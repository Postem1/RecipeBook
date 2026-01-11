import { useEffect, useState } from 'react'; import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import RecipeCard, { type Recipe } from '../components/recipes/RecipeCard';
const Favorites = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchFavorites();
    }, [user]);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            // Join with rb_favorites
            const { data, error } = await supabase
                .from('rb_favorites')
                .select(`
          recipe_id,
          rb_recipes (*)
        `)
                .eq('user_id', user!.id);

            if (error) throw error;

            // Extract recipes from the join
            // @ts-ignore
            const favRecipes = data?.map((item: any) => item.rb_recipes as Recipe) || [];
            setRecipes(favRecipes);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '2rem' }}>My Favorites</h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
            ) : recipes.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
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
