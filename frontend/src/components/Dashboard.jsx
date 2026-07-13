// src/components/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import QuoteForm from './QuoteForm';
import api from '../services/api';
import { Sparkles } from 'lucide-react';

import DashboardLayout from '../Layout/DashboardLayout/DashboardLayout';

// Sub-Component Feature Views
import Overview from './Overview';
import Reports from './Reports';
import Clients from './Clients';
import SettingsView from './SettingsView';
import ProjectDetailView from './ProjectDetailView';
import Toast from './Toast';
import Yanol from './Yanol';
import ManageQuotes from './ManageQuotes';

const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'New quote request', body: 'Ruth Haile submitted a request for Blue Nile Textiles.', time: '12m ago', unread: true },
    { id: 2, title: 'Quote accepted', body: 'Yonatan Girma approved specs for Addis Build Materials.', time: '1h ago', unread: true },
    { id: 3, title: 'Reminder', body: 'Follow up with Highland Coffee Exports — pending 3 days.', time: '4h ago', unread: true },
    { id: 4, title: 'System update', body: 'Monthly reports have finished generating.', time: 'Yesterday', unread: false },
];

function playNotificationSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(783.99, ctx.currentTime);
        gain1.gain.setValueAtTime(0, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.4);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.1);
        gain2.gain.setValueAtTime(0, ctx.currentTime + 0.1);
        gain2.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime + 0.1);
        osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
        console.warn("Web Audio sound blocked or failed:", e);
    }
}

