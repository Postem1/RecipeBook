import React from 'react';

interface UserAvatarProps {
    avatarUrl?: string | null;
    username?: string | null;
    size?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl, username, size = '40px' }) => {
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-secondary)',
            border: '2px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
        }}>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={username || 'User Avatar'}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            ) : (
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: '#e0e0e0',
                    fontSize: parseInt(size) * 0.5 + 'px'
                }}>
                    {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
