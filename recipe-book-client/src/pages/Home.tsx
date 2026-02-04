import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import RecipeCard, { type Recipe } from '../components/recipes/RecipeCard';
import Pagination from '../components/common/Pagination';
import { Search } from 'lucide-react';

const Home = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const ITEMS_PER_PAGE = 10;
    const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'];

    const recipesSectionRef = useRef<HTMLDivElement>(null);

    // Debounce search term to prevent rapid API calls
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search change
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Initial load
    useEffect(() => {
        fetchRecipes();
    }, []);

    // Fetch on changes
    useEffect(() => {
        fetchRecipes();
        // Scroll to top of recipes section when page changes, but maybe not on initial load/filter change if we want to be subtle?
        // User asked: "Instead of scrolling all the way to the top ... go to the first visible row"
        if (recipesSectionRef.current) {
            const yOffset = -100; // Offset for sticky headers if any, or just breathing room
            const element = recipesSectionRef.current;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [currentPage, debouncedSearchTerm, selectedCategory]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to page 1 on category change
    };

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('rb_recipes')
                .select('*, rb_profiles(username)', { count: 'exact' })
                .eq('is_private', false)
                .order('created_at', { ascending: false });

            // Apply Search Filter (Server-side)
            if (debouncedSearchTerm) {
                // Using .or to search in title OR description
                // Note: This requires the columns to be text type, which they likely are.
                query = query.or(`title.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%`);
            }

            // Apply Category Filter (Server-side)
            if (selectedCategory !== 'All') {
                query = query.eq('category', selectedCategory);
            }

            // Apply Pagination
            const from = (currentPage - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;
            query = query.range(from, to);

            const { data, count, error } = await query;

            if (error) throw error;
            setRecipes(data || []);
            setTotalCount(count || 0);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                minHeight: '80vh', // Allow growth
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: '4rem',
                color: 'white',
                paddingTop: '6rem', // Add top padding for spacing (navbar)
                paddingBottom: '4rem', // Ensure bottom content isn't cut
                // overflow: 'hidden' -> Removed to prevent clipping
            }}>
                {/* Background Image with Parallax-like fixed attachment */}
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100vh',
                    zIndex: -1,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=1920")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: `translateY(${window.scrollY * 0.5}px)`,
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)', // Lighter overlay for vibrancy
                        background: 'linear-gradient(to bottom, rgba(45, 55, 72, 0.4), rgba(247, 249, 252, 1))'
                    }} />
                </div>

                {/* Hero Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%', // Ensure it doesn't exceed parent/viewport
                    maxWidth: '800px',
                    padding: '0 1rem',
                    animation: 'fadeInUp 0.8s ease-out forwards'
                }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        marginBottom: '1.5rem',
                        color: 'white',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        lineHeight: '1.1'
                    }}>
                        Taste the <span style={{ color: 'var(--color-primary)' }}>Energy</span>
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                        marginBottom: '3rem',
                        lineHeight: '1.6',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                        Discover vibrant, healthy recipes that fuel your day. Join our community of food lovers.
                    </p>

                    {/* Floating Search Bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '50px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            width: '450px',
                            maxWidth: '90%',
                            backdropFilter: 'blur(10px)',
                            transform: 'translateY(0)',
                            transition: 'transform 0.3s ease'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Search size={24} color="var(--color-primary)" />
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
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-text-primary)',
                                    fontWeight: '500'
                                }}
                            />
                        </div>
                    </div>

                    {/* Quick Category Pills */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        flexWrap: 'wrap'
                    }}>
                        {categories.slice(0, 4).map((cat, i) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`delay-${(i + 1) * 100}`}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '50px',
                                    border: selectedCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.4)',
                                    backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'rgba(0,0,0,0.4)',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(4px)',
                                    transition: 'all 0.2s ease',
                                    animation: 'fadeInUp 0.6s ease-out forwards',
                                    opacity: 0
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <div style={{ paddingBottom: '6rem' }} ref={recipesSectionRef}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>
                        {selectedCategory === 'All' ? 'Latest Recipes' : `${selectedCategory} Recipes`}
                    </h2>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Loading deliciousness...</div>
                    </div>
                ) : recipes.length > 0 ? (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '3rem'
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
        </div >
    );
};

export default Home;
