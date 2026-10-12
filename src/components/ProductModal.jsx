import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { formatARS } from './ProductCard.jsx';
import ProductArt from './ProductArt.jsx';
import './ProductModal.css';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const [variants, setVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    // No se preselecciona ninguna opción: si hay talle/color, el cliente
    // tiene que elegirlo a propósito antes de poder agregar al carrito.
    setVariants({});
  }, [product]);

  // El bloqueo de scroll de fondo lo maneja App.jsx (useScrollLock) sobre
  // "selected": acá solo Escape, foco inicial, trampa de foco y retorno.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(FOCUSABLE);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    previousFocusRef.current = document.activeElement;
    closeBtnRef.current?.focus();
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [onClose]);

  if (!product) return null;

  const variantKeys = Object.keys(product.variantes || {});
  const missingVariants = variantKeys.filter((k) => !variants[k]);
  const canAdd = !product.sinStock && missingVariants.length === 0;

  const handleAdd = () => {
    if (!canAdd) return;
    addItem(product, variants, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={product.nombre}>
      <div className="modal__backdrop" />
      <div className="modal__panel" onClick={(e) => e.stopPropagation()} ref={panelRef}>
        <button className="modal__close" onClick={onClose} aria-label="Cerrar" ref={closeBtnRef}>
          ×
        </button>

        <div className="modal__gallery">
          <ProductArt product={product} size="modal" />
        </div>

        <div className="modal__body">
          <div className="modal__badges">
            {product.sinStock && <span className="badge badge--off">Sin stock</span>}
            {product.insignias.filter((b) => b !== 'Envio Discreto').map((b) => (
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
                <span className="modal__field-label">
                  {k}
                  {!variants[k] && <span className="modal__field-required">· elegí una opción</span>}
                </span>
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

          {product.sinStock ? (
            <p className="modal__out-of-stock">
              Este producto está sin stock por el momento. Escribinos para avisarte cuando vuelva.
            </p>
          ) : (
            <div className="modal__buy">
              <div className="modal__qty">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Menos">−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} aria-label="Más">+</button>
              </div>
              <button
                className={`modal__add ${added ? 'modal__add--added' : ''}`}
                onClick={handleAdd}
                disabled={!canAdd}
              >
                {added ? 'Agregado ✓' : missingVariants.length ? 'Elegí las opciones' : 'Agregar al Carrito'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
