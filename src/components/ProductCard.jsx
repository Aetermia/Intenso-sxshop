import React from 'react';
import ProductArt from './ProductArt.jsx';
import {
  formatARS,
  precioBase,
  precioConDescuentoDirecto,
  promoBadges,
  tieneDescuentoDirecto,
} from '../utils/pricing.js';
import { rangoPrecios } from '../utils/variants.js';
import './ProductCard.css';

// Precio con descuento: el original tachado y el final destacado.
// Sin descuento directo muestra el precio normal, como siempre.
// `prefix` (ej: "Desde") se usa cuando las variantes tienen precios distintos.
export function PriceDisplay({ product, className, prefix }) {
  const pre = prefix ? <span className="price__prefix">{prefix} </span> : null;
  if (!tieneDescuentoDirecto(product)) {
    return <div className={className}>{pre}{formatARS(precioBase(product))}</div>;
  }
  return (
    <div className={`${className} price--discounted`}>
      {pre}
      <s className="price__original" aria-label={`Precio original ${formatARS(precioBase(product))}`}>
        {formatARS(precioBase(product))}
      </s>
      <span className="price__final">{formatARS(precioConDescuentoDirecto(product))}</span>
    </div>
  );
}

export default function ProductCard({ product, onOpen, priceAside }) {
  // Si las variantes tienen precios propios distintos, la tarjeta muestra el
  // más barato con "Desde"; el precio exacto se ve al elegir en el detalle.
  const rango = rangoPrecios(product);
  const hasPriceRange = rango.min !== rango.max;

  return (
    <article className={`card ${product.sinStock ? 'card--sin-stock' : ''}`} onClick={() => onOpen(product)}>
      <div className="card__media">
        <ProductArt product={product} size="card" />
        <div className="card__badges">
          {promoBadges(product).map((b) => (
            <span key={b} className="badge badge--promo">{b}</span>
          ))}
          {product.promo && <span className="badge badge--promo">{product.promo}</span>}
          {product.sinStock && <span className="badge badge--off">Sin stock</span>}
          {(product.insignias || []).filter((b) => b !== 'Envio Discreto').map((b) => (
            <span key={b} className={`badge ${b === 'Top Ventas' ? 'badge--hot' : ''}`}>
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="card__body">
        <h3 className="card__title">{product.nombre}</h3>
        <div className="card__price-row">
          <PriceDisplay
            product={hasPriceRange ? { ...product, precio: rango.min } : product}
            className="card__price"
            prefix={hasPriceRange ? 'Desde' : undefined}
          />
          {priceAside}
        </div>
        <div className="card__row">
          <button type="button" className="card__btn">
            Ver producto
          </button>
        </div>
      </div>
    </article>
  );
}
