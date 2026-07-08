import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function SettingsView({ userName, setUserName, showToast }) {
    const [nameDraft, setNameDraft] = useState(userName);
    const [notifPrefs, setNotifPrefs] = useState({ newQuote: true, accepted: true, reminders: false });

    const handleSave = (e) => {
        e.preventDefault();
        setUserName(nameDraft);
        localStorage.setItem('user', JSON.stringify({ name: nameDraft }));
        showToast('Profile updated.');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-sky-950">Settings</h2>
                <p className="text-base text-slate-500 font-medium">Manage your profile and notification preferences.</p>
            </div>

            <form onSubmit={handleSave} className="rounded-2xl border border-sky-100 bg-white p-8 shadow-sm space-y-5">
                <h3 className="text-lg font-black text-slate-800">Profile</h3>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Display name</label>
                    <input
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        className="w-full rounded-xl border border-sky-100 bg-slate-50/50 px-4 py-3 text-base font-bold text-slate-700 outline-none focus:border-sky-400 focus:bg-white"
                    />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-sky-800">
                    <Check size={16} /> Save changes
                </button>
            </form>
        </div>
    );
}