import React, { useEffect, useState } from 'react';
import App from './App.jsx';
import AdminApp from './AdminApp.jsx';
import TermsPage from './components/TermsPage.jsx';

export default function Root() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (hash === '#admin') return <AdminApp />;
  if (hash === '#terminos') return <TermsPage />;
  return <App />;
}
