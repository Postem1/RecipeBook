import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Users, BookOpen, Trash2, Edit, Search, BarChart3, LayoutDashboard } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

// Types
interface Profile {
    id: string;
    email: string;
    username: string | null;
    role: string;
    created_at?: string;
}

interface Recipe {
    id: string;
    title: string;
    description: string;
    is_private: boolean;
    user_id: string;
    created_at: string;
    user_email?: string; // Derived for display
}

const AdminDashboard = () => {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'recipes'>('overview');

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && !isAdmin) {
            navigate('/');
        } else if (isAdmin) {
            fetchData();
        }
    }, [isAdmin, authLoading, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Profiles
            const { data: profilesData, error: profilesError } = await supabase
                .from('rb_profiles')
                .select('*')
                .order('role', { ascending: true }); // Admins first usually, or alphabetical

            if (profilesError) throw profilesError;
            setProfiles(profilesData || []);

            // Fetch All Recipes (RLS allows admins to see private)
            const { data: recipesData, error: recipesError } = await supabase
                .from('rb_recipes')
                .select('*')
                .order('created_at', { ascending: false });

            if (recipesError) throw recipesError;
            setRecipes(recipesData || []);

        } catch (error) {
            console.error('Error fetching admin data:', error);
            alert('Error loading dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string, email: string) => {
        // Confirmation handled by AlertDialog

        try {
            // Call the RPC function we created
            const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userId });

            if (error) throw error;

            // Update local state
            setProfiles(profiles.filter(p => p.id !== userId));
            setRecipes(recipes.filter(r => r.user_id !== userId)); // Remove their recipes from view too
            alert(`User ${email} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }
    };

    const handleDeleteRecipe = async (recipeId: string) => {
        // Confirmation handled by AlertDialog

        const { error } = await supabase.from('rb_recipes').delete().eq('id', recipeId);

        if (error) {
            console.error('Error deleting recipe:', error);
            alert(`Failed to delete recipe: ${error.message} (Code: ${error.code})`);
        } else {
            setRecipes(recipes.filter(r => r.id !== recipeId));
        }
    };

    const toggleRecipePrivacy = async (recipeId: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('rb_recipes')
            .update({ is_private: !currentStatus })
            .eq('id', recipeId);

        if (!error) {
            setRecipes(recipes.map(r => r.id === recipeId ? { ...r, is_private: !currentStatus } : r));
        }
    };

    // Derived Stats
    const totalUsers = profiles.length;
    const totalRecipes = recipes.length;
    const privateRecipes = recipes.filter(r => r.is_private).length;

    // Filter Logic
    const filteredUsers = profiles.filter(p => p.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredRecipes = recipes.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (authLoading || loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>Loading Admin Dashboard...</div>
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-text-primary)' }}>Superuser Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'var(--color-bg-white)', padding: '0.5rem', borderRadius: '50px', boxShadow: 'var(--shadow-sm)' }}>
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'users', icon: Users, label: 'Users' },
                        { id: 'recipes', icon: BookOpen, label: 'Recipes' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '50px',
                                border: 'none',
                                backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                                color: activeTab === tab.id ? '#fff' : 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: '#E3F2FD', borderRadius: '50%', color: '#2196F3' }}>
                            <Users size={40} />
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{totalUsers}</div>
                            <div style={{ color: 'var(--color-text-secondary)' }}>Total Users</div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: '#E8F5E9', borderRadius: '50%', color: '#4CAF50' }}>
                            <BookOpen size={40} />
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{totalRecipes}</div>
                            <div style={{ color: 'var(--color-text-secondary)' }}>Total Recipes</div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: '#FFF3E0', borderRadius: '50%', color: '#FF9800' }}>
                            <BarChart3 size={40} />
                        </div>
                        <div>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{privateRecipes}</div>
                            <div style={{ color: 'var(--color-text-secondary)' }}>Private Recipes</div>
                        </div>
                    </div>
                </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>User Management</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '50px' }}>
                            <Search size={18} color="#999" />
                            <input
                                type="text"
                                placeholder="Search email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none' }}
                            />
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem' }}>Email</th>
                                    <th style={{ textAlign: 'left', padding: '1rem' }}>Username</th>
                                    <th style={{ textAlign: 'left', padding: '1rem' }}>Role</th>
                                    <th style={{ textAlign: 'left', padding: '1rem' }}>ID</th>
                                    <th style={{ textAlign: 'right', padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(profile => (
                                    <tr key={profile.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{profile.email}</td>
                                        <td style={{ padding: '1rem' }}>{profile.username || '-'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                backgroundColor: profile.role === 'admin' ? '#E3F2FD' : '#F5F5F5',
                                                color: profile.role === 'admin' ? '#2196F3' : '#666',
                                                fontSize: '0.85rem',
                                                fontWeight: '600'
                                            }}>
                                                {profile.role || 'user'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#999', fontSize: '0.85rem' }}>{profile.id.slice(0, 8)}...</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            {profile.id !== user?.id && (
                                                <AlertDialog.Root>
                                                    <AlertDialog.Trigger asChild>
                                                        <button
                                                            className="btn"
                                                            style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                        >
                                                            <Trash2 size={16} style={{ marginRight: '0.5rem' }} /> Delete
                                                        </button>
                                                    </AlertDialog.Trigger>
                                                    <AlertDialog.Portal>
                                                        <AlertDialog.Overlay style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 100 }} />
                                                        <AlertDialog.Content style={{
                                                            position: 'fixed',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            backgroundColor: 'white',
                                                            padding: '2rem',
                                                            borderRadius: 'var(--radius-md)',
                                                            boxShadow: 'var(--shadow-lg)',
                                                            maxWidth: '500px',
                                                            width: '90%',
                                                            zIndex: 101
                                                        }}>
                                                            <AlertDialog.Title style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Delete User "{profile.email}"?</AlertDialog.Title>
                                                            <AlertDialog.Description style={{ marginBottom: '1.5rem', color: 'var(--color-text-light)', lineHeight: '1.6' }}>
                                                                <strong style={{ color: 'var(--color-error)' }}>DANGER ZONE</strong><br />
                                                                This will <strong>PERMANENTLY DELETE</strong> this user, all their recipes, comments, and associated data.<br />
                                                                This action cannot be undone.
                                                            </AlertDialog.Description>
                                                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                                                <AlertDialog.Cancel asChild>
                                                                    <button className="btn btn-outline">Cancel</button>
                                                                </AlertDialog.Cancel>
                                                                <AlertDialog.Action asChild>
                                                                    <button
                                                                        onClick={() => handleDeleteUser(profile.id, profile.email)}
                                                                        className="btn btn-primary"
                                                                        style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                                                                    >
                                                                        Yes, Permanently Delete
                                                                    </button>
                                                                </AlertDialog.Action>
                                                            </div>
                                                        </AlertDialog.Content>
                                                    </AlertDialog.Portal>
                                                </AlertDialog.Root>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* RECIPES TAB */}
            {activeTab === 'recipes' && (
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Recipe Management</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '50px' }}>
                            <Search size={18} color="#999" />
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none' }}
                            />
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem' }}>Title</th>
                                    <th style={{ textAlign: 'left', padding: '1rem' }}>Owner ID</th>
                                    <th style={{ textAlign: 'center', padding: '1rem' }}>Visibility</th>
                                    <th style={{ textAlign: 'right', padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecipes.map(recipe => (
                                    <tr key={recipe.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>
                                            <Link to={`/edit-recipe/${recipe.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                {recipe.title}
                                            </Link>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#999', fontSize: '0.85rem' }}>{recipe.user_id.slice(0, 8)}...</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => toggleRecipePrivacy(recipe.id, recipe.is_private)}
                                                style={{
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    color: recipe.is_private ? '#FF9800' : '#4CAF50'
                                                }}
                                                title={recipe.is_private ? "Make Public" : "Make Private"}
                                            >
                                                {recipe.is_private ? 'Private 🔒' : 'Public 🌍'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <Link to={`/edit-recipe/${recipe.id}`} className="btn" style={{ padding: '0.5rem', backgroundColor: '#F5F5F5' }}>
                                                <Edit size={16} />
                                            </Link>
                                            <AlertDialog.Root>
                                                <AlertDialog.Trigger asChild>
                                                    <button
                                                        className="btn"
                                                        style={{ padding: '0.5rem', backgroundColor: '#FFEBEE', color: '#D32F2F' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </AlertDialog.Trigger>
                                                <AlertDialog.Portal>
                                                    <AlertDialog.Overlay style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 100 }} />
                                                    <AlertDialog.Content style={{
                                                        position: 'fixed',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        backgroundColor: 'white',
                                                        padding: '2rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        boxShadow: 'var(--shadow-lg)',
                                                        maxWidth: '400px',
                                                        width: '90%',
                                                        zIndex: 101
                                                    }}>
                                                        <AlertDialog.Title style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Delete Recipe?</AlertDialog.Title>
                                                        <AlertDialog.Description style={{ marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>
                                                            Are you sure you want to delete <strong>"{recipe.title}"</strong>?<br />
                                                            This action cannot be undone.
                                                        </AlertDialog.Description>
                                                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                                            <AlertDialog.Cancel asChild>
                                                                <button className="btn btn-outline">Cancel</button>
                                                            </AlertDialog.Cancel>
                                                            <AlertDialog.Action asChild>
                                                                <button
                                                                    onClick={() => handleDeleteRecipe(recipe.id)}
                                                                    className="btn btn-primary"
                                                                    style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                                                                >
                                                                    Yes, Delete
                                                                </button>
                                                            </AlertDialog.Action>
                                                        </div>
                                                    </AlertDialog.Content>
                                                </AlertDialog.Portal>
                                            </AlertDialog.Root>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
