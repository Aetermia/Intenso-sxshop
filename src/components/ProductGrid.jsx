import React from 'react';
import ProductCard from './ProductCard.jsx';
import './ProductGrid.css';

export default function ProductGrid({ products, onOpen }) {
  return (
    <section className="grid" aria-label="Catálogo de productos">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onOpen={onOpen} />
      ))}
    </section>
  );
}
