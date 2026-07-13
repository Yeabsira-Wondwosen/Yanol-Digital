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
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-600 dark:text-slate-400 antialiased selection:bg-sky-500/10 selection:text-sky-600 transition-colors duration-200">

            {/* Sidebar Section */}
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
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shadow-sm transition-colors duration-200">

                    {/* Left Section: Mobile Toggle */}
                    <div className="w-1/4 flex items-center gap-4">
                        <button
                            onClick={onToggleSidebar}
                            className="rounded-xl p-2 hover:bg-sky-50 dark:hover:bg-slate-800 text-slate-400 hover:text-sky-700 dark:hover:text-sky-400 transition lg:hidden"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    {/* Center Section: Centered Global Search */}
                    <div className="w-2/4 flex justify-center">
                        <div className="relative max-w-md w-full hidden sm:block">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
                            <input
                                ref={searchInputRef}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Press '/' to quickly query dashboard..."
                                className="w-full rounded-xl border border-sky-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 py-2 pl-10 pr-4 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-sky-400 dark:focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition"
                            />
                        </div>
                    </div>

                    {/* Right Section: Notification Center */}
                    <div className="w-1/4 flex items-center justify-end gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className={`relative rounded-xl p-2.5 transition ${notifOpen ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-400' : 'text-slate-400 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-700 dark:hover:text-sky-400'}`}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
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

                        {/* Dynamic Large Display Gradient Headline */}
                        {/* Dynamic Large Display Gradient Headline */}
                        {view?.toLowerCase() !== 'settings' && (
                            <div className="mb-8">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white transition-all">
                                    {view?.toLowerCase() === 'overview' ? (
                                        <span className="bg-gradient-to-r from-slate-900 via-sky-600 to-indigo-500 dark:from-white dark:via-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                            Yanol Digital
                                        </span>
                                    ) : (
                                        <span className="capitalize">{view}</span>
                                    )}
                                </h1>
                            </div>
                        )}

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;