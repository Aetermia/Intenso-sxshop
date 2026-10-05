import React, { useState } from 'react';
import { ADMIN_PASSPHRASE } from '../../data/config.js';
import Logo from '../Logo.jsx';
import './AdminGate.css';

const SESSION_KEY = 'intenso_admin_unlocked';

export default function AdminGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value === ADMIN_PASSPHRASE) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* noop */
      }
      setUnlocked(true);
    } else {
      setError('Clave incorrecta.');
    }
  };

  if (unlocked) return children;

  return (
    <div className="admin-gate">
      <form className="admin-gate__card" onSubmit={handleSubmit}>
        <Logo size="md" />
        <h1>Panel privado</h1>
        <p>Ingresá la clave para administrar el catálogo.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          placeholder="Clave"
          autoFocus
        />
        {error && <p className="admin-gate__error">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
