// Arma el texto del pedido que se manda por WhatsApp, con el detalle de
// promociones y el ahorro. Sin JSX, para poder probarlo directo con Node.
import {
  calcularAhorroTotalItem,
  calcularSubtotalItem,
  formatARS,
  getPromo,
  precioBase,
  promoLabel,
  promoVolumenAplicada,
  tieneDescuentoDirecto,
} from './pricing.js';

export function variantLabel(variant) {
  if (!variant) return '';
  return Object.values(variant).join(' / ');
}

// Detalle de las promos aplicadas a un ítem, ej: "30% OFF + Promo 2x1 aplicada".
export function itemPromoDetail(item) {
  const parts = [];
  const { descuentoPorcentaje } = getPromo(item);
  if (tieneDescuentoDirecto(item)) parts.push(`${descuentoPorcentaje}% OFF`);
  if (promoVolumenAplicada(item, item.quantity)) parts.push(`${promoLabel(item)} aplicada`);
  return parts.join(' + ');
}

export function buildMessage({
  nombre, entrega, direccion, pago, discreto, notas, items,
  subtotalSinDescuento, descuentoTotalAplicado, totalFinal,
}) {
  const lines = [];
  lines.push('*NUEVO PEDIDO - INTENSO TANDIL*');
  lines.push('');
  lines.push(`*Cliente:* ${nombre}`);
  lines.push(`*Entrega:* ${entrega}${direccion && entrega === 'Delivery Tandil' ? ` - ${direccion}` : ''}`);
  lines.push(`*Medio de Pago:* ${pago}`);
  lines.push(`*Empaque Discreto:* ${discreto ? 'Sí' : 'No'}`);
  lines.push('');
  lines.push('*DETALLE DEL PEDIDO:*');
  items.forEach((i) => {
    const v = variantLabel(i.variant);
    const detalle = itemPromoDetail(i);
    lines.push(
      `- ${i.quantity}x ${i.nombre}${v ? ` (${v})` : ''}${detalle ? ` (${detalle})` : ''} - ${formatARS(calcularSubtotalItem(i, i.quantity))}`
    );
    const ahorro = calcularAhorroTotalItem(i, i.quantity);
    if (ahorro > 0) {
      lines.push(`   Precio base: ${formatARS(precioBase(i))} c/u · Ahorro: ${formatARS(ahorro)}`);
    }
  });
  lines.push('');
  if (descuentoTotalAplicado > 0) {
    lines.push(`*Subtotal:* ${formatARS(subtotalSinDescuento)}`);
    lines.push(`*Ahorro promocional:* -${formatARS(descuentoTotalAplicado)}`);
  }
  lines.push(`*TOTAL:* ${formatARS(totalFinal)}`);
  lines.push(`*Notas:* ${(notas || '').trim() || 'N/A'}`);
  lines.push('');
  lines.push('_Enviado desde la web de Intenso Tandil_');
  return lines.join('\n');
}
