import React from 'react';
import AdminGate from './components/admin/AdminGate.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';

export default function AdminApp() {
  return (
    <AdminGate>
      <AdminPanel />
    </AdminGate>
  );
}
