import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ onLoginSuccess }) {
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
            localStorage.setItem('admin_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if (onLoginSuccess) onLoginSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-svh items-center justify-center bg-[radial-gradient(circle_at_center,#1a1a2e_0%,#0f0f16_100%)] px-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-10 shadow-2xl backdrop-blur-xl">
                <div className="mb-7 text-center">
                    <h2 className="animate-gentle-grow text-3xl font-bold tracking-tight text-white">
                        Yanol Digital
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">Administration only</p>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Username</label>
                        <input
                            type="text"
                            placeholder="e.g., Admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="rounded-lg border border-[#27273a] bg-[#14141f] px-4 py-3 text-white outline-none transition focus:border-sky-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Email Address</label>
                        <input
                            type="email"
                            placeholder="yanoldigital@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="rounded-lg border border-[#27273a] bg-[#14141f] px-4 py-3 text-white outline-none transition focus:border-sky-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="rounded-lg border border-[#27273a] bg-[#14141f] px-4 py-3 text-white outline-none transition focus:border-sky-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 rounded-lg bg-white py-3.5 text-sm font-semibold text-[#0f0f16] transition hover:bg-slate-100 disabled:opacity-60"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
