import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Registering with:', { email, password });
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Auto login or redirect
            navigate('/');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Sign Up</h2>

                {error && (
                    <div style={{
                        backgroundColor: 'var(--color-error)',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)'
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
