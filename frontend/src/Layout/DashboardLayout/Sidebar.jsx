import React from 'react';
import { LayoutGrid, FilePlus2, Users, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, Sparkles, SlidersHorizontal } from 'lucide-react';
import yanolLogo from '../../assets/Yanol.jpg'; // Adjust the paths (../) depending on your exact folder depth
const NAVIGATION_ITEMS = [
  { id: 'yanol', label: 'Yanol Tech', icon: Sparkles },
  { id: 'manage-quotes', label: 'Manage Quotes', icon: SlidersHorizontal },
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'quote', label: 'New Quote', icon: FilePlus2 },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ expanded, onToggleSidebar, currentView, setView, onSignOut }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}>
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sky-50 dark:border-slate-800/50">
        <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${expanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
          {/* Real Image Logo Asset */}
          <img
            src={yanolLogo}
            alt="Yanol Logo"
            className="h-7 w-7 rounded-lg object-cover shrink-0"
          />
          <span className="text-base font-black tracking-tight text-sky-950 dark:text-white whitespace-nowrap">
            Yanol Digital
          </span>
        </div>
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-700 dark:hover:text-sky-400 transition"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      {/* Navigation Options */}
      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200 group relative cursor-pointer ${isActive
                ? 'bg-sky-700 text-white shadow-md shadow-sky-700/10'
                : 'text-slate-400 hover:bg-sky-50/70 hover:text-sky-700'
                }`}
            >
              <Icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-600'}`} />
              <span className={`transition-all duration-300 ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-3 border-t border-sky-50">
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50/50 transition cursor-pointer"
        >
          <LogOut size={20} className="shrink-0" />
          <span className={`transition-all duration-300 ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}