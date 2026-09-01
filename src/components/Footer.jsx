import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__block">
          <h3 className="footer__brand">
            Intens<span className="footer__brand-o">o</span>
          </h3>
          <p className="footer__seal">
            Envío 100% discreto en Tandil. Caja neutra, sin logos ni nombres
            reveladores en el paquete.
          </p>
        </div>

        <div className="footer__block">
          <h4>Contacto</h4>
          <p>
            Instagram: @intenso.tandil
            <br />
            WhatsApp: 2494-XXXXXX
            <br />
            Lun a Sáb · Tandil, Buenos Aires
          </p>
        </div>

        <div className="footer__block">
          <h4>Garantías</h4>
          <p>
            Tu privacidad es lo primero: discreción absoluta en cada entrega y
            resumen bancario neutral.
          </p>
        </div>
      </div>

      <div className="footer__bar container">
        <p>Aviso legal: la venta de estos productos es exclusiva para mayores de 18 años.</p>
        <p className="footer__copy">© {new Date().getFullYear()} Intenso Tandil. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
