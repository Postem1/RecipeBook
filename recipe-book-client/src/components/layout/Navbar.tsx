import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { Menu, X } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';

const Navbar = () => {
    const { user, profile, isAdmin } = useAuth();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Only use transparent theme on Home page when not scrolled
    const isHome = location.pathname === '/';
    const showDarkNav = !isHome || isScrolled;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else if (window.scrollY < 10) {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const linkStyle = (path: string) => ({
        textDecoration: 'none',
        color: isActive(path)
            ? 'var(--color-primary-hover)'
            : (showDarkNav ? 'var(--color-text-primary)' : 'rgba(255,255,255,0.95)'),
        fontWeight: '600',
        fontSize: '1.1rem',
        padding: '0.5rem 1rem',
        transition: 'color 0.2s ease',
        textShadow: showDarkNav ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
    });

    return (
        <>
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                padding: showDarkNav ? '1rem 0' : '2rem 0',
                backgroundColor: showDarkNav ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                backdropFilter: showDarkNav ? 'blur(12px)' : 'none',
                WebkitBackdropFilter: showDarkNav ? 'blur(12px)' : 'none',
                boxShadow: showDarkNav ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.3s ease',
                marginBottom: showDarkNav ? '2rem' : '2rem' // Keep margin consistent or adjust as needed
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: showDarkNav ? 'var(--color-text-primary)' : 'white',
                        letterSpacing: '-0.02em',
                        textDecoration: 'none',
                        textShadow: showDarkNav ? 'none' : '0 2px 4px rgba(0,0,0,0.2)',
                        gap: '0.5rem'
                    }}>
                        <img src={logo} alt="RecipeBook Logo" style={{
                            height: '32px',
                            width: 'auto',
                            objectFit: 'contain'
                        }} />
                        <span>RecipeBook<span style={{ color: 'var(--color-primary)' }}>.</span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden-mobile" style={{ gap: '1.5rem', alignItems: 'center' }}>
                        <Link to="/" style={linkStyle('/')}>Discover</Link>

                        {user ? (
                            <>
                                {isAdmin && <Link to="/admin" style={{ ...linkStyle('/admin'), color: 'var(--color-primary)' }}>Admin</Link>}
                                <Link to="/my-recipes" style={linkStyle('/my-recipes')}>My Recipes</Link>
                                <Link to="/shared" style={linkStyle('/shared')}>Shared</Link>
                                <Link to="/favorites" style={linkStyle('/favorites')}>Favorites</Link>
                                <Link to="/profile" style={{ textDecoration: 'none', marginLeft: '1rem' }}>
                                    <UserAvatar
                                        avatarUrl={profile?.avatar_url}
                                        username={profile?.username || user.email}
                                        size="40px"
                                    />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={linkStyle('/login')}>Login</Link>
                                <Link to="/register" className="btn btn-primary">Sign Up</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Trigger */}
                    <button
                        className="hidden-desktop"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ color: showDarkNav ? 'var(--color-text-primary)' : 'white' }}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--color-bg-white)',
                        padding: '1.5rem',
                        boxShadow: 'var(--shadow-lg)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        borderTop: '1px solid var(--color-border)',
                        animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={linkStyle('/')}>Discover</Link>
                        {user ? (
                            <>
                                {isAdmin && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ ...linkStyle('/admin'), color: 'var(--color-primary)' }}>Admin Dashboard</Link>}
                                <Link to="/my-recipes" onClick={() => setIsMobileMenuOpen(false)} style={linkStyle('/my-recipes')}>My Recipes</Link>
                                <Link to="/shared" onClick={() => setIsMobileMenuOpen(false)} style={linkStyle('/shared')}>Shared With Me</Link>
                                <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} style={linkStyle('/favorites')}>Favorites</Link>
                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--color-text-primary)' }}>
                                        <UserAvatar avatarUrl={profile?.avatar_url} username={profile?.username || user.email} size="32px" />
                                        <span>My Profile</span>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ textAlign: 'center', padding: '0.75rem', fontWeight: '600' }}>Login</Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ justifyContent: 'center' }}>Sign Up</Link>
                            </div>
                        )}
                    </div>
                )}
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
