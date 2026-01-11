import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, signOut } = useAuth();

    return (
        <nav style={{
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-sm)',
            padding: '1rem 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    RecipeBook
                </Link>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/" className="btn btn-outline">Discover</Link>

                    {user ? (
                        <>
                            <Link to="/my-recipes" className="btn btn-outline">My Recipes</Link>
                            <Link to="/shared" className="btn btn-outline">Shared with Me</Link>
                            <Link to="/favorites" className="btn btn-outline">Favorites</Link>
                            <button onClick={() => signOut()} className="btn btn-outline">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary">Login</Link>
                            <Link to="/register" className="btn btn-outline">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
