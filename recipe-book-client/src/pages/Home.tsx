import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RecipeCard, { type Recipe } from '../components/recipes/RecipeCard';
import { Search } from 'lucide-react';

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
        const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            {/* Hero Section with Organic Shape Background */}
            <section style={{
                textAlign: 'center',
                padding: '6rem 0 8rem',
                position: 'relative',
                marginBottom: '2rem'
            }}>
                {/* Decorative Background Shape */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '600px',
                    height: '600px',
                    backgroundColor: 'rgba(244, 208, 63, 0.15)', // var(--color-primary) with opacity
                    borderRadius: '44% 56% 45% 55% / 37% 38% 62% 63%',
                    zIndex: -1,
                    filter: 'blur(60px)'
                }} />

                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '-10%',
                    width: '400px',
                    height: '400px',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)', // var(--color-secondary) with opacity
                    borderRadius: '56% 44% 73% 27% / 37% 68% 32% 63%',
                    zIndex: -1,
                    filter: 'blur(50px)'
                }} />

                <h1 style={{
                    fontSize: '4rem',
                    marginBottom: '1.5rem',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.03em',
                    lineHeight: '1.1'
                }}>
                    Fresh & <span style={{ color: 'var(--color-secondary)' }}>Organic</span><br />
                    Recipe Collection
                </h1>
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '1.35rem',
                    maxWidth: '600px',
                    margin: '0 auto 4rem',
                    lineHeight: '1.6'
                }}>
                    Discover delicious meals for every occasion. Curated by our community of food lovers.
                </p>

                {/* Floating Search Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '3rem',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'var(--color-bg-white)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '50px',
                        boxShadow: 'var(--shadow-hover)',
                        width: '100%',
                        maxWidth: '600px',
                        border: '1px solid var(--color-border)'
                    }}>
                        <Search size={24} color="var(--color-text-secondary)" />
                        <input
                            type="text"
                            placeholder="What are you craving today?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                paddingLeft: '1rem',
                                width: '100%',
                                fontSize: '1.1rem',
                                color: 'var(--color-text-primary)',
                                fontWeight: '500'
                            }}
                        />
                    </div>
                </div>

                {/* Category Pills */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    padding: '0 1rem'
                }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '50px',
                                border: selectedCategory === cat ? 'none' : '2px solid var(--color-border)',
                                backgroundColor: selectedCategory === cat ? 'var(--color-text-primary)' : 'transparent',
                                color: selectedCategory === cat ? '#fff' : 'var(--color-text-secondary)',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: selectedCategory === cat ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Content Grid */}
            <div style={{ paddingBottom: '6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>
                        {selectedCategory === 'All' ? 'Latest Recipes' : `${selectedCategory} Recipes`}
                    </h2>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Loading deliciousness...</div>
                    </div>
                ) : filteredRecipes.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '3rem'
                    }}>
                        {filteredRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '6rem',
                        color: 'var(--color-text-light)',
                        backgroundColor: 'var(--color-bg-white)',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px dashed var(--color-border)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🥗</div>
                        <p style={{ fontSize: '1.25rem', fontWeight: '500' }}>No recipes found matching your search.</p>
                        <p>Try adjusted your filters or be the first to share one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
