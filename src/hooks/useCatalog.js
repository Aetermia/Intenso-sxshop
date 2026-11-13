import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from '../services/api.js';

// Catálogo de la tienda, leído de la base de datos por la API.
//
// status: 'loading' | 'ready' | 'error'
//
// El catálogo escrito en src/data/catalog.js NO se usa en producción: solo
// sirve de respaldo cuando se trabaja en local (npm run dev) sin tener el
// backend PHP levantado, para poder ver la tienda igual. Se carga con un
// import dinámico justamente para que no viaje en el sitio publicado.
export function useCatalog() {
  const [state, setState] = useState({ status: 'loading', products: [], demo: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading' }));
    fetchProducts()
      .then((products) => {
        if (!cancelled) setState({ status: 'ready', products, demo: false });
      })
      .catch(async (err) => {
        if (cancelled) return;
        if (import.meta.env.DEV) {
          const { CATALOG } = await import('../data/catalog.js');
          if (cancelled) return;
          console.warn('[catálogo] Sin backend en local: se muestra el catálogo de ejemplo.', err.message);
          setState({ status: 'ready', products: CATALOG, demo: true });
          return;
        }
        console.error('[catálogo] No se pudo cargar desde la API:', err.message);
        setState({ status: 'error', products: [], demo: false });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
