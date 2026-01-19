import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { type Recipe } from '../components/recipes/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { Clock, Users, Heart, Trash2, Edit, Share2, Lock, Unlock, UserCheck } from 'lucide-react';
import CommentSection from '../components/comments/CommentSection';
import * as Dialog from '@radix-ui/react-dialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import UserSelector from '../components/admin/UserSelector';

const RecipeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [recipe, setRecipe] = useState<Recipe & { ingredients: any, instructions: string, user_id: string, rb_profiles: { username: string | null } } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [isSharing, setIsSharing] = useState(false);
    const [shareMessage, setShareMessage] = useState<string | null>(null);
    const [showUserSelector, setShowUserSelector] = useState(false);
    const [sharedUsersVersion, setSharedUsersVersion] = useState(0);

    useEffect(() => {
        if (id) {
            fetchRecipe();
            if (user) checkFavorite();
        }
    }, [id, user]);

    const fetchRecipe = async () => {
        try {
            const { data, error } = await supabase
                .from('rb_recipes')
                .select('*, rb_profiles(username)')
                .eq('id', id)
                .single();

            if (error) throw error;
            setRecipe(data);
        } catch (error) {
            console.error('Error fetching recipe:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const checkFavorite = async () => {
        const { data } = await supabase
            .from('rb_favorites')
            .select('recipe_id')
            .eq('recipe_id', id)
            .eq('user_id', user!.id)
            .single();

        setIsFavorite(!!data);
    };

    const toggleFavorite = async () => {
        if (!user) return navigate('/login');

        if (isFavorite) {
            await supabase.from('rb_favorites').delete().eq('recipe_id', id).eq('user_id', user.id);
            setIsFavorite(false);
        } else {
            await supabase.from('rb_favorites').insert({ recipe_id: id, user_id: user.id });
            setIsFavorite(true);
        }
    };

    const togglePrivacy = async () => {
        if (!recipe) return;
        const newPrivacy = !recipe.is_private;

        const { error } = await supabase
            .from('rb_recipes')
            .update({ is_private: newPrivacy })
            .eq('id', id);

        if (!error) {
            setRecipe({ ...recipe, is_private: newPrivacy });
        }
    };

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSharing(true);
        setShareMessage(null);

        try {
            // 1. Find user by email
            const normalizedEmail = shareEmail.trim().toLowerCase();
            const { data: profiles, error: profileError } = await supabase
                .from('rb_profiles')
                .select('id')
                .eq('email', normalizedEmail)
                .single();

            if (profileError || !profiles) {
                setShareMessage(`User with email "${normalizedEmail}" not found. Please ensure the email is correct and they are registered.`);
                return;
            }

            // 2. Insert into shares
            const { error: shareError } = await supabase
                .from('rb_recipe_shares')
                .insert({
                    recipe_id: id,
                    user_id: profiles.id
                });

            if (shareError) {
                if (shareError.code === '23505') { // Unique violation
                    setShareMessage('Recipe already shared with this user.');
                } else {
                    setShareMessage('Error sharing recipe.');
                    console.error(shareError);
                }
            } else {
                setShareMessage('Recipe shared successfully!');
                setShareEmail('');
                setSharedUsersVersion(prev => prev + 1);
            }
        } finally {
            setIsSharing(false);
        }
    };

    const handleDelete = async () => {
        // Confirmation is handled by AlertDialog now

        const { error } = await supabase.from('rb_recipes').delete().eq('id', id);
        if (error) {
            // Debugging: Alert the user if deletion fails
            console.error('Error deleting recipe:', error);
            alert(`Error deleting recipe: ${error.message} (Code: ${error.code})`);
        } else {
            navigate('/');
        }
    };

    const handleReassign = async (newUserId: string) => {
        if (!recipe) return;

        const { error } = await supabase
            .from('rb_recipes')
            .update({ user_id: newUserId })
            .eq('id', id);

        if (error) {
            console.error('Error reassigning:', error);
            alert('Error reassigning recipe.');
        } else {
            // Refresh recipe to show new owner
            fetchRecipe();
        }
        setShowUserSelector(false);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
    if (!recipe) return <div>Recipe not found</div>;

    const isOwner = user?.id === recipe.user_id;
    const canModify = isOwner || isAdmin;
    const ingredientsList = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

    return (
        <div>
            <div style={{ position: 'relative', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem' }}>
                {recipe.photo_url ? (
                    <img src={recipe.photo_url} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>🍳</div>
                )}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    padding: '2rem',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {recipe.title}
                                {recipe.is_private && <div title="Private Recipe"><Lock size={32} /></div>}
                            </h1>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock /> {(recipe.prep_time || 0) + (recipe.cook_time || 0)}m</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users /> {recipe.servings} servings</span>
                            </div>
                        </div>
                        {recipe.rb_profiles?.username && (
                            <div style={{
                                fontSize: '1.2rem',
                                fontWeight: '600',
                                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                @{recipe.rb_profiles.username}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: '300px' }}>
                    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>Instructions</h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={toggleFavorite} className="btn btn-outline" style={{ color: isFavorite ? 'red' : 'inherit' }} title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
                                    <Heart fill={isFavorite ? 'red' : 'none'} size={20} />
                                </button>
                                {isOwner && (
                                    <>
                                        <button onClick={togglePrivacy} className="btn btn-outline" title={recipe.is_private ? 'Make Public' : 'Make Private'}>
                                            {recipe.is_private ? <Unlock size={20} /> : <Lock size={20} />}
                                        </button>
                                    </>
                                )}

                                {(isOwner || isAdmin) && (
                                    <Dialog.Root>
                                        <Dialog.Trigger asChild>
                                            <button className="btn btn-outline" title="Share Recipe">
                                                <Share2 size={20} />
                                            </button>
                                        </Dialog.Trigger>
                                        <Dialog.Portal>
                                            <Dialog.Overlay style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
                                            <Dialog.Content style={{
                                                position: 'fixed',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                backgroundColor: 'white',
                                                padding: '2rem',
                                                borderRadius: 'var(--radius-md)',
                                                boxShadow: 'var(--shadow-lg)',
                                                maxWidth: '450px',
                                                width: '90%',
                                                maxHeight: '85vh',
                                                overflowY: 'auto'
                                            }}>
                                                <Dialog.Title style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Share Recipe</Dialog.Title>
                                                <Dialog.Description style={{ marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>
                                                    Share this private recipe with other users by email.
                                                </Dialog.Description>

                                                <form onSubmit={handleShare} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <input
                                                            type="email"
                                                            placeholder="User Email"
                                                            value={shareEmail}
                                                            onChange={e => setShareEmail(e.target.value)}
                                                            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                                                            required
                                                        />
                                                        <button type="submit" className="btn btn-primary" disabled={isSharing}>
                                                            {isSharing ? 'Sharing...' : 'Share'}
                                                        </button>
                                                    </div>
                                                    {shareMessage && <p style={{ fontSize: '0.875rem', color: shareMessage.includes('success') ? 'green' : 'red' }}>{shareMessage}</p>}
                                                </form>

                                                <SharedUsersList key={sharedUsersVersion} recipeId={id!} />

                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                                    <Dialog.Close asChild>
                                                        <button type="button" className="btn btn-outline">Close</button>
                                                    </Dialog.Close>
                                                </div>
                                            </Dialog.Content>
                                        </Dialog.Portal>
                                    </Dialog.Root>
                                )}

                                {canModify && (
                                    <>
                                        <Link to={`/edit-recipe/${recipe.id}`} className="btn btn-outline"><Edit size={20} /></Link>

                                        {isAdmin && (
                                            <button
                                                onClick={() => setShowUserSelector(true)}
                                                className="btn btn-outline"
                                                title="Reassign Owner (Admin)"
                                                style={{ color: '#1976D2', borderColor: '#1976D2' }}
                                            >
                                                <UserCheck size={20} />
                                            </button>
                                        )}

                                        <AlertDialog.Root>
                                            <AlertDialog.Trigger asChild>
                                                <button className="btn btn-outline" style={{ color: 'var(--color-error)' }} title="Delete Recipe">
                                                    <Trash2 size={20} />
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
                                                        Are you sure you want to delete this recipe? This action cannot be undone.
                                                    </AlertDialog.Description>
                                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                                        <AlertDialog.Cancel asChild>
                                                            <button className="btn btn-outline">Cancel</button>
                                                        </AlertDialog.Cancel>
                                                        <AlertDialog.Action asChild>
                                                            <button
                                                                onClick={handleDelete}
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
                                    </>
                                )}
                            </div>
                        </div>
                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{recipe.instructions}</p>
                    </div>

                    <div className="card" style={{ padding: '2rem' }}>
                        <CommentSection recipeId={recipe.id} recipeOwnerId={recipe.user_id} />
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '250px' }}>
                    <div className="card" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Ingredients</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {ingredientsList.map((ing: string, i: number) => (
                                <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
                                    {ing}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <UserSelector
                isOpen={showUserSelector}
                onClose={() => setShowUserSelector(false)}
                onSelect={handleReassign}
                title="Reassign Recipe"
            />
        </div>
    );
};

export default RecipeDetail;

const SharedUsersList = ({ recipeId }: { recipeId: string }) => {
    const [sharedUsers, setSharedUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [userToRemove, setUserToRemove] = useState<{ id: string, email: string } | null>(null);

    const fetchSharedUsers = async () => {
        setLoading(true);
        // 1. Fetch shares
        const { data: shares, error: sharesError } = await supabase
            .from('rb_recipe_shares')
            .select('id, user_id')
            .eq('recipe_id', recipeId);

        if (sharesError) {
            console.error('Error fetching shares:', sharesError);
            setLoading(false);
            return;
        }

        if (!shares || shares.length === 0) {
            setSharedUsers([]);
            setLoading(false);
            return;
        }

        // 2. Fetch profiles for these users
        const userIds = shares.map(s => s.user_id);
        const { data: profiles, error: profilesError } = await supabase
            .from('rb_profiles')
            .select('id, email, username')
            .in('id', userIds);

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            setLoading(false);
            return;
        }

        // 3. Merge data
        const combined = shares.map(share => {
            const profile = profiles?.find(p => p.id === share.user_id);
            return {
                id: share.id, // share id
                user: profile || { email: 'Unknown', username: null }
            };
        });

        setSharedUsers(combined);
        setLoading(false);
    };

    useEffect(() => {
        fetchSharedUsers();
    }, [recipeId]);

    const handleConfirmRemove = async () => {
        if (!userToRemove) return;

        const { error } = await supabase
            .from('rb_recipe_shares')
            .delete()
            .eq('id', userToRemove.id);

        if (error) {
            alert('Failed to remove user.');
            console.error(error);
        } else {
            setSharedUsers(prev => prev.filter(item => item.id !== userToRemove.id));
        }
        setUserToRemove(null);
    };

    if (loading) return <p>Loading shared users...</p>;

    return (
        <div>
            {sharedUsers.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>Not shared with anyone yet.</p>
            ) : (
                <>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Shared With:</h4>
                    <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
                        {sharedUsers.map((share) => (
                            <li key={share.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem',
                                borderBottom: '1px solid #eee'
                            }}>
                                <span>
                                    {share.user.username ? `@${share.user.username}` : share.user.email}
                                    {share.user.username && <span style={{ color: '#888', fontSize: '0.8em', marginLeft: '0.5rem' }}>({share.user.email})</span>}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setUserToRemove({ id: share.id, email: share.user.email })}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--color-error)',
                                        cursor: 'pointer',
                                        padding: '0.25rem'
                                    }}
                                    title="Remove access"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <AlertDialog.Root open={!!userToRemove} onOpenChange={(open) => !open && setUserToRemove(null)}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 200 }} />
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
                        zIndex: 201
                    }}>
                        <AlertDialog.Title style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Revoke Access</AlertDialog.Title>
                        <AlertDialog.Description style={{ marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>
                            Are you sure you want to stop sharing this recipe with <strong>{userToRemove?.email}</strong>?
                        </AlertDialog.Description>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <AlertDialog.Cancel asChild>
                                <button className="btn btn-outline">Cancel</button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                    onClick={handleConfirmRemove}
                                    className="btn btn-primary"
                                    style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                                >
                                    Yes, Revoke
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </div>
    );
};
