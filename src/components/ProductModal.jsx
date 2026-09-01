import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { formatARS } from './ProductCard.jsx';
import ProductArt from './ProductArt.jsx';
import './ProductModal.css';

export default function ProductModal({ product, onClose }) {
  const { addItem, setDrawerOpen } = useCart();
  const [variants, setVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    if (product?.variantes) {
      const init = {};
      Object.entries(product.variantes).forEach(([k, v]) => {
        init[k] = v[0];
      });
      setVariants(init);
    } else {
      setVariants({});
    }
  }, [product]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    addItem(product, variants, quantity);
    setAdded(true);
    setTimeout(() => {
      onClose();
      setDrawerOpen(true);
    }, 700);
  };

  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={product.nombre}>
      <div className="modal__backdrop" />
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <div className="modal__gallery">
          <ProductArt product={product} size="modal" />
          <span className="modal__seal">Empaque 100% Anónimo y Discreto</span>
        </div>

        <div className="modal__body">
          <div className="modal__badges">
            {product.insignias.map((b) => (
              <span key={b} className={`badge ${b === 'Top Ventas' ? 'badge--hot' : ''}`}>
                {b}
              </span>
            ))}
          </div>
          <h2 className="modal__title">{product.nombre}</h2>
          <div className="modal__price">{formatARS(product.precio)}</div>

          <p className="modal__desc">{product.descripcion}</p>
          <h3 className="modal__subtitle">Cómo usarlo</h3>
          <p className="modal__instructions">{product.instrucciones}</p>

          {product.variantes &&
            Object.entries(product.variantes).map(([k, options]) => (
              <div className="modal__field" key={k}>
                <span className="modal__field-label">{k}</span>
                <div className="modal__options">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      className={`modal__option ${variants[k] === opt ? 'modal__option--active' : ''}`}
                      onClick={() => setVariants({ ...variants, [k]: opt })}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          <div className="modal__buy">
            <div className="modal__qty">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Menos">−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} aria-label="Más">+</button>
            </div>
            <button
              className={`modal__add ${added ? 'modal__add--added' : ''}`}
              onClick={handleAdd}
            >
              {added ? 'Agregado ✓' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
