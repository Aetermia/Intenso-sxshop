import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { PriceDisplay } from './ProductCard.jsx';
import { promoBadges } from '../utils/pricing.js';
import { normalizeVariantes, optionText, productoConVariante, rangoPrecios } from '../utils/variants.js';
import ProductArt from './ProductArt.jsx';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { productImages } from '../utils/product.js';
import './ProductModal.css';

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const [variants, setVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const touchStartRef = useRef(null);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    setPhotoIndex(0);
    // No se preselecciona ninguna opción: si hay talle/color, el cliente
    // tiene que elegirlo a propósito antes de poder agregar al carrito.
    setVariants({});
  }, [product]);

  // El bloqueo de scroll de fondo lo maneja quien abre el modal
  // (useScrollLock en App.jsx); acá solo foco y teclado.
  useFocusTrap(panelRef, closeBtnRef, true, onClose);

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

  // Fotos del producto (hasta 3), la principal primero.
  const photos = productImages(product);
  const currentPhoto = photos[Math.min(photoIndex, photos.length - 1)] || '';
  const stepPhoto = (delta) => setPhotoIndex((i) => (i + delta + photos.length) % photos.length);

  // Deslizar con el dedo sobre la foto: izquierda = siguiente, derecha =
  // anterior. Solo cuenta si el gesto es claramente horizontal, para no
  // confundirlo con el scroll vertical de la ficha.
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartRef.current = photos.length > 1 && t ? { x: t.clientX, y: t.clientY } : null;
  };
  const handleTouchEnd = (e) => {
    const start = touchStartRef.current;
    const t = e.changedTouches[0];
    touchStartRef.current = null;
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    stepPhoto(dx < 0 ? 1 : -1);
  };

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

        <div
          className={`modal__gallery ${photos.length > 1 ? 'modal__gallery--multi' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
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
