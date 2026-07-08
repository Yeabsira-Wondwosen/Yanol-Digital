import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import Sidebar from "./Sidebar";
import NotificationsPanel from '../../components/NotificationsPanel';

const DashboardLayout = ({
    children,
    expanded,
    onToggleSidebar,
    view,
    setView,
    userName,
    onSignOut,
    searchTerm,
    setSearchTerm,
    searchInputRef,
    notifOpen,
    setNotifOpen,
    unreadCount,
    notifications,
    onMarkAllRead
}) => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50/50 font-sans text-slate-600 antialiased selection:bg-sky-500/10 selection:text-sky-600">

            {/* Sidebar Recall Section */}
            <Sidebar
                expanded={expanded}
                onToggleSidebar={onToggleSidebar}
                currentView={view}
                setView={setView}
                userName={userName}
                onSignOut={onSignOut}
            />

            {/* Main Panel Surface Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-sky-100 bg-white px-6 shadow-sm">
                    
                    {/* Left Section: Mobile Toggle & View Header Context (1/4 width) */}
                    <div className="w-1/4 flex items-center gap-4">
                        <button
                            onClick={onToggleSidebar}
                            className="rounded-xl p-2 hover:bg-sky-50 text-slate-400 hover:text-sky-700 transition lg:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-xs font-black uppercase tracking-widest text-slate-400 hidden md:block">
                            {view}
                        </h1>
                    </div>

                    {/* Center Section: Centered Global Search (2/4 width) */}
                    <div className="w-2/4 flex justify-center">
                        <div className="relative max-w-md w-full hidden sm:block">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                ref={searchInputRef}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Press '/' to quickly query dashboard..."
                                className="w-full rounded-xl border border-sky-100 bg-slate-50/50 py-2 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-sky-400 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    {/* Right Section: Notification Center Node (1/4 width) */}
                    <div className="w-1/4 flex items-center justify-end gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className={`relative rounded-xl p-2.5 transition ${notifOpen ? 'bg-sky-50 text-sky-700' : 'text-slate-400 hover:bg-sky-50 hover:text-sky-700'}`}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white" />
                                )}
                            </button>

                            {notifOpen && (
                                <NotificationsPanel
                                    isOpen={notifOpen}
                                    notifications={notifications}
                                    onClose={() => setNotifOpen(false)}
                                    onMarkAllRead={onMarkAllRead}
                                />
                            )}
                        </div>
                    </div>
                </header>

                {/* Component Display Grid Engine */}
                <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
export { default as Sidebar } from './Sidebar';