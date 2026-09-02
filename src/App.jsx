import React, { useEffect, useMemo, useState } from 'react';
import Splash from './components/Splash.jsx';
import Header from './components/Header.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import ProductModal from './components/ProductModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import FAQ from './components/FAQ.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppFab from './components/WhatsAppFab.jsx';
import { CATALOG } from './data/catalog.js';
import { useCart } from './context/CartContext.jsx';
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

  useEffect(() => {
    document.body.classList.toggle('no-scroll', showSplash);
    return () => document.body.classList.remove('no-scroll');
  }, [showSplash]);

  // Bloquear scroll del fondo mientras hay modal abierto
  useEffect(() => {
    document.body.classList.toggle('no-scroll', !!selected);
    return () => document.body.classList.remove('no-scroll');
  }, [selected]);

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
    return CATALOG.filter((p) => {
      const matchCat =
        category === 'todos' ||
        (category === 'mas-pedidos'
          ? p.insignias.includes('Top Ventas')
          : p.categoria === category);
      const matchQ = !q || p.nombre.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, category]);

  return (
    <>
      {showSplash && <Splash onEnter={handleEnter} />}

      <Header
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
      />

      <main className="catalog container">
        {products.length === 0 ? (
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
