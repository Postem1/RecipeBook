import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Profile {
    id: string;
    email: string;
    username: string | null;
}

interface UserSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (userId: string) => void;
    title?: string;
}

const UserSelector: React.FC<UserSelectorProps> = ({ isOpen, onClose, onSelect, title = 'Select User' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('rb_profiles')
                .select('id, email, username')
                .limit(50); // Fetch first 50 initially

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.length < 2) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('rb_profiles')
                .select('id, email, username')
                .or(`email.ilike.%${term}%,username.ilike.%${term}%`)
                .limit(20);

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }} />
                <Dialog.Content style={{
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
                    zIndex: 1001,
                    maxHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Dialog.Title style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</Dialog.Title>

                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                        <input
                            type="text"
                            placeholder="Search by email or username..."
                            value={searchTerm}
                            onChange={e => handleSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border)',
                                fontSize: '1rem'
                            }}
                            autoFocus
                        />
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                        {loading && <div style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>Loading...</div>}

                        {!loading && users.length === 0 && (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>No users found</div>
                        )}

                        {!loading && users.map(user => (
                            <button
                                key={user.id}
                                onClick={() => onSelect(user.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: '1rem',
                                    border: 'none',
                                    borderBottom: '1px solid var(--color-border)',
                                    backgroundColor: 'transparent',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    gap: '1rem',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E3F2FD',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2196F3'
                                }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{user.username || 'No Username'}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{user.email}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button onClick={onClose} className="btn btn-outline">Cancel</button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default UserSelector;
