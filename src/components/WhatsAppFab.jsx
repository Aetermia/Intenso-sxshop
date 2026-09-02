import React from 'react';
import { STORE } from '../data/config.js';
import './WhatsAppFab.css';

const MESSAGE = 'Hola! Quería hacerte una consulta sobre un producto.';

export default function WhatsAppFab() {
  const url = `https://wa.me/${STORE.phone}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      className="wa-fab"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20l1.4-4.9A8 8 0 1 1 9 19L4 20z" />
        <path d="M8.5 10.5c.3 2.6 2.4 4.7 5 5" />
      </svg>
    </a>
  );
}
