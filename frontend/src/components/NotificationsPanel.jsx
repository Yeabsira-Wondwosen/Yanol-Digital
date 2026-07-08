import React from 'react';
import { Check } from 'lucide-react';

export default function NotificationsPanel({ isOpen, notifications, onMarkAllRead }) {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-16 w-80 rounded-2xl border border-sky-100 bg-white p-4 shadow-xl z-50 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Notifications</span>
                {notifications.some(n => n.unread) && (
                    <button
                        onClick={onMarkAllRead}
                        className="text-xs font-black text-sky-700 hover:text-sky-800 transition flex items-center gap-1 cursor-pointer"
                    >
                        <Check size={12} /> Mark all read
                    </button>
                )}
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                    <p className="text-xs text-center text-slate-400 font-bold py-4">No notifications yet.</p>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`p-2.5 rounded-xl text-left transition-colors ${n.unread ? 'bg-sky-50/60 border border-sky-100/50' : 'bg-transparent'
                                }`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-black text-slate-800">{n.title}</p>
                                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-normal">{n.body}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}