import React, { useEffect, useState } from 'react';
import App from './App.jsx';
import AdminApp from './AdminApp.jsx';

export default function Root() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return hash === '#admin' ? <AdminApp /> : <App />;
}
