import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const location = useLocation();

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
        <nav style={{
            padding: '2rem 0',
            backgroundColor: 'transparent',
            marginBottom: '2rem'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.02em'
                }}>
                    RecipeBook<span style={{ color: 'var(--color-primary)' }}>.</span>
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
    );
};

export default Navbar;
