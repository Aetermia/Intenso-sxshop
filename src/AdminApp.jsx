import React from 'react';
import AdminGate from './components/admin/AdminGate.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';

const SESSION_KEY = 'intenso_admin_unlocked';

export default function AdminApp() {
  const handleExit = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* noop */
    }
    window.location.hash = '';
    window.location.reload();
  };

  return (
    <AdminGate>
      <AdminPanel onExit={handleExit} />
    </AdminGate>
  );
}
