import React, { useState } from 'react';
import './FAQ.css';

const FAQS = [
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'Aceptamos pagos en efectivo al momento de la entrega o el retiro, transferencia bancaria y MercadoPago. En el resumen bancario y de MercadoPago verás un nombre neutral, sin ninguna referencia al contenido del pedido, para total discreción.',
  },
  {
    q: '¿Cuáles son los tiempos de entrega en Tandil?',
    a: 'Las entregas en Tandil se realizan de lunes a sábado, generalmente dentro de las 24 a 48 horas de confirmado el pedido. Coordinamos el horario por WhatsApp para que sea cómodo para vos.',
  },
  {
    q: '¿Cómo garantizan la discreción?',
    a: 'Todos los pedidos viajan en una caja neutra, sin logos ni nombres que revelen el contenido. En la factura o ticket no figura ninguna descripción de los productos.',
  },
  {
    q: '¿Hacen envíos a todo el país?',
    a: 'Sí. Además del delivery y retiro en Tandil, realizamos envíos nacionales a través de correo con paquete sellado y sin referencias de contenido.',
  },
  {
    q: '¿Hay un requisito de edad?',
    a: 'La venta es exclusiva para personas mayores de 18 años. Al confirmar tu pedido, declarás ser mayor de edad.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq container" id="preguntas">
      <h2 className="faq__title">Preguntas Frecuentes</h2>
      <div className="faq__list">
        {FAQS.map((f, i) => (
          <div className={`faq__item ${open === i ? 'faq__item--open' : ''}`} key={i}>
            <button
              className="faq__question"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
            >
              {f.q}
              <span className="faq__chevron">⌄</span>
            </button>
            <div className="faq__answer">
              <p>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
