import React from 'react';
import { STORE } from '../data/config.js';
import Logo from './Logo.jsx';
import './TermsPage.css';

const SECTIONS = [
  {
    title: '1. Quiénes somos',
    body: `${STORE.name} es una tienda online de artículos para adultos. Al comprar o navegar en este sitio aceptás los términos descriptos a continuación.`,
  },
  {
    title: '2. Mayoría de edad',
    body: 'Este sitio y sus productos están destinados exclusivamente a personas mayores de 18 años. Al realizar una compra, declarás ser mayor de edad.',
  },
  {
    title: '3. Productos',
    body: 'Hacemos lo posible para que las fotos y descripciones reflejen fielmente cada producto. Pueden existir pequeñas variaciones de color o diseño respecto de la imagen publicada. Todos los artículos son nuevos y de primera calidad.',
  },
  {
    title: '4. Precios y medios de pago',
    body: 'Los precios están expresados en pesos argentinos (ARS) y pueden modificarse sin previo aviso. Aceptamos efectivo al momento de la entrega o el retiro, transferencia bancaria y MercadoPago. En el resumen bancario o de MercadoPago figura un nombre neutral, sin referencia al contenido del pedido.',
  },
  {
    title: '5. Pedidos',
    body: 'Los pedidos se arman desde el carrito de la web y se confirman por WhatsApp, donde coordinamos stock, forma de pago, envío o retiro. El pedido se considera confirmado una vez acordado por ese medio.',
  },
  {
    title: '6. Envíos y discreción',
    body: 'Todos los pedidos viajan en un paquete neutro, sin logos ni nombres que revelen el contenido. Hacemos delivery y retiro en Tandil, y envíos a todo el país por correo. Los plazos de entrega aproximados figuran en nuestra sección de Preguntas Frecuentes.',
  },
  {
    title: '7. Cambios y devoluciones',
    body: 'Por tratarse de productos de uso íntimo, y por razones de higiene y salud, no se aceptan cambios ni devoluciones una vez abierto el packaging, salvo defecto de fabricación. Ante cualquier problema con tu pedido, escribinos por WhatsApp dentro de las 48 horas de recibido.',
  },
  {
    title: '8. Privacidad de tus datos',
    body: 'Tus datos personales (nombre, dirección, teléfono) se usan únicamente para gestionar tu pedido y nunca se comparten con terceros ni se utilizan con fines comerciales ajenos a la compra.',
  },
  {
    title: '9. Modificaciones',
    body: 'Estos términos pueden actualizarse en cualquier momento. La versión vigente es siempre la publicada en esta página.',
  },
  {
    title: '10. Contacto',
    body: `Ante cualquier duda, escribinos por WhatsApp o visitá nuestro local en ${STORE.address}.`,
  },
];

export default function TermsPage() {
  const goHome = () => {
    window.location.hash = '';
  };

  return (
    <div className="terms">
      <header className="terms__header">
        <a
          className="terms__brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
        >
          <Logo size="sm" />
        </a>
        <a className="terms__back" href="#" onClick={(e) => { e.preventDefault(); goHome(); }}>
          ← Volver a la tienda
        </a>
      </header>

      <main className="terms__content container">
        <h1>Términos y Condiciones</h1>
        <p className="terms__updated">Última actualización: {new Date().getFullYear()}</p>

        {SECTIONS.map((s) => (
          <section key={s.title} className="terms__section">
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </main>
    </div>
  );
}
