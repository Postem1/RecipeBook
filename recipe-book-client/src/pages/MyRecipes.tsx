import { useEffect, useState } from 'react'; import { supabase } from '../lib/supabase';
import RecipeCard, { type Recipe } from '../components/recipes/RecipeCard'; import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const MyRecipes = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchMyRecipes();
    }, [user]);

    const fetchMyRecipes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('rb_recipes')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRecipes(data || []);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    <p style={{ marginBottom: '1rem', color: 'var(--color-text-light)' }}>You haven't created any recipes yet.</p>
                    <Link to="/create-recipe" className="btn btn-primary">Create Your First Recipe</Link>
                </div>
            )}
        </div>
    );
};

export default MyRecipes;
