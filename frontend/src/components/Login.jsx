import React, { useState } from 'react';
import api from '../services/api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/login', { username, email, password });
            localStorage.setItem('token', response.data.token);
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.headerContainer}>
                    <h2 style={styles.title}>Yanol Digital</h2>
                    <p style={styles.subtitle}>This is for Administration only</p>
                </div>

                {error && <div style={styles.errorBadge}>{error}</div>}

                <form onSubmit={handleLogin} style={styles.form}>
                    {/* Username Field */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            placeholder="e.g.,yanol Tech"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    {/* Email Field */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            placeholder="yanoldigital@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    {/* Password Field */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Unified Premium Stylesheet Object
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f16 100%)',
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        padding: '2.5rem 2.2rem',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    },
    headerContainer: {
        textAlign: 'center',
        marginBottom: '1.75rem',
    },
    title: {
        color: '#ffffff',
        fontSize: '1.75rem',
        fontWeight: '700',
        letterSpacing: '-0.025em',
        margin: '0 0 0.25rem 0',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '0.875rem',
        margin: 0,
    },
    errorBadge: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        color: '#f87171',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        marginBottom: '1.25rem',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.1rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
    },
    label: {
        color: '#94a3b8',
        fontSize: '0.8rem',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    input: {
        background: '#14141f',
        border: '1px solid #27273a',
        borderRadius: '8px',
        padding: '0.8rem 1rem',
        color: '#ffffff',
        fontSize: '0.95rem',
        outline: 'none',
    },
    button: {
        background: '#ffffff',
        color: '#0f0f16',
        border: 'none',
        borderRadius: '8px',
        padding: '0.85rem',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '0.75rem',
    },
};