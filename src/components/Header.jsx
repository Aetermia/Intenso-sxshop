import React, { useRef, useState } from 'react';
import { CATEGORIES, categoryLabel } from '../data/config.js';
import { useCart } from '../context/CartContext.jsx';
import { useScrollDirection } from '../hooks/useScrollDirection.js';
import { useDismiss } from '../hooks/useDismiss.js';
import Logo from './Logo.jsx';
import './Header.css';

export default function Header({ query, setQuery, category, setCategory }) {
  const { count, setDrawerOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  // Id de la categoria "padre" cuyo submenu esta abierto (null = lista principal).
  const [openParent, setOpenParent] = useState(null);
  const menuRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);
  // Header retráctil: se oculta al bajar y vuelve al subir. Queda fijo
  // mientras se escribe en el buscador o el menú de categorías está abierto.
  const { isHidden, isAtTop } = useScrollDirection({ pinned: searchFocused || menuOpen });

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenParent(null);
  };

  // Clic afuera cierra el menú; Escape vuelve del submenú o lo cierra.
  useDismiss(menuRef, menuOpen, closeMenu, () => (openParent ? setOpenParent(null) : closeMenu()));

  const activeLabel = categoryLabel(category) ?? 'Categorías';
  const openParentCategory = CATEGORIES.find((c) => c.id === openParent);

  const pick = (id) => {
    setCategory(id);
    closeMenu();
  };

  const goHome = () => {
    setCategory('todos');
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`header ${isHidden ? 'header--hidden' : ''} ${isAtTop ? '' : 'header--scrolled'}`}
    >
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
                onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-label={`${menuOpen ? 'Cerrar' : 'Abrir'} categorías. Categoría activa: ${activeLabel}`}
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
                {category !== 'todos' && <span className="header__menu-dot" aria-hidden="true" />}
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

              {menuOpen && !openParentCategory && (
                <nav className="header__menu-dropdown" aria-label="Categorías">
                  {CATEGORIES.map((c) =>
                    c.subcategories ? (
                      <button
                        key={c.id}
                        className="header__menu-item header__menu-item--parent"
                        onClick={() => setOpenParent(c.id)}
                      >
                        {c.label}
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m9 6 6 6-6 6" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        key={c.id}
                        className={`header__menu-item ${category === c.id ? 'header__menu-item--active' : ''}`}
                        onClick={() => pick(c.id)}
                      >
                        {c.label}
                      </button>
                    )
                  )}
                </nav>
              )}

              {menuOpen && openParentCategory && (
                <nav className="header__menu-dropdown" aria-label={openParentCategory.label}>
                  <button className="header__menu-back" onClick={() => setOpenParent(null)}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m15 6-6 6 6 6" />
                    </svg>
                    {openParentCategory.label}
                  </button>
                  <button
                    className={`header__menu-item ${category === openParentCategory.id ? 'header__menu-item--active' : ''}`}
                    onClick={() => pick(openParentCategory.id)}
                  >
                    Ver todo en {openParentCategory.label}
                  </button>
                  {openParentCategory.subcategories.map((s) => (
                    <button
                      key={s.id}
                      className={`header__menu-item ${category === s.id ? 'header__menu-item--active' : ''}`}
                      onClick={() => pick(s.id)}
                    >
                      {s.label}
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
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            aria-label="Buscar productos"
          />
        </div>
      </div>
    </header>
  );
}
