import React from 'react';
import ProductArt from './ProductArt.jsx';
import {
  formatARS,
  precioBase,
  precioConDescuentoDirecto,
  promoBadges,
  tieneDescuentoDirecto,
} from '../utils/pricing.js';
import './ProductCard.css';

// Se sigue exportando desde acá para no romper imports existentes.
export { formatARS };

// Precio con descuento: el original tachado y el final destacado.
// Sin descuento directo muestra el precio normal, como siempre.
export function PriceDisplay({ product, className }) {
  if (!tieneDescuentoDirecto(product)) {
    return <div className={className}>{formatARS(precioBase(product))}</div>;
  }
  return (
    <div className={`${className} price--discounted`}>
      <s className="price__original" aria-label={`Precio original ${formatARS(precioBase(product))}`}>
        {formatARS(precioBase(product))}
      </s>
      <span className="price__final">{formatARS(precioConDescuentoDirecto(product))}</span>
    </div>
  );
}

export default function ProductCard({ product, onOpen, priceAside }) {
  const gradient = product.tinte
    ? `linear-gradient(135deg, ${product.tinte[0]}, ${product.tinte[1]})`
    : 'linear-gradient(135deg, #dc015b, #a80044)';

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
          {product.insignias.filter((b) => b !== 'Envio Discreto').map((b) => (
            <span key={b} className={`badge ${b === 'Top Ventas' ? 'badge--hot' : ''}`}>
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="card__body">
        <h3 className="card__title">{product.nombre}</h3>
        <div className="card__price-row">
          <PriceDisplay product={product} className="card__price" />
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