export default function Dashboard({ userName: initialUserName, setIsAuthenticated }) {
    const [userName, setUserName] = useState(initialUserName || 'Admin');
    const [view, setView] = useState('yanol');
    const [selectedProject, setSelectedProject] = useState(null);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [quoteCount, setQuoteCount] = useState(6);
    const [acceptedCount, setAcceptedCount] = useState(2);
    const [prevQuoteCount] = useState(5);
    const [prevAcceptedCount] = useState(3);
    const [toast, setToast] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [newQuoteId, setNewQuoteId] = useState(null);
    const [activeNotification, setActiveNotification] = useState(null);
    const [clients, setClients] = useState([]);
    const searchInputRef = useRef(null);
    const unreadCount = notifications.filter((n) => n.unread).length;

    useEffect(() => {
        const handler = (e) => {
            if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(''), 3000);
    };

    const triggerNotification = (newQuote) => {
        playNotificationSound();
        setActiveNotification(newQuote);
        setTimeout(() => {
            setActiveNotification(null);
        }, 4500);
    };

    const handleSignOut = async () => {
        try {
            await api.post('/logout');
        } catch (err) {
            console.warn("Backend logout failed:", err);
        }
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    };

    const handleMarkAllRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, unread: false })));
        showToast('All notifications marked as read.');
    };

    const handleProjectDone = async (project) => {
        try {
            const response = await api.patch(`/quotes/${project.id}`, { status: 'approved' });
            if (response.data?.success) {
                showToast('Project marked as completed!');
                setRefreshTrigger((prev) => prev + 1);
                setSelectedProject(null);
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 100);
            }
        } catch (err) {
            console.error("Failed to mark project as done:", err);
            showToast("Failed to update project status.");
        }
    };

    const renderActiveView = () => {
        if (selectedProject) {
            return (
                <ProjectDetailView
                    project={selectedProject}
                    onBack={() => setSelectedProject(null)}
                    onDone={handleProjectDone}
                />
            );
        }

        switch (view) {
            case 'yanol':
                return <Yanol />;
            case 'manage-quotes':
                return (
                    <ManageQuotes 
                        refreshTrigger={refreshTrigger}
                        setRefreshTrigger={setRefreshTrigger}
                    />
                );
            case 'overview':
                return (
                    <Overview
                        userName={userName}
                        quoteCount={quoteCount}
                        acceptedCount={acceptedCount}
                        prevQuoteCount={prevQuoteCount}
                        prevAcceptedCount={prevAcceptedCount}
                        onNewQuote={() => setView('quote')}
                        onSelectProject={setSelectedProject}
                        onViewClients={() => setView('clients')}
                        searchTerm={searchTerm}
                    />
                );
            case 'quote':
                return (
                    <QuoteForm
                        onClose={() => setView('overview')}
                        onSubmitted={(newQuote) => {
                            setQuoteCount((c) => c + 1);
                            setNewQuoteId(newQuote.id);
                            setRefreshTrigger((prev) => prev + 1);
                            setClients((prevClients) => [newQuote, ...prevClients]);
                            setNotifications(prevNotif => [
                                {
                                    id: Date.now(),
                                    title: 'New quote request',
                                    body: `${newQuote.client_name} submitted a request for ${newQuote.company_name || 'Individual'}.`,
                                    time: 'Just now',
                                    unread: true
                                },
                                ...prevNotif
                            ]);

                            triggerNotification(newQuote);
                            setView('clients');
                        }}
                    />
                );
            case 'clients':
                return (
                    <Clients
                        clients={clients}         // 👈 Pass state down so it shares database records
                        setClients={setClients}   // 👈 Pass setter so Clients view can update it
                        searchTerm={searchTerm}
                        refreshTrigger={refreshTrigger}
                        newQuoteId={newQuoteId}
                        clearNewQuoteId={() => setNewQuoteId(null)}
                    />
                );
            case 'settings':
                return (
                    <SettingsView
                        userName={userName}
                        setUserName={setUserName}
                        showToast={showToast}
                    />
                );
            case 'reports':
                return <Reports clients={clients} />; // 👈 FIXED: Changed 'quotes' to 'clients'

            default:
                return (
                    <Overview
                        userName={userName}
                        quoteCount={quoteCount}
                        acceptedCount={acceptedCount}
                        prevQuoteCount={prevQuoteCount}
                        prevAcceptedCount={prevAcceptedCount}
                        onNewQuote={() => setView('quote')}
                        onSelectProject={setSelectedProject}
                        onViewClients={() => setView('clients')}
                        searchTerm={searchTerm}
                    />
                );
        }
    }
    return (
        <DashboardLayout
            expanded={sidebarExpanded}
            onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
            view={view}
            setView={setView}
            userName={userName}
            onSignOut={handleSignOut}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchInputRef={searchInputRef}
            notifOpen={notifOpen}
            setNotifOpen={setNotifOpen}
            unreadCount={unreadCount}
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
        >
            {renderActiveView()}

            {/* Real-time high-fidelity animated Quote Notification Popup */}
            {activeNotification && (
                <div className="fixed right-6 top-20 z-[9999] w-96 overflow-hidden rounded-2xl border border-sky-100 bg-white/95 p-5 shadow-2xl backdrop-blur-md animate-slide-in-right">
                    <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-sky-50/80 p-2.5 text-sky-600 ring-4 ring-sky-500/10">
                            <Sparkles size={20} className="animate-pulse text-sky-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">New Quote Saved</span>
                                <span className="text-[10px] font-bold text-slate-400">Just now</span>
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-sm mt-1.5 truncate">
                                {activeNotification.client_name}
                            </h4>
                            <p className="text-xs text-slate-500 font-semibold truncate">
                                {activeNotification.company_name || 'Individual Account'}
                            </p>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100/80 pt-2.5 text-xs text-slate-600 font-bold">
                                <span className="text-slate-500 uppercase tracking-tight text-[10px]">{activeNotification.project_type?.replace('_', ' ')}</span>
                                <span className="text-sky-700 bg-sky-50/50 px-2 py-0.5 rounded-lg border border-sky-100">
                                    {activeNotification.budget}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-sky-400 to-sky-600 animate-countdown" />
                </div>
            )}

            <Toast message={toast} />
        </DashboardLayout>
    );
}
