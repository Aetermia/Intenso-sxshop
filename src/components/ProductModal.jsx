import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { PriceDisplay } from './ProductCard.jsx';
import { promoBadges } from '../utils/pricing.js';
import { normalizeVariantes, optionText, productoConVariante, rangoPrecios } from '../utils/variants.js';
import ProductArt from './ProductArt.jsx';
import './ProductModal.css';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const [variants, setVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    setPhotoIndex(0);
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
    // preventScroll: el foco programático puede disparar un scroll-into-view
    // nativo del navegador antes de que useScrollLock (en App.jsx) guarde la
    // posición real del scroll; sin esto, ese guardado queda corrido.
    closeBtnRef.current?.focus({ preventScroll: true });
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  if (!product) return null;

  // Acepta variantes viejas (lista de textos + `medidas`) y nuevas
  // ({ nombre, descripcion, precio }), ver src/utils/variants.js.
  const variantGroups = normalizeVariantes(product);
  const missingVariants = variantGroups.filter((g) => !variants[g.grupo]);
  // Precio en vivo según la opción elegida (con el % OFF recalculado por
  // PriceDisplay). Mientras falte elegir una opción con precio propio, se
  // muestra "Desde" con el más barato.
  const rango = rangoPrecios(product);
  const pricedGroup = variantGroups.find((g) => g.opciones.some((o) => o.precio));
  const priceResolved = !pricedGroup || Boolean(variants[pricedGroup.grupo]) || rango.min === rango.max;
  const shownProduct = priceResolved
    ? productoConVariante(product, variants)
    : { ...product, precio: rango.min };
  const canAdd = !product.sinStock && missingVariants.length === 0;

  // Fotos del producto (hasta 3). Los productos viejos o del catálogo de
  // ejemplo solo traen `imagen`.
  const photos = Array.isArray(product.imagenes) && product.imagenes.length
    ? product.imagenes
    : product.imagen ? [product.imagen] : [];
  const currentPhoto = photos[Math.min(photoIndex, photos.length - 1)] || '';
  const stepPhoto = (delta) => setPhotoIndex((i) => (i + delta + photos.length) % photos.length);

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
          <ProductArt product={{ ...product, imagen: currentPhoto }} size="modal" />
          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="modal__gallery-nav modal__gallery-nav--prev"
                onClick={() => stepPhoto(-1)}
                aria-label="Foto anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className="modal__gallery-nav modal__gallery-nav--next"
                onClick={() => stepPhoto(1)}
                aria-label="Foto siguiente"
              >
                ›
              </button>
              <div className="modal__gallery-dots">
                {photos.map((url, i) => (
                  <button
                    type="button"
                    key={url}
                    className={`modal__gallery-dot ${i === photoIndex ? 'modal__gallery-dot--active' : ''}`}
                    onClick={() => setPhotoIndex(i)}
                    aria-label={`Ver foto ${i + 1} de ${photos.length}`}
                    aria-current={i === photoIndex}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="modal__body">
          <div className="modal__badges">
            {promoBadges(product).map((b) => (
              <span key={b} className="badge badge--promo">{b}</span>
            ))}
            {product.sinStock && <span className="badge badge--off">Sin stock</span>}
            {(product.insignias || []).filter((b) => b !== 'Envio Discreto').map((b) => (
              <span key={b} className={`badge ${b === 'Top Ventas' ? 'badge--hot' : ''}`}>
                {b}
              </span>
            ))}
          </div>
          <h2 className="modal__title">{product.nombre}</h2>
          <PriceDisplay
            product={shownProduct}
            className="modal__price"
            prefix={priceResolved ? undefined : 'Desde'}
          />

          <p className="modal__desc">{product.descripcion}</p>
          <h3 className="modal__subtitle">Cómo usarlo</h3>
          <p className="modal__instructions">{product.instrucciones}</p>

          {variantGroups.map(({ grupo: k, opciones }) => {
            const selected = opciones.find((o) => o.nombre === variants[k]);
            // Descripciones cortas ("65x25 cm") van dentro del botón; las
            // largas se muestran debajo al elegir la opción.
            const isShort = (o) => o.descripcion && o.descripcion.length <= 24;
            return (
              <div className="modal__field" key={k}>
                <span className="modal__field-label">
                  {k}
                  {!variants[k] && <span className="modal__field-required">· elegí una opción</span>}
                </span>
                <div className="modal__options">
                  {opciones.map((opt) => (
                    <button
                      type="button"
                      key={opt.nombre}
                      className={`modal__option ${variants[k] === opt.nombre ? 'modal__option--active' : ''}`}
                      aria-pressed={variants[k] === opt.nombre}
                      onClick={() => setVariants({ ...variants, [k]: opt.nombre })}
                    >
                      {isShort(opt) ? optionText(opt) : opt.nombre}
                    </button>
                  ))}
                </div>
                {selected?.descripcion && !isShort(selected) && (
                  <p className="modal__medida">{selected.descripcion}</p>
                )}
              </div>
            );
          })}

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
