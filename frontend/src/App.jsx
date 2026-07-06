import React, { useState } from 'react';
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./components/Login";

function Dashboard() {
  const { user, logout } = useAuth();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [projectType, setProjectType] = useState('E-commerce');
  const [requirements, setRequirements] = useState('');

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    // We will hook this up to save to the MySQL backend next!
    alert(`Quote Saved for ${customerName}!`);
    setShowQuoteForm(false);
    setCustomerName('');
    setRequirements('');
  };

  return (
    <div style={dashStyles.container}>
      {/* Sidebar Navigation Panel */}
      <aside style={dashStyles.sidebar}>
        <div style={dashStyles.logoSection}>
          <h2 style={dashStyles.logoText}>Yanol UI</h2>
          <span style={dashStyles.badge}>Reception</span>
        </div>

        <nav style={dashStyles.navMenu}>
          <button style={dashStyles.navItemActive}>📋 Overview</button>
          <button
            onClick={() => setShowQuoteForm(true)}
            style={dashStyles.quoteTriggerBtn}
          >
            ✨ Create New Quote
          </button>
        </nav>

        <div style={dashStyles.userProfile}>
          <p style={dashStyles.userName}>{user?.name ?? "Yeabsira W."}</p>
          <button onClick={logout} style={dashStyles.logoutBtn}>Sign Out</button>
        </div>
      </aside>

      {/* Main Panel Frame */}
      <main style={dashStyles.mainContent}>
        {!showQuoteForm ? (
          <div>
            <header style={dashStyles.contentHeader}>
              <h1 style={dashStyles.welcomeMessage}>Welcome back, Admin</h1>
              <p style={dashStyles.subtext}>Here is what's happening with customer queries today.</p>
            </header>

            {/* Dynamic Status Dashboard Cards */}
            <div style={dashStyles.cardGrid}>
              <div style={dashStyles.statCard}>
                <h3>Pending Forms</h3>
                <p style={dashStyles.statNumber}>0</p>
              </div>
              <div style={dashStyles.statCard}>
                <h3>Accepted Specs</h3>
                <p style={dashStyles.statNumber}>0</p>
              </div>
            </div>
          </div>
        ) : (
          /* The Interactive Customer Form View */
          <div style={dashStyles.formWrapper}>
            <div style={dashStyles.formHeaderContainer}>
              <h2 style={dashStyles.formTitle}>Customer Requirement Intake Form</h2>
              <button onClick={() => setShowQuoteForm(false)} style={dashStyles.closeBtn}>✕ Close</button>
            </div>

            <form onSubmit={handleQuoteSubmit} style={dashStyles.formElement}>
              <div style={dashStyles.inputContainer}>
                <label style={dashStyles.formLabel}>Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Abel Tesfaye"
                  style={dashStyles.formInput}
                />
              </div>

              <div style={dashStyles.inputContainer}>
                <label style={dashStyles.formLabel}>What type of website do they want?</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  style={dashStyles.formSelect}
                >
                  <option value="E-commerce Framework">High-End E-commerce Platform</option>
                  <option value="Corporate Portfolio">Corporate Portfolio Website</option>
                  <option value="Educational / LMS">Educational / Learning Platform</option>
                  <option value="Custom Web App">Custom Full-Stack Dashboard</option>
                </select>
              </div>

              <div style={dashStyles.inputContainer}>
                <label style={dashStyles.formLabel}>Detailed Design & Feature Requirements</label>
                <textarea
                  rows="5"
                  required
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe animations, page numbers, color themes, integrations..."
                  style={dashStyles.formTextarea}
                ></textarea>
              </div>

              <button type="submit" style={dashStyles.submitFormBtn}>Save Quote to MySQL Database</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Clean Dashboard Premium Layout Styling
const dashStyles = {
  container: { display: 'flex', height: '100vh', background: '#09090e', color: '#fff', fontFamily: 'system-ui, sans-serif' },
  sidebar: { width: '260px', background: '#0f0f15', borderRight: '1px solid #1f1f2e', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  logoText: { fontSize: '1.4rem', fontWeight: '800', color: '#fff', margin: 0 },
  badge: { fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#94a3b8' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2.5rem', flexGrow: 1 },
  navItemActive: { background: 'rgba(255,255,255,0.04)', border: 'none', color: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', fontWeight: '500' },
  quoteTriggerBtn: { background: '#fff', color: '#000', border: 'none', padding: '0.8rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'opacity 0.2s' },
  userProfile: { borderTop: '1px solid #1f1f2e', paddingTop: '1rem' },
  userName: { margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '0.95rem' },
  logoutBtn: { background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0, fontSize: '0.85rem' },
  mainContent: { flexGrow: 1, padding: '3rem', overflowY: 'auto' },
  welcomeMessage: { fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0' },
  subtext: { color: '#64748b', margin: 0 },
  cardGrid: { display: 'flex', gap: '1.5rem', marginTop: '2.5rem' },
  statCard: { background: '#0f0f15', border: '1px solid #1f1f2e', padding: '1.5rem', borderRadius: '12px', minWidth: '200px' },
  statNumber: { fontSize: '2.5rem', fontWeight: '700', margin: '0.5rem 0 0 0' },
  formWrapper: { maxWidth: '600px', background: '#0f0f15', border: '1px solid #1f1f2e', padding: '2.5rem', borderRadius: '16px' },
  formHeaderContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  formTitle: { fontSize: '1.25rem', fontWeight: '700', margin: 0 },
  closeBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' },
  formElement: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  inputContainer: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  formLabel: { fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' },
  formInput: { background: '#161622', border: '1px solid #27273a', borderRadius: '8px', padding: '0.8rem 1rem', color: '#fff', outline: 'none' },
  formSelect: { background: '#161622', border: '1px solid #27273a', borderRadius: '8px', padding: '0.8rem 1rem', color: '#fff', outline: 'none' },
  formTextarea: { background: '#161622', border: '1px solid #27273a', borderRadius: '8px', padding: '0.8rem 1rem', color: '#fff', outline: 'none', resize: 'vertical' },
  submitFormBtn: { background: '#fff', color: '#000', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }
};