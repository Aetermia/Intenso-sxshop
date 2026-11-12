import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { STORE } from '../data/config.js';
import { formatARS } from './ProductCard.jsx';
import ProductArt from './ProductArt.jsx';
import {
  calcularAhorroTotalItem,
  calcularSubtotalItem,
  calcularSubtotalOriginalItem,
  precioConDescuentoDirecto,
} from '../utils/pricing.js';
import { buildMessage, itemPromoDetail, variantLabel } from '../utils/whatsappOrder.js';
import flameIcon from '../assets/flame-icon-white.png';
import { useScrollLock } from '../hooks/useScrollLock.js';
import './CartDrawer.css';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const ENTREGAS = ['Delivery Tandil', 'Retiro en Punto de Entrega', 'Envío Nacional'];
const PAGOS = ['Efectivo', 'Transferencia Bancaria', 'MercadoPago'];

const emptyCheckoutForm = () => ({
  nombre: '',
  entrega: 'Delivery Tandil',
  direccion: '',
  pago: 'Transferencia Bancaria',
  discreto: true,
  notas: '',
});

export default function CartDrawer() {
  const {
    items, updateQuantity, removeItem, isDrawerOpen, setDrawerOpen, clearCart,
    subtotalSinDescuento, descuentoTotalAplicado, totalFinal,
  } = useCart();
  const [form, setForm] = useState(emptyCheckoutForm);
  const [error, setError] = useState('');
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previousFocusRef = useRef(null);

  useScrollLock(isDrawerOpen);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setDrawerOpen]);

  // Foco inicial al abrir, trampa de foco (Tab no se escapa del panel) y
  // retorno del foco al elemento que abrió el carrito al cerrarlo.
  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    previousFocusRef.current = document.activeElement;
    // preventScroll: evita el mismo bug de "la página salta" que tenía el
    // modal de producto (el foco programático scrolleaba antes de que
    // useScrollLock guardara la posición real).
    closeBtnRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e) => {
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
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [isDrawerOpen]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    setError('');
    if (!form.nombre.trim()) {
      setError('Ingresá tu nombre y apellido para continuar.');
      return;
    }
    if (form.entrega === 'Delivery Tandil' && !form.direccion.trim()) {
      setError('Ingresá tu dirección para el delivery.');
      return;
    }
    const msg = buildMessage({
      ...form,
      items,
      subtotalSinDescuento,
      descuentoTotalAplicado,
      totalFinal,
    });
    const url = `https://wa.me/${STORE.phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    clearCart();
    setForm(emptyCheckoutForm());
    setDrawerOpen(false);
  };

  return (
    <div
      className={`drawer ${isDrawerOpen ? 'drawer--open' : ''}`}
      aria-hidden={!isDrawerOpen}
      {...(!isDrawerOpen ? { inert: '' } : {})}
    >
      <div className="drawer__backdrop" onClick={() => setDrawerOpen(false)} />

      <aside
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        ref={panelRef}
      >
        <header className="drawer__head">
          <h2>
            <img src={flameIcon} alt="" className="drawer__flame" />
            Tu carrito
          </h2>
          <button
            className="drawer__close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar"
            ref={closeBtnRef}
          >
            ×
          </button>
        </header>

        <div className="drawer__items">
          {items.length === 0 ? (
            <p className="drawer__empty">Tu carrito está vacío. ¡A despertar el deseo!</p>
          ) : (
            items.map((item) => {
              const vkey = JSON.stringify(item.variant);
              return (
                <div className="drawer__item" key={item.id + '-' + vkey}>
                  <div className="drawer__item-media">
                    <ProductArt product={item} size="card" />
                  </div>
                  <div className="drawer__item-info">
                    <div className="drawer__item-name">{item.nombre}</div>
                    {variantLabel(item) && (
                      <div className="drawer__item-var">{variantLabel(item)}</div>
                    )}
                    {(item.quantity > 1 || variantLabel(item)) && (
                      <div className="drawer__item-unit">
                        {formatARS(precioConDescuentoDirecto(item))} c/u
                      </div>
                    )}
                    <div className="drawer__item-price">
                      {calcularAhorroTotalItem(item, item.quantity) > 0 && (
                        <s className="drawer__item-price-original">
                          {formatARS(calcularSubtotalOriginalItem(item, item.quantity))}
                        </s>
                      )}
                      {formatARS(calcularSubtotalItem(item, item.quantity))}
                    </div>
                    {itemPromoDetail(item) && (
                      <div className="drawer__item-promo">{itemPromoDetail(item)}</div>
                    )}
                    <div className="drawer__item-controls">
                      <div className="drawer__qty">
                        <button onClick={() => updateQuantity(item.id, vkey, -1)} aria-label="Restar">−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, vkey, 1)} aria-label="Sumar">+</button>
                      </div>
                      <button className="drawer__remove" onClick={() => removeItem(item.id, vkey)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <form
            className="drawer__form"
            noValidate
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          >
            <h3>Datos del pedido</h3>

            <label className="field">
              <span>Nombre y Apellido</span>
              <input
                type="text"
                value={form.nombre}
                onChange={set('nombre')}
                placeholder="Tu nombre"
                required
              />
            </label>

            <label className="field">
              <span>Método de Entrega</span>
              <select value={form.entrega} onChange={set('entrega')}>
                {ENTREGAS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            {form.entrega === 'Delivery Tandil' && (
              <label className="field">
                <span>Dirección de entrega</span>
                <input
                  type="text"
                  value={form.direccion}
                  onChange={set('direccion')}
                  placeholder="Calle, número"
                  required
                />
              </label>
            )}

            <label className="field">
              <span>Medio de Pago</span>
              <select value={form.pago} onChange={set('pago')}>
                {PAGOS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            <label className="field field--check">
              <input
                type="checkbox"
                checked={form.discreto}
                onChange={(e) => setForm((f) => ({ ...f, discreto: e.target.checked }))}
              />
              <span>Empaque 100% Discreto (caja neutra sin logos)</span>
            </label>

            <label className="field">
              <span>Notas / Indicaciones</span>
              <textarea
                value={form.notas}
                onChange={set('notas')}
                rows="2"
                placeholder="Horario, portero, timbre..."
              />
            </label>

            {error && <p className="drawer__error" role="alert">{error}</p>}

            {descuentoTotalAplicado > 0 && (
              <div className="drawer__breakdown">
                <div className="drawer__breakdown-row">
                  <span>Subtotal</span>
                  <span>{formatARS(subtotalSinDescuento)}</span>
                </div>
                <div className="drawer__breakdown-row drawer__breakdown-row--saving">
                  <span>Ahorro promocional</span>
                  <span>-{formatARS(descuentoTotalAplicado)}</span>
                </div>
              </div>
            )}

            <div className="drawer__total">
              <span>Total</span>
              <strong>{formatARS(totalFinal)}</strong>
            </div>

            <button type="submit" className="drawer__submit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20l1.4-4.9A8 8 0 1 1 9 19L4 20z" />
                <path d="M8.5 10.5c.3 2.6 2.4 4.7 5 5" />
              </svg>
              Confirmar y Enviar por WhatsApp
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
