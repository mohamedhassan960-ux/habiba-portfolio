import React, { useState, useEffect } from 'react';
import { isAuthenticated, logout } from './auth';
import { AdminProvider } from './context/AdminContext';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './styles/admin-dashboard.css';

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => isAuthenticated());

  useEffect(() => {
    // Check auth on mount
    setAuthed(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLoginSuccess={() => setAuthed(true)} />;
  }

  return (
    <AdminProvider>
      <AdminDashboard onLogout={handleLogout} />
    </AdminProvider>
  );
}
