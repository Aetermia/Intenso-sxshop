import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { STORE } from '../data/config.js';
import { formatARS } from './ProductCard.jsx';
import ProductArt from './ProductArt.jsx';
import './CartDrawer.css';

function variantLabel(variant) {
  if (!variant) return '';
  return Object.values(variant).join(' / ');
}

function buildMessage({ nombre, entrega, direccion, pago, discreto, notas, items, total }) {
  const lines = [];
  lines.push('*NUEVO PEDIDO - INTENSO TANDIL*');
  lines.push('');
  lines.push(`*Cliente:* ${nombre}`);
  lines.push(`*Entrega:* ${entrega}${direccion && entrega === 'Delivery Tandil' ? ` - ${direccion}` : ''}`);
  lines.push(`*Medio de Pago:* ${pago}`);
  lines.push(`*Empaque Discreto:* ${discreto ? 'Sí' : 'No'}`);
  lines.push('');
  lines.push('*DETALLE DEL PEDIDO:*');
  items.forEach((i) => {
    const v = variantLabel(i.variant);
    lines.push(
      `- ${i.quantity}x ${i.nombre}${v ? ` (${v})` : ''} - ${formatARS(i.precio * i.quantity)}`
    );
  });
  lines.push('');
  lines.push(`*TOTAL:* ${formatARS(total)}`);
  lines.push(`*Notas:* ${notas.trim() || 'N/A'}`);
  lines.push('');
  lines.push('_Enviado desde la web de Intenso Tandil_');
  return lines.join('\n');
}

const ENTREGAS = ['Delivery Tandil', 'Retiro en Punto de Entrega', 'Envío Nacional'];
const PAGOS = ['Efectivo', 'Transferencia Bancaria', 'MercadoPago'];

export default function CartDrawer() {
  const { items, updateQuantity, removeItem, total, isDrawerOpen, setDrawerOpen } = useCart();
  const [form, setForm] = useState({
    nombre: '',
    entrega: 'Delivery Tandil',
    direccion: '',
    pago: 'Transferencia Bancaria',
    discreto: true,
    notas: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setDrawerOpen]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', isDrawerOpen);
    return () => document.body.classList.remove('no-scroll');
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
      total,
    });
    const url = `https://wa.me/${STORE.phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setDrawerOpen(false);
  };

  return (
    <div className={`drawer ${isDrawerOpen ? 'drawer--open' : ''}`} aria-hidden={!isDrawerOpen}>
      <div className="drawer__backdrop" onClick={() => setDrawerOpen(false)} />

      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Carrito de compras">
        <header className="drawer__head">
          <h2>Tu carrito</h2>
          <button className="drawer__close" onClick={() => setDrawerOpen(false)} aria-label="Cerrar">
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
                    {variantLabel(item.variant) && (
                      <div className="drawer__item-var">{variantLabel(item.variant)}</div>
                    )}
                    <div className="drawer__item-price">{formatARS(item.precio * item.quantity)}</div>
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
          <form className="drawer__form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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

            {error && <p className="drawer__error">{error}</p>}

            <div className="drawer__total">
              <span>Total</span>
              <strong>{formatARS(total)}</strong>
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
