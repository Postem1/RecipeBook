import { useEffect, useState } from 'react'; import { supabase } from '../lib/supabase';
import RecipeCard, { type Recipe } from '../components/recipes/RecipeCard'; import { Search } from 'lucide-react';

const Home = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'];

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            // Fetch public recipes
            const { data, error } = await supabase
                .from('rb_recipes')
                .select('*')
                .eq('is_private', false)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setRecipes(data || []);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase()));

        // Note: Simple category filter. For strict category matching, ensure case sensitivity if needed.
        // Assuming category is stored capitalized.
        const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <section style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    Share & Discover Recipes
                </h1>
                <p style={{ color: 'var(--color-text-light)', fontSize: '1.25rem' }}>
                    Your personal cookbook and culinary community.
                </p>
            </section>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        flex: 1,
                        minWidth: '250px'
                    }}>
                        <Search size={20} color="var(--color-text-light)" />
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                paddingLeft: '0.5rem',
                                width: '100%',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading recipes...</div>
            ) : filteredRecipes.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {filteredRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-light)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥗</div>
                    <p>No recipes found. Be the first to share one!</p>
                </div>
            )}
        </div>
    );
};

export default Home;
