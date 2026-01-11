import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';

interface Comment {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    user_email?: string; // We'll try to fetch this
}

interface CommentSectionProps {
    recipeId: string;
    recipeOwnerId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ recipeId, recipeOwnerId }) => {
    const { user, isAdmin } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [recipeId]);

    const fetchComments = async () => {
        // 1. Fetch comments
        const { data: commentsData, error } = await supabase
            .from('rb_comments')
            .select('*')
            .eq('recipe_id', recipeId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching comments:', error);
            return;
        }

        // 2. Fetch user emails from rb_profiles (if we had them synced) or just display ID for now
        // Since we don't have a reliable name source without joining auth.users (which we can't do from client easily), 
        // we will rely on what we have. 
        // Actually, let's try to fetch emails from rb_profiles if we populated it.
        // If rb_profiles is empty, we might need to rely on the current session for the current user, 
        // but for others we can't see valid names.

        // Simplification: Just show comments.
        setComments(commentsData || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setLoading(true);
        const { error } = await supabase
            .from('rb_comments')
            .insert({
                recipe_id: recipeId,
                user_id: user.id,
                content: newComment.trim()
            });

        if (error) {
            alert('Error posting comment');
        } else {
            setNewComment('');
            fetchComments();
        }
        setLoading(false);
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Delete comment?')) return;

        const { error } = await supabase
            .from('rb_comments')
            .delete()
            .eq('id', commentId);

        if (!error) {
            fetchComments();
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Comments</h2>

            {user ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '0.5rem' }}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading || !newComment.trim()}>
                        {loading ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            ) : (
                <p style={{ marginBottom: '2rem', color: 'var(--color-text-light)' }}>Please login to comment.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {comments.map(comment => {
                    const isOwner = user?.id === comment.user_id;
                    const isRecipeOwner = user?.id === recipeOwnerId;
                    const canDelete = isOwner || isRecipeOwner || isAdmin;

                    return (
                        <div key={comment.id} style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                                    {isOwner ? 'You' : 'User'}
                                    <span style={{ fontWeight: 'normal', color: '#999', marginLeft: '0.5rem' }}>
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </span>
                                {canDelete && (
                                    <button onClick={() => handleDelete(comment.id)} style={{ color: 'var(--color-error)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            <p>{comment.content}</p>
                        </div>
                    );
                })}
                {comments.length === 0 && <p style={{ color: '#999', fontStyle: 'italic' }}>No comments yet.</p>}
            </div>
        </div>
    );
};

export default CommentSection;
