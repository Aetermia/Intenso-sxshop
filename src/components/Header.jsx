import React from 'react';
import { CATEGORIES } from '../data/config.js';
import { useCart } from '../context/CartContext.jsx';
import './Header.css';

// Iconos de línea por categoría, en sintonía con las siluetas de ProductArt.
const PILL_ICONS = {
  todos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="4" /></svg>
  ),
  'mas-pedidos': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c1.2 2.4.6 4-1 5.6C9.4 9.2 9 11 10.5 12.5c-2 0-3.5-1.6-3.5-3.5C5 10.6 4 13 4 15a8 8 0 0 0 16 0c0-4.5-3-8-8-13z" /></svg>
  ),
  juguetes: (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"><path d="M28 82c-6-4-9-11-9-19 0-11 9-20 20-20h8c6-8 16-13 27-13 11 0 17-8 17-17" /></svg>
  ),
  lenceria: (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"><path d="M30 30c10-8 30-8 40 0 2 1 3 3 3 5l-6 22c-2 9-4 14-8 17l-5-6-5 6c-4-3-6-8-8-17l-6-22c0-2 1-4 3-5z" /></svg>
  ),
  lubricantes: (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"><rect x="38" y="22" width="24" height="10" rx="3" /><path d="M34 34h32l6 40a6 6 0 0 1-6 7H34a6 6 0 0 1-6-7z" /></svg>
  ),
  parejas: (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8"><circle cx="34" cy="50" r="20" /><circle cx="66" cy="50" r="20" /></svg>
  ),
  bdsm: (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round"><path d="M30 22v26c0 10 8 18 18 18" /><path d="M70 78V52c0-10-8-18-18-18" /></svg>
  ),
};

export default function Header({ query, setQuery, category, setCategory }) {
  const { count, setDrawerOpen } = useCart();

  return (
    <header className="header">
      <div className="container header__top">
        <a className="brand" href="#" onClick={(e) => e.preventDefault()}>
          <span className="brand__flame">
            Intens<span className="brand__flame-o">o</span>
          </span>
        </a>

        <button
          className="header__cart-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label={`Abrir carrito, ${count} items`}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1.6" />
            <circle cx="19" cy="21" r="1.6" />
            <path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 7H6" />
          </svg>
          {count > 0 && <span className="header__cart-badge">{count}</span>}
        </button>
      </div>

      <div className="container header__search">
        <div className="header__searchbox">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="¿Qué estás buscando?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar productos"
          />
        </div>
      </div>

      <nav className="container header__pills" aria-label="Categorías">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`pill ${c.id === 'mas-pedidos' ? 'pill--top' : ''} ${category === c.id ? 'pill--active' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {PILL_ICONS[c.id]}
            {c.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
