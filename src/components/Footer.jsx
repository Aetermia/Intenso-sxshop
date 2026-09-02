import React from 'react';
import './Footer.css';

const TRUST_ITEMS = [
  {
    label: 'Envío 100% discreto',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l9-5 9 5-9 5-9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
    ),
  },
  {
    label: 'Pago seguro y neutro',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
    ),
  },
  {
    label: 'Todo el placer en un solo lugar',
    voice: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c1.2 2.4.6 4-1 5.6C9.4 9.2 9 11 10.5 12.5c-2 0-3.5-1.6-3.5-3.5C5 10.6 4 13 4 15a8 8 0 0 0 16 0c0-4.5-3-8-8-13z" /></svg>
    ),
  },
  {
    label: 'Consultas por WhatsApp',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l1.4-4.9A8 8 0 1 1 9 19L4 20z" /><path d="M8.5 10.5c.3 2.6 2.4 4.7 5 5" /></svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__trustbar">
        {TRUST_ITEMS.map((item) => (
          <div className={`footer__trust-item ${item.voice ? 'footer__trust-item--voice' : ''}`} key={item.label}>
            <span className="footer__trust-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

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
          <p className="footer__contact-line">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></svg>
            @intenso.tandil
          </p>
          <p className="footer__contact-line">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l1.4-4.9A8 8 0 1 1 9 19L4 20z" /><path d="M8.5 10.5c.3 2.6 2.4 4.7 5 5" /></svg>
            WhatsApp: 2494-XXXXXX
          </p>
          <p className="footer__contact-line">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
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
