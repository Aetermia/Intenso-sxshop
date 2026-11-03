import React from 'react';
import Logo from './Logo.jsx';
import './DiscreetBanner.css';

// Antes era un carrusel de productos destacados con esta tarjeta fija al
// costado; el carrusel se sacó a pedido del cliente y quedó solo esto.
export default function DiscreetBanner() {
  return (
    <section className="discreet-banner" aria-label="Envíos discretos">
      <div className="container discreet-banner__wrap">
        <div className="discreet-banner__card">
          <Logo size="md" className="discreet-banner__logo" />
          <p className="discreet-banner__text">
            Tu pedido viaja en una caja neutra, sin logos ni nombres que lo
            delaten. <strong>Envíos 100% discretos</strong>, en Tandil y a
            todo el país.
          </p>
        </div>
      </div>
    </section>
  );
}
