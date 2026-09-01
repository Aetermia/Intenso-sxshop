import React from 'react';
import { CATEGORIES } from '../data/config.js';
import { useCart } from '../context/CartContext.jsx';
import './Header.css';

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
            className={`pill ${category === c.id ? 'pill--active' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
