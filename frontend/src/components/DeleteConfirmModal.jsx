import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, clientName }) {
    // Close the popup if the user presses the 'Escape' key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Dark backdrop shadow */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-rose-100 dark:border-rose-950 bg-white dark:bg-slate-900 p-6 shadow-2xl transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 duration-200">

                {/* Top Right "X" Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition"
                >
                    <X size={18} />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    {/* Warning Icon */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 ring-8 ring-rose-500/10">
                        <AlertTriangle size={28} className="animate-pulse" />
                    </div>

                    <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        Permanently delete quote?
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px]">
                        This action cannot be undone. Are you sure you want to delete the quote{clientName ? ` for ${clientName}` : ''}?
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                        Cancel, keep it
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/10 hover:shadow-rose-700/20 active:scale-95 transition cursor-pointer"
                    >
                        Yes, delete permanently
                    </button>
                </div>
            </div>
        </div>
    );
}