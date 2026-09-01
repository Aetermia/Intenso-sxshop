import React from 'react';
import './ProductArt.css';

// Siluetas SVG estilizadas por categoria para los packshots placeholder.
const ICONS = {
  juguetes: (
    <svg viewBox="0 0 100 100" className="art__icon-svg" aria-hidden="true">
      <path
        d="M28 82c-6-4-9-11-9-19 0-11 9-20 20-20h8c6-8 16-13 27-13 11 0 17-8 17-17"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="38" cy="46" r="5" fill="currentColor" opacity="0.8" />
      <path
        d="M66 34c9 4 14 12 14 21 0 9-5 17-13 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  ),
  lenceria: (
    <svg viewBox="0 0 100 100" className="art__icon-svg" aria-hidden="true">
      <path
        d="M30 30c10-8 30-8 40 0 2 1 3 3 3 5l-6 22c-2 9-4 14-8 17l-5-6-5 6c-4-3-6-8-8-17l-6-22c0-2 1-4 3-5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M36 40v20M64 40v20M50 46v28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  lubricantes: (
    <svg viewBox="0 0 100 100" className="art__icon-svg" aria-hidden="true">
      <rect
        x="38"
        y="22"
        width="24"
        height="10"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M34 34h32l6 40a6 6 0 0 1-6 7H34a6 6 0 0 1-6-7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="60" r="7" fill="currentColor" opacity="0.85" />
    </svg>
  ),
  parejas: (
    <svg viewBox="0 0 100 100" className="art__icon-svg" aria-hidden="true">
      <circle
        cx="34"
        cy="50"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
      />
      <circle
        cx="66"
        cy="50"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
      />
      <circle cx="34" cy="50" r="5" fill="currentColor" opacity="0.7" />
      <circle cx="66" cy="50" r="5" fill="currentColor" opacity="0.7" />
    </svg>
  ),
  bdsm: (
    <svg viewBox="0 0 100 100" className="art__icon-svg" aria-hidden="true">
      <path
        d="M30 22v26c0 10 8 18 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M70 78V52c0-10-8-18-18-18"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="30" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="70" cy="80" r="6" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M50 34l8-12M50 34l-8-4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
};

// Producto categorizado por su id para elegir icono mas preciso.
function iconFor(product) {
  const id = product.id || '';
  if (id.includes('lenceria') || id.includes('bodysuit')) return ICONS.lenceria;
  if (id.includes('lubricante') || id.includes('aceite') || id.includes('vela'))
    return ICONS.lubricantes;
  if (id.includes('anillo') || id.includes('osito') || id.includes('parejas'))
    return ICONS.parejas;
  if (id.includes('arnes') || id.includes('esposas') || id.includes('paleta'))
    return ICONS.bdsm;
  return ICONS.juguetes;
}

export default function ProductArt({ product, size = 'card' }) {
  const gradient = `radial-gradient(circle at 30% 20%, ${product.tinte[0]}, ${product.tinte[1]} 55%, #090909 130%)`;
  const icon = iconFor(product);

  return (
    <div className={`art art--${size}`}>
      <div className="art__bg" style={{ background: gradient }} aria-hidden="true" />
      <div className="art__glow" aria-hidden="true" />
      <div className="art__icon">{icon}</div>
      <div className="art__base" aria-hidden="true" />
    </div>
  );
}
