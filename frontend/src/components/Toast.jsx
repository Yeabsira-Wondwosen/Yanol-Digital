import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 transform animate-fade-in-down">
      <div className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 font-sans text-sm font-bold text-white shadow-xl ring-4 ring-emerald-500/20">
        <span>✨</span>
        <span>{message}</span>
      </div>
    </div>
  );
}