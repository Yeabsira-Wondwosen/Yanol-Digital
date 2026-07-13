import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; // Points to your newly updated Dashboard component
import { AuthLayout } from './Layout';
import api from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));
  const [userName, setUserName] = useState('Yeabsira W.');

  // Session verification check on initial load against your backend
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const response = await api.get('/me');
        setIsAuthenticated(true);
        if (response.data?.user) {
          setUserName(response.data.user.username || response.data.user.name || 'Admin User');
        }
      } catch (err) {
        console.error("Session verification failed:", err);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    };
    verifySession();
  }, []);

  // 1. Unauthenticated View: Forces login page immediately on 'npm run dev'
  if (!isAuthenticated) {
    return (

      <Login onLoginSuccess={() => setIsAuthenticated(true)} />

    );
  }

  // 2. Authenticated View: Hands off all layout & views to the Dashboard manager
  return (
    <Dashboard
      userName={userName}
      setIsAuthenticated={setIsAuthenticated}
    />
  );
}