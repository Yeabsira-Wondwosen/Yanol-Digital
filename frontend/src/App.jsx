import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import QuoteForm from './components/QuoteForm';

// Layout Imports (Points directly to your aggregator index.js)
import { AuthLayout, DashboardLayout } from './Layout';

// Sub-Component Feature Views
import Overview from './components/Overview';
import Reports from './components/Reports';
import Clients from './components/Clients';
import SettingsView from './components/SettingsView';
import ProjectDetailView from './components/ProjectDetailView';
import Toast from './components/Toast';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New quote request', body: 'Ruth Haile submitted a request for Blue Nile Textiles.', time: '12m ago', unread: true },
  { id: 2, title: 'Quote accepted', body: 'Yonatan Girma approved specs for Addis Build Materials.', time: '1h ago', unread: true },
  { id: 3, title: 'Reminder', body: 'Follow up with Highland Coffee Exports — pending 3 days.', time: '4h ago', unread: true },
  { id: 4, title: 'System update', body: 'Monthly reports have finished generating.', time: 'Yesterday', unread: false },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Yeabsira W.');
  const [view, setView] = useState('overview');
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
  
  const searchInputRef = useRef(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('user');
    if (token) {
      setIsAuthenticated(true);
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.name || 'Admin User');
      }
    }
  }, []);

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

  const handleSignOut = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    showToast('Signed out successfully.');
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read.');
  };

  // Switch engine for main workspace rendering
  const renderActiveView = () => {
    if (selectedProject) {
      return <ProjectDetailView project={selectedProject} onBack={() => setSelectedProject(null)} />;
    }

    switch (view) {
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
          />
        );
      case 'quote':
        return (
          <QuoteForm 
            onQuoteCreated={() => { 
              setQuoteCount((c) => c + 1); 
              setView('overview'); 
              showToast('Quote created successfully.'); 
            }} 
          />
        );
      case 'clients':
        return <Clients searchTerm={searchTerm} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <SettingsView userName={userName} setUserName={setUserName} showToast={showToast} />;
      default:
        return <div className="text-center py-12 font-bold text-slate-400">View not found.</div>;
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <Login onLoginSuccess={() => setIsAuthenticated(true)} showToast={showToast} />
      </AuthLayout>
    );
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
      <Toast message={toast} />
    </DashboardLayout>
  );
}