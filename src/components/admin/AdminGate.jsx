import React, { useCallback, useEffect, useState } from 'react';
import { clearSession, currentSession, login, logout } from '../../services/api.js';
import Logo from '../Logo.jsx';
import './AdminGate.css';

// Puerta del panel: login real contra el backend (backend/api/login.php).
// La contraseña nunca está en el código del sitio: se valida en el servidor
// y lo único que guarda el navegador es un token de sesión que vence solo.
//
// `children` es una función que recibe { admin, onLogout, onSessionExpired }.
export default function AdminGate({ children }) {
  // 'checking' mientras se confirma con el servidor si ya había una sesión.
  const [status, setStatus] = useState('checking');
  const [admin, setAdmin] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    currentSession()
      .then((user) => {
        if (cancelled) return;
        setAdmin(user);
        setStatus(user ? 'in' : 'out');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus('out');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!email.trim() || !password) {
      setError('Completá el mail y la contraseña.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const user = await login(email.trim(), password);
      setAdmin(user);
      setPassword('');
      setStatus('in');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = useCallback(async () => {
    await logout();
    setAdmin(null);
    setStatus('out');
  }, []);

  // El servidor rechazó el token (venció o se cerró desde otro lado).
  const handleSessionExpired = useCallback(() => {
    clearSession();
    setAdmin(null);
    setError('La sesión venció. Ingresá de nuevo.');
    setStatus('out');
  }, []);

  if (status === 'in') {
    return children({ admin, onLogout: handleLogout, onSessionExpired: handleSessionExpired });
  }

  return (
    <div className="admin-gate">
      <form className="admin-gate__card" onSubmit={handleSubmit}>
        <Logo size="md" />
        <h1>Panel privado</h1>
        {status === 'checking' ? (
          <p role="status">Verificando la sesión...</p>
        ) : (
          <>
            <p>Ingresá con tu mail y contraseña para administrar el catálogo.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Mail"
              aria-label="Mail"
              autoComplete="username"
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Contraseña"
              aria-label="Contraseña"
              autoComplete="current-password"
            />
            {error && <p className="admin-gate__error" role="alert">{error}</p>}
            <button type="submit" disabled={submitting}>
              {submitting ? 'Entrando...' : 'Entrar'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
