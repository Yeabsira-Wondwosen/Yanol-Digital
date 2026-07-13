// src/components/SettingsView.jsx
import React, { useState, useEffect } from 'react';
import { Check, Sun, Moon, Bell, Globe, Building2, Save } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';

export default function SettingsView({ userName, setUserName, showToast }) {
    const [nameDraft, setNameDraft] = useState(userName);
    const [notifPrefs, setNotifPrefs] = useState({ newQuote: true, accepted: true, reminders: false });
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState('en');
    const [isSaving, setIsSaving] = useState(false);

    // Keep the local text input field perfectly synchronized if userName updates from elsewhere
    useEffect(() => {
        setNameDraft(userName);
    }, [userName]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // 1. Instantly update the parent state context across the whole layout
            setUserName(nameDraft);

            // 2. Persist the user profile preference values locally
            localStorage.setItem('user', JSON.stringify({ name: nameDraft, language }));

            showToast('Profile updated successfully!');
        } catch (err) {
            console.error("Error saving settings:", err);
            showToast('Failed to save profile updates.');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleNotif = (key) => {
        setNotifPrefs((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            showToast('Notification preferences updated.');
            return next;
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 p-4 font-sans antialiased">
            {/* Structural Title Section */}
            <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Manage your profile configurations and notification preferences.
                </p>
            </div>

            {/* Profile Update Panel */}
            <form onSubmit={handleSave} className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 shadow-sm space-y-6 backdrop-blur-md transition-all">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Identity</h3>
                    <p className="text-xs text-slate-500 font-medium">Update your account system display name.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Display Name
                    </label>
                    <input
                        type="text"
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        required
                        className="w-full rounded-xl border border-sky-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 px-4 py-3 text-base font-semibold text-slate-800 dark:text-slate-200 outline-none ring-sky-500/10 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-4 transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/10 transition hover:from-sky-500 hover:to-sky-600 active:scale-[0.98] disabled:opacity-50"
                >
                    <Save size={16} /> {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </form>

            {/* Appearance System Engine */}
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 shadow-sm space-y-5 backdrop-blur-md transition-all">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Appearance Layout</h3>
                    <p className="text-xs text-slate-500 font-medium">Choose how the interface environment looks on your current device.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => { setTheme('light'); showToast('Switched to Light mode.'); }}
                        className={`flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-sm font-bold transition-all ${theme === 'light' || theme !== 'dark'
                                ? 'border-sky-500 bg-sky-50/60 text-sky-800 dark:bg-sky-950/20 dark:text-sky-400'
                                : 'border-sky-100/70 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 hover:border-sky-300 dark:hover:border-slate-700'
                            }`}
                    >
                        <Sun size={18} className="text-amber-500" /> Light mode
                        {(theme === 'light' || theme !== 'dark') && <Check size={16} className="ml-auto text-sky-600" />}
                    </button>

                    <button
                        type="button"
                        onClick={() => { setTheme('dark'); showToast('Switched to Dark mode.'); }}
                        className={`flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-sm font-bold transition-all ${theme === 'dark'
                                ? 'border-sky-500 bg-sky-50/60 text-sky-800 dark:bg-sky-950/20 dark:text-sky-400'
                                : 'border-sky-100/70 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 hover:border-sky-300 dark:hover:border-slate-700'
                            }`}
                    >
                        <Moon size={18} className="text-indigo-400" /> Dark mode
                        {theme === 'dark' && <Check size={16} className="ml-auto text-sky-400" />}
                    </button>
                </div>
            </div>

            {/* Notification Interceptor Layout */}
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 shadow-sm space-y-5 backdrop-blur-md transition-all">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell size={18} className="text-sky-500" /> Dispatch Notifications
                </h3>
                <div className="space-y-3">
                    {[
                        { key: 'newQuote', label: 'New quote requests incoming' },
                        { key: 'accepted', label: 'Client quote specifications accepted' },
                        { key: 'reminders', label: 'Automated followup system reminders' },
                    ].map(({ key, label }) => (
                        <label key={key} className="flex items-center justify-between rounded-xl border border-sky-100/60 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/30 px-4 py-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950/60 transition">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                            <input
                                type="checkbox"
                                checked={notifPrefs[key]}
                                onChange={() => toggleNotif(key)}
                                className="h-5 w-5 accent-sky-600 dark:accent-sky-500 rounded cursor-pointer"
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Regional Translation Layer */}
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 shadow-sm space-y-5 backdrop-blur-md transition-all">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe size={18} className="text-sky-500" /> Language & Localization
                </h3>
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => { setLanguage(e.target.value); showToast('Language updated.'); }}
                        className="w-full rounded-xl border border-sky-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-950 transition cursor-pointer"
                    >
                        <option value="en">English (US)</option>
                        <option value="ko">한국어 (Korean)</option>
                        <option value="es">Español (Spanish)</option>
                    </select>
                </div>
            </div>

            {/* Branding Meta Node */}
            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 shadow-sm space-y-4 backdrop-blur-md transition-all">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 size={18} className="text-sky-500" /> Core Node Branding
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    This workspace is linked cleanly to your configuration node. Let me know what data fields or branding credentials you want to track right here, and we can wire them straight into your operational view!
                </p>
            </div>
        </div>
    );
}