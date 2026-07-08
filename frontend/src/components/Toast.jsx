import React from 'react';

export default function Toast({ message }) {
    if (!message) return null;
    return (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-sky-950 px-6 py-3.5 text-base font-bold text-white shadow-2xl animate-fade-in">
            {message}
        </div>
    );
}