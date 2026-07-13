// src/components/Login.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
    const [loginVal, setLoginVal] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/login', { login: loginVal, password });
            localStorage.setItem('admin_token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if (onLoginSuccess) onLoginSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-950 font-sans antialiased selection:bg-sky-500/10 selection:text-sky-400">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-sky-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

            {/* Symmetrical Fixed-Ratio Container */}
            <div className="relative w-full max-w-md mx-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-10 shadow-2xl backdrop-blur-xl transition-all duration-300">

                {/* Header Block */}
                <div className="mb-8 text-center">
                    <h2 className="bg-gradient-to-r from-white via-sky-400 to-indigo-400 bg-clip-text text-3xl font-black tracking-tight text-transparent">
                        Yanol Digital
                    </h2>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                        Administration Node
                    </p>
                </div>

                {/* Error Box matching perfectly with spacing */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3.5 text-sm font-medium text-red-400 animate-fadeIn">
                        <AlertCircle size={18} className="shrink-0" />
                        <p className="truncate">{error}</p>
                    </div>
                )}

                {/* Input Fields & Actions Engine */}
                <form onSubmit={handleLogin} className="flex flex-col gap-5">

                    {/* Identity Slot */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                            Username or Email
                        </label>
                        <div className="relative flex items-center">
                            <User size={16} className="absolute left-4 text-slate-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="admin or email@example.com"
                                value={loginVal}
                                onChange={(e) => setLoginVal(e.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-11 pr-4 text-sm font-semibold text-white placeholder-slate-600 outline-none ring-sky-500/20 transition focus:border-sky-500/80 focus:bg-slate-950 focus:ring-4"
                            />
                        </div>
                    </div>

                    {/* Secure Password Slot */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <Lock size={16} className="absolute left-4 text-slate-500 transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-11 pr-4 text-sm font-semibold text-white placeholder-slate-600 outline-none ring-sky-500/20 transition focus:border-sky-500/80 focus:bg-slate-950 focus:ring-4"
                            />
                        </div>
                    </div>

                    {/* Uniform Interactive Trigger Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-3 flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-sm font-bold text-white shadow-lg shadow-sky-500/10 transition-all duration-200 hover:from-sky-400 hover:to-sky-500 hover:shadow-sky-500/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin text-white" />
                        ) : (
                            'Sign In to Dashboard'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}