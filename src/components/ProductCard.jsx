import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import ProductArt from './ProductArt.jsx';
import './ProductCard.css';

export function formatARS(n) {
  return '$' + n.toLocaleString('es-AR');
}

export default function ProductCard({ product, onOpen }) {
  const { addItem } = useCart();

  const quickAdd = (e) => {
    e.stopPropagation();
    const variant = {};
    if (product.variantes?.Color && product.variantes.Color.length) {
      variant.Color = product.variantes.Color[0];
    } else if (product.variantes?.Talle && product.variantes.Talle.length) {
      variant.Talle = product.variantes.Talle[0];
    } else if (product.variantes?.Sabor && product.variantes.Sabor.length) {
      variant.Sabor = product.variantes.Sabor[0];
    } else if (product.variantes) {
      const firstKey = Object.keys(product.variantes)[0];
      if (firstKey) variant[firstKey] = product.variantes[firstKey][0];
    }
    addItem(product, variant, 1);
  };

  const gradient = product.tinte
    ? `linear-gradient(135deg, ${product.tinte[0]}, ${product.tinte[1]})`
    : 'linear-gradient(135deg, #dc015b, #a80044)';

  return (
    <article
      className="card"
      onClick={(e) => {
        if (e.target.closest('.card__btn')) return;
        onOpen(product);
      }}
    >
      <div className="card__media">
        <ProductArt product={product} size="card" />
        <div className="card__badges">
          {product.insignias.map((b) => (
            <span key={b} className={`badge ${b === 'Top Ventas' ? 'badge--hot' : ''}`}>
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="card__body">
        <h3 className="card__title">{product.nombre}</h3>
        <div className="card__price">{formatARS(product.precio)}</div>
        <div className="card__row">
          <button className="card__btn" onClick={quickAdd}>
            Agregar rápido
          </button>
          <span className="card__hint">Ver detalle</span>
        </div>
      </div>
    </article>
  );
}
