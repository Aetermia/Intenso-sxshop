// Variantes de producto con descripción y precio propio por opción.
//
// Formato nuevo (lo que guarda el panel y la base, columna JSON `variantes`):
//   { "Talle": [ { "nombre": "S", "descripcion": "65x25 cm", "precio": 25000 },
//                { "nombre": "M", "descripcion": "80x30 cm", "precio": 30000 } ] }
//
// Formato viejo (sigue funcionando): listas de textos planos, con las medidas
// opcionales en un campo aparte `medidas`:
//   variantes: { "Tamaño": ["Chico", "Mediano"] }
//   medidas:   { "Tamaño": { "Mediano": "talle M" } }
//
// Reglas de precio:
//   - Si `precio` de una opción está vacío o en 0, hereda el precio base.
//   - Si hay varios grupos con precio propio, manda el primer grupo (en el
//     orden cargado) cuya opción elegida tenga precio.
// Sin JSX, para poder probarlo directo con Node.

function toPrice(value) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Una opción (string u objeto) -> { nombre, descripcion, precio|null }.
export function normalizeOption(opt, legacyMedida) {
  if (opt && typeof opt === 'object') {
    return {
      nombre: String(opt.nombre ?? opt.name ?? '').trim(),
      descripcion: String(opt.descripcion ?? legacyMedida ?? '').trim(),
      precio: toPrice(opt.precio),
    };
  }
  return {
    nombre: String(opt ?? '').trim(),
    descripcion: String(legacyMedida ?? '').trim(),
    precio: null,
  };
}

// Devuelve [{ grupo, opciones: [{ nombre, descripcion, precio }] }] a partir
// de cualquiera de los dos formatos. Ignora grupos/opciones vacíos.
export function normalizeVariantes(product) {
  const raw = product?.variantes;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return [];
  const medidas = product?.medidas || {};
  return Object.entries(raw)
    .map(([grupo, options]) => {
      let list = options;
      // Tolerancia: "S, M, L" guardado como un solo texto.
      if (typeof list === 'string') list = list.split(',');
      if (!Array.isArray(list)) return null;
      const opciones = list
        .map((opt) => {
          const nombre = typeof opt === 'object' && opt ? opt.nombre : opt;
          return normalizeOption(opt, medidas?.[grupo]?.[String(nombre ?? '').trim()]);
        })
        .filter((o) => o.nombre);
      return opciones.length ? { grupo: String(grupo).trim(), opciones } : null;
    })
    .filter((g) => g && g.grupo);
}

export function findOption(groups, grupo, nombre) {
  const g = groups.find((x) => x.grupo === grupo);
  return g ? g.opciones.find((o) => o.nombre === nombre) || null : null;
}

// "S (65x25 cm)" o "S".
export function optionText(opt) {
  if (!opt) return '';
  return opt.descripcion ? `${opt.nombre} (${opt.descripcion})` : opt.nombre;
}

// Precio base que corresponde a la selección { grupo: nombreOpcion }.
export function precioVariante(product, selection) {
  const groups = normalizeVariantes(product);
  for (const g of groups) {
    const opt = findOption(groups, g.grupo, selection?.[g.grupo]);
    if (opt && opt.precio) return opt.precio;
  }
  return Math.max(0, Math.round(Number(product?.precio) || 0));
}

// Mínimo y máximo de precio posibles (para mostrar "Desde $X" en la tarjeta).
export function rangoPrecios(product) {
  const base = Math.max(0, Math.round(Number(product?.precio) || 0));
  const groups = normalizeVariantes(product);
  const priced = groups.find((g) => g.opciones.some((o) => o.precio));
  if (!priced) return { min: base, max: base };
  const precios = priced.opciones.map((o) => o.precio || base);
  return { min: Math.min(...precios), max: Math.max(...precios) };
}

// El producto "visto" con la selección aplicada: mismo objeto pero con el
// precio de la variante, así todo el cálculo de descuentos/promos de
// pricing.js funciona sin cambios.
export function productoConVariante(product, selection) {
  return { ...product, precio: precioVariante(product, selection) };
}

// Ítem listo para el carrito: guarda la selección (clave estable para
// distinguir ítems), el detalle de cada opción y el precio de la variante.
export function buildCartItem(product, selection, quantity) {
  const groups = normalizeVariantes(product);
  const variant = {};
  const variantDetails = [];
  groups.forEach((g) => {
    const opt = findOption(groups, g.grupo, selection?.[g.grupo]);
    if (!opt) return;
    variant[g.grupo] = opt.nombre;
    variantDetails.push({
      grupo: g.grupo,
      nombre: opt.nombre,
      descripcion: opt.descripcion,
      precio: opt.precio,
    });
  });
  const precioProducto = Math.max(0, Math.round(Number(product?.precio) || 0));
  return {
    ...product,
    precioProducto,
    precio: precioVariante(product, variant),
    variant,
    variantDetails,
    quantity,
  };
}

// Texto de la variante de un ítem del carrito.
//   colon=true  -> "Talle: S (65x25 cm)"
//   colon=false -> "Talle S (65x25 cm)"
// Acepta ítems viejos guardados en localStorage (solo `variant`).
export function itemVariantLabel(item, { colon = true, sep = ' / ' } = {}) {
  const details = Array.isArray(item?.variantDetails) && item.variantDetails.length
    ? item.variantDetails
    : Object.entries(item?.variant || {}).map(([grupo, nombre]) => ({ grupo, nombre, descripcion: '' }));
  return details
    .filter((d) => d && d.nombre)
    .map((d) => `${d.grupo}${colon ? ': ' : ' '}${optionText(d)}`)
    .join(sep);
}
