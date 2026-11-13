import React, { useMemo, useRef, useState } from 'react';
import ProductCard from '../ProductCard.jsx';
import { useDismiss } from '../../hooks/useDismiss.js';

// Listado del catálogo publicado en el panel: buscador y menú "Acciones"
// (editar, congelar, eliminar) de cada producto. Solo un menú abierto a la
// vez, para no llenar de botones las ~100 tarjetas.
//
//   status  -> 'loading' | 'ready' | 'error' (carga desde la API)
//   busyId  -> producto con una acción en curso (se deshabilita su menú)
export default function CatalogList({
  products, status, loadError, onRetry, busyId, onEdit, onToggleStock, onDelete, onPreview,
}) {
  const [search, setSearch] = useState('');
  const [openActionsFor, setOpenActionsFor] = useState(null);
  const menuRef = useRef(null);

  useDismiss(menuRef, openActionsFor !== null, () => setOpenActionsFor(null));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? products.filter((p) => p.nombre.toLowerCase().includes(q)) : products;
  }, [products, search]);

  return (
    <section className="container admin__drafts">
      <div className="admin__drafts-head">
        <h2>
          Catálogo actual ({filtered.length}
          {search.trim() ? ` de ${products.length}` : ''})
        </h2>
      </div>
      <p className="admin__drafts-note">
        Esto es lo que está publicado en la tienda. "Editar", "Congelar" y "Eliminar" se
        guardan en la base de datos y se ven en el sitio al instante.
      </p>
      <div className="admin__catalog-search">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar un producto del catálogo para editarlo, congelarlo o eliminarlo..."
          aria-label="Buscar producto en el catálogo"
        />
      </div>
      {status === 'loading' && (
        <p className="admin__drafts-empty" role="status">Cargando el catálogo...</p>
      )}
      {status === 'error' && (
        <p className="admin__error" role="alert">
          {loadError}{' '}
          <button type="button" className="admin__draft-remove" onClick={onRetry}>Reintentar</button>
        </p>
      )}
      {status === 'ready' && products.length === 0 && (
        <p className="admin__drafts-empty">
          Todavía no hay productos cargados. Usá el formulario de arriba para publicar el primero.
        </p>
      )}
      {search.trim() && products.length > 0 && filtered.length === 0 && (
        <p className="admin__drafts-empty">No encontramos ningún producto con ese nombre.</p>
      )}
      <div className="grid admin__drafts-grid">
        {filtered.map((p) => (
          <div className="admin__draft" key={p.id}>
            <ProductCard
              product={p}
              onOpen={onPreview}
            />
            <div
              className="admin__actions"
              ref={p.id === openActionsFor ? menuRef : null}
            >
              <button
                type="button"
                className="admin__actions-toggle"
                aria-haspopup="true"
                aria-expanded={openActionsFor === p.id}
                disabled={busyId === p.id}
                onClick={() => setOpenActionsFor(openActionsFor === p.id ? null : p.id)}
              >
                {busyId === p.id ? 'Guardando...' : 'Acciones'}
                <svg
                  className="admin__actions-chevron"
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openActionsFor === p.id && (
                <div className="admin__actions-menu" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setOpenActionsFor(null); onEdit(p); }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setOpenActionsFor(null); onToggleStock(p); }}
                  >
                    {p.sinStock ? 'Reactivar stock' : 'Congelar (sin stock)'}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="admin__actions-menu-remove"
                    onClick={() => { setOpenActionsFor(null); onDelete(p); }}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
