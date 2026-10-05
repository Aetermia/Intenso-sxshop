import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import ProductArt from './ProductArt.jsx';
import './ProductCard.css';

export function formatARS(n) {
  return '$' + n.toLocaleString('es-AR');
}

export default function ProductCard({ product, onOpen }) {
  const { addItem } = useCart();

  const hasVariants = Object.values(product.variantes || {}).some((opts) => opts && opts.length);

  const quickAdd = (e) => {
    e.stopPropagation();
    if (hasVariants) {
      // Hay talle/color para elegir: no se puede "adivinar" la opción,
      // así que mandamos a la ficha para que el cliente elija.
      onOpen(product);
      return;
    }
    addItem(product, {}, 1);
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
          {product.insignias.filter((b) => b !== 'Envio Discreto').map((b) => (
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
            {hasVariants ? 'Elegir opciones' : 'Agregar rápido'}
          </button>
          <button
            type="button"
            className="card__hint"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(product);
            }}
          >
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
}
