import React, { useMemo, useState } from 'react';
import Splash from './components/Splash.jsx';
import Header from './components/Header.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import ProductModal from './components/ProductModal.jsx';
import DiscreetBanner from './components/DiscreetBanner.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import FAQ from './components/FAQ.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppFab from './components/WhatsAppFab.jsx';
import { useCatalog } from './hooks/useCatalog.js';
import { productMatchesCategory } from './data/config.js';
import { useCart } from './context/CartContext.jsx';
import { useScrollLock } from './hooks/useScrollLock.js';
import './styles/app.css';

const SPLASH_KEY = 'intenso_splash_seen';

export default function App() {
  const { setDrawerOpen } = useCart();
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return sessionStorage.getItem(SPLASH_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('todos');
  const [selected, setSelected] = useState(null);
  // Productos reales, desde la base de datos (backend/api/products.php).
  const { status, products: catalog, retry } = useCatalog();

  useScrollLock(showSplash);
  useScrollLock(!!selected);

  const handleEnter = () => {
    try {
      sessionStorage.setItem(SPLASH_KEY, '1');
    } catch {
      /* noop */
    }
    setShowSplash(false);
  };

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((p) => {
      const matchCat =
        category === 'todos' ||
        (category === 'mas-pedidos'
          ? p.insignias.includes('Top Ventas')
          : productMatchesCategory(p, category));
      const matchQ = !q || p.nombre.toLowerCase().includes(q);
      return p.activo !== false && matchCat && matchQ;
    });
  }, [catalog, query, category]);

  return (
    <>
      {showSplash && <Splash onEnter={handleEnter} />}

      <h1 className="sr-only">Intenso Tandil - Sex Shop online con envío discreto</h1>

      <Header
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
      />

      <DiscreetBanner />

      <main className="catalog container">
        {status === 'loading' ? (
          <div className="catalog__empty" role="status" aria-live="polite">
            <p>Cargando el catálogo...</p>
          </div>
        ) : status === 'error' ? (
          <div className="catalog__empty" role="alert">
            <p>No pudimos cargar el catálogo en este momento. Probá de nuevo en unos segundos.</p>
            <button className="catalog__empty-btn" onClick={retry}>
              Reintentar
            </button>
          </div>
        ) : catalog.length === 0 ? (
          <div className="catalog__empty">
            <p>Estamos preparando el catálogo. Volvé a pasar en un ratito o escribinos por WhatsApp.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="catalog__empty">
            <p>No encontramos nada con esa búsqueda. Cambiá el término o explorá todo el catálogo.</p>
            <button className="catalog__empty-btn" onClick={() => { setQuery(''); setCategory('todos'); }}>
              Ver todos los productos
            </button>
          </div>
        ) : (
          <>
            {!query && <p className="catalog__eyebrow">Encendé tu deseo.</p>}
            <h2 className="catalog__title">
              {query ? `Resultados para "${query}"` : 'Nuestro catálogo'}
            </h2>
            <ProductGrid products={products} onOpen={setSelected} />
          </>
        )}
      </main>

      <FAQ />
      <Footer />

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      <CartDrawer />
      <WhatsAppFab />
    </>
  );
}
