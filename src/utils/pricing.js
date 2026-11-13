// Cálculo de precios con descuentos y promociones.
//
// Campos del producto que se usan (todos opcionales, para que los productos
// viejos sin promo sigan funcionando igual):
//   precio                  -> precio base en ARS (entero)
//   descuentoPorcentaje     -> % directo sobre el precio (0 a 100)
//   tipoPromocion           -> 'NONE' | '2X1' | '2DA_UNIDAD_DESCUENTO'
//   descuentoSegundaUnidad  -> % sobre la 2da unidad de cada par
//
// Todo se trabaja en pesos enteros con Math.round, así nunca aparecen
// decimales del tipo 6999.999999.

// "$10.000" (formato argentino, siempre entero).
export function formatARS(n) {
  return '$' + Math.round(Number(n) || 0).toLocaleString('es-AR');
}

export const PROMO_TYPES = {
  NONE: 'NONE',
  DOS_POR_UNO: '2X1',
  SEGUNDA_UNIDAD: '2DA_UNIDAD_DESCUENTO',
};

function clampPercent(value) {
  const n = Math.round(Number(value) || 0);
  return Math.min(100, Math.max(0, n));
}

function toInt(value) {
  return Math.max(0, Math.round(Number(value) || 0));
}

// Normaliza los campos de promo de un producto (o ítem del carrito).
export function getPromo(product) {
  const tipoRaw = String(product?.tipoPromocion || 'NONE').toUpperCase();
  const tipo = Object.values(PROMO_TYPES).includes(tipoRaw) ? tipoRaw : PROMO_TYPES.NONE;
  const descuento = clampPercent(product?.descuentoPorcentaje);
  const segunda = tipo === PROMO_TYPES.SEGUNDA_UNIDAD ? clampPercent(product?.descuentoSegundaUnidad) : 0;
  return {
    descuentoPorcentaje: descuento,
    // Una "2da unidad al 0%" no es promo: se trata como sin promoción.
    tipoPromocion: tipo === PROMO_TYPES.SEGUNDA_UNIDAD && segunda === 0 ? PROMO_TYPES.NONE : tipo,
    descuentoSegundaUnidad: segunda,
  };
}

export function precioBase(product) {
  return toInt(product?.precio);
}

// Precio unitario después del descuento directo (sin promo por volumen).
export function precioConDescuentoDirecto(product) {
  const base = precioBase(product);
  const { descuentoPorcentaje } = getPromo(product);
  if (!descuentoPorcentaje) return base;
  return Math.round((base * (100 - descuentoPorcentaje)) / 100);
}

export function tieneDescuentoDirecto(product) {
  return getPromo(product).descuentoPorcentaje > 0 && precioBase(product) > 0;
}

export function tienePromoVolumen(product) {
  return getPromo(product).tipoPromocion !== PROMO_TYPES.NONE;
}

// Subtotal real de un ítem según la cantidad:
//   2X1: de cada par se paga 1 (2 u. = 1 precio, 3 u. = 2 precios).
//   2DA_UNIDAD_DESCUENTO: la 2da unidad de cada par lleva el % indicado,
//     calculado sobre el precio unitario ya con el descuento directo.
//   Sin promo por volumen: cantidad × precio con descuento directo.
export function calcularSubtotalItem(product, cantidad) {
  const qty = toInt(cantidad);
  if (!qty) return 0;
  const unit = precioConDescuentoDirecto(product);
  const { tipoPromocion, descuentoSegundaUnidad } = getPromo(product);

  if (tipoPromocion === PROMO_TYPES.DOS_POR_UNO) {
    return Math.ceil(qty / 2) * unit;
  }
  if (tipoPromocion === PROMO_TYPES.SEGUNDA_UNIDAD) {
    const pares = Math.floor(qty / 2);
    const segundaUnidad = Math.round((unit * (100 - descuentoSegundaUnidad)) / 100);
    return (qty - pares) * unit + pares * segundaUnidad;
  }
  return qty * unit;
}

// Lo que pagaría sin ninguna promo: cantidad × precio base.
export function calcularSubtotalOriginalItem(product, cantidad) {
  return toInt(cantidad) * precioBase(product);
}

export function calcularAhorroTotalItem(product, cantidad) {
  return calcularSubtotalOriginalItem(product, cantidad) - calcularSubtotalItem(product, cantidad);
}

// true si la promo por volumen realmente se aplicó con esta cantidad
// (con 1 sola unidad, el 2x1 todavía no rinde).
export function promoVolumenAplicada(product, cantidad) {
  return tienePromoVolumen(product) && toInt(cantidad) >= 2;
}

// Textos de las insignias automáticas, ej: ['30% OFF', '2x1'].
export function promoBadges(product) {
  const { descuentoPorcentaje, tipoPromocion, descuentoSegundaUnidad } = getPromo(product);
  const out = [];
  if (descuentoPorcentaje > 0) out.push(`${descuentoPorcentaje}% OFF`);
  if (tipoPromocion === PROMO_TYPES.DOS_POR_UNO) out.push('2x1');
  if (tipoPromocion === PROMO_TYPES.SEGUNDA_UNIDAD) {
    out.push(descuentoSegundaUnidad === 100 ? '2da unidad gratis' : `2da unidad al ${descuentoSegundaUnidad}% OFF`);
  }
  return out;
}

// Descripción corta de la promo para el mensaje de WhatsApp.
export function promoLabel(product) {
  const { tipoPromocion, descuentoSegundaUnidad } = getPromo(product);
  if (tipoPromocion === PROMO_TYPES.DOS_POR_UNO) return 'Promo 2x1';
  if (tipoPromocion === PROMO_TYPES.SEGUNDA_UNIDAD) return `Promo 2da unidad al ${descuentoSegundaUnidad}% OFF`;
  return '';
}

// Totales del carrito completo.
export function calcularTotalesCarrito(items) {
  let subtotalSinDescuento = 0;
  let totalFinal = 0;
  for (const item of items) {
    subtotalSinDescuento += calcularSubtotalOriginalItem(item, item.quantity);
    totalFinal += calcularSubtotalItem(item, item.quantity);
  }
  return {
    subtotalSinDescuento,
    descuentoTotalAplicado: subtotalSinDescuento - totalFinal,
    totalFinal,
  };
}
