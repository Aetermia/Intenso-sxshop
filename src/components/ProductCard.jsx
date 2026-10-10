import React from 'react';
import ProductArt from './ProductArt.jsx';
import './ProductCard.css';

export function formatARS(n) {
  return '$' + n.toLocaleString('es-AR');
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
          <div className="card__price">{formatARS(product.precio)}</div>
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
