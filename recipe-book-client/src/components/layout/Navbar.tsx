import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const linkStyle = (path: string) => ({
        textDecoration: 'none',
        color: isActive(path) ? 'var(--color-primary-hover)' : 'var(--color-text-primary)',
        fontWeight: '600',
        fontSize: '1.1rem',
        padding: '0.5rem 1rem',
        transition: 'color 0.2s ease'
    });

    return (
        <>
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                padding: isScrolled ? '1rem 0' : '2rem 0',
                backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
                boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.3s ease',
                marginBottom: isScrolled ? '2rem' : '2rem' // Keep margin consistent or adjust as needed
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-0.02em',
                        textDecoration: 'none',
                        gap: '0.75rem'
                    }}>
                        <img src={logo} alt="RecipeBook Logo" style={{
                            height: '40px',
                            width: 'auto',
                            objectFit: 'contain'
                        }} />
                        <span>RecipeBook<span style={{ color: 'var(--color-primary)' }}>.</span></span>
                    </Link>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link to="/" style={linkStyle('/')}>Discover</Link>

                        {user ? (
                            <>
                                <Link to="/my-recipes" style={linkStyle('/my-recipes')}>My Recipes</Link>
                                <Link to="/shared" style={linkStyle('/shared')}>Shared</Link>
                                <Link to="/favorites" style={linkStyle('/favorites')}>Favorites</Link>
                                <button
                                    onClick={() => signOut()}
                                    className="btn btn-primary"
                                    style={{ marginLeft: '1rem' }}
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={linkStyle('/login')}>Login</Link>
                                <Link to="/register" className="btn btn-primary">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            {/* 
                Since we are using position: sticky, the element stays in flow until it sticks. 
                Unlike position: fixed, we don't strictly need a spacer div, but often 
                sticky can be Tricky with margins. The current implementation uses sticky 
                relative to its parent (likely body/root).
            */}
        </>
    );
};

export default Navbar;
