import React, { useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '../data/config.js';
import { useCart } from '../context/CartContext.jsx';
import Logo from './Logo.jsx';
import './Header.css';

export default function Header({ query, setQuery, category, setCategory }) {
  const { count, setDrawerOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const activeLabel = CATEGORIES.find((c) => c.id === category)?.label ?? 'Categorías';

  const goHome = () => {
    setCategory('todos');
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header__stickybar">
      <div className="container header__top">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
        >
          <Logo size="sm" />
        </a>

        <div className="header__actions" ref={menuRef}>
          <div className="header__menu-wrap">
            <button
              className={`header__menu-btn ${menuOpen ? 'header__menu-btn--open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="Abrir categorías"
            >
              <svg
                className="header__menu-burger"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
              <span className="header__menu-label">{activeLabel}</span>
              <svg
                className="header__menu-caret"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {menuOpen && (
              <nav className="header__menu-dropdown" aria-label="Categorías">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    className={`header__menu-item ${category === c.id ? 'header__menu-item--active' : ''}`}
                    onClick={() => {
                      setCategory(c.id);
                      setMenuOpen(false);
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </nav>
            )}
          </div>

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
      </div>
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
    </header>
  );
}
