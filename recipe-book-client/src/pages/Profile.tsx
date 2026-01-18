import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import UserAvatar from '../components/common/UserAvatar';

const Profile = () => {
    const { user, profile, refreshProfile, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Avatar State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Username State
    const [username, setUsername] = useState(profile?.username || '');
    const [isEditingUsername, setIsEditingUsername] = useState(false);

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            if (!user) return;

            setUploadingAvatar(true);
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('rb_profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            await refreshProfile();
            setMessage({ type: 'success', text: 'Avatar updated successfully!' });
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            setMessage({ type: 'error', text: error.message || 'Error uploading avatar' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleUsernameUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (!user) return;

            // Validate
            if (!/^[a-zA-Z0-9]{1,18}$/.test(username)) {
                throw new Error('Username must be alphanumeric and max 18 characters.');
            }

            // Check uniqueness
            const { data: existing } = await supabase
                .from('rb_profiles')
                .select('id')
                .ilike('username', username)
                .neq('id', user.id) // Exclude current user
                .single();

            if (existing) {
                throw new Error('Username is already taken.');
            }

            const { error } = await supabase
                .from('rb_profiles')
                .update({ username })
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            setMessage({ type: 'success', text: 'Username updated successfully!' });
            setIsEditingUsername(false);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (newPassword !== confirmPassword) {
                throw new Error('Passwords do not match.');
            }

            if (newPassword.length < 6) {
                throw new Error('Password must be at least 6 characters.');
            }

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Profile Settings</h1>

            {message && (
                <div style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                    {message.text}
                </div>
            )}

            {/* Avatar Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleAvatarClick} title="Change Avatar">
                    <UserAvatar
                        avatarUrl={profile?.avatar_url}
                        username={profile?.username || user.email}
                        size="100px"
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '0.4rem',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', marginBottom: '0.5rem' }}>{profile?.username}</h2>
                    <p style={{ margin: 0, color: 'var(--color-text-light)' }}>{user.email}</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                    />
                    {uploadingAvatar && <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', marginTop: '0.5rem' }}>Uploading...</p>}
                </div>
            </div>

            {/* Username Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>Username</h3>
                {isEditingUsername ? (
                    <form onSubmit={handleUsernameUpdate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>New Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Alphanumeric, max 18 chars"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)'
                                }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>Save</button>
                        <button
                            type="button"
                            className="btn"
                            style={{ border: '1px solid var(--color-border)' }}
                            onClick={() => { setIsEditingUsername(false); setUsername(profile?.username || ''); }}
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '1.1rem', margin: 0 }}>{profile?.username}</p>
                        <button
                            onClick={() => setIsEditingUsername(true)}
                            className="btn"
                            style={{ border: '1px solid var(--color-border)' }}
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>

            {/* Password Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>Change Password</h3>
                <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)'
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !newPassword}
                        style={{ alignSelf: 'flex-start' }}
                    >
                        Update Password
                    </button>
                </form>
            </div>

            <button
                onClick={handleSignOut}
                className="btn"
                style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: 'var(--color-error)',
                    borderColor: 'var(--color-error)',
                    border: '1px solid'
                }}
            >
                Sign Out
            </button>
        </div>
    );
};

export default Profile;
