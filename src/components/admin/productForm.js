// Lógica pura del formulario de productos del panel (sin JSX): estado
// inicial, conversión producto <-> formulario, validación y armado de lo que
// se manda a la API. Se puede probar directo con Node.
import { CATEGORY_TINT, REAL_CATEGORIES } from '../../data/config.js';
import { PROMO_TYPES } from '../../utils/pricing.js';
import { normalizeVariantes } from '../../utils/variants.js';
import { productImages } from '../../utils/product.js';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function emptyOption() {
  return { nombre: '', descripcion: '', precio: '' };
}

export function emptyVariantGroup() {
  return { label: '', options: [emptyOption()] };
}

export function emptyForm() {
  return {
    nombre: '',
    categoria: REAL_CATEGORIES[0].id,
    // Variantes configurables: cada producto define las que necesite
    // (Color, Talle, Tamaño...). [{ label, options: [{ nombre, descripcion, precio }] }]
    variantGroups: [],
    precio: '',
    descripcion: '',
    instrucciones: '',
    // Fotos (ver ImagesField.jsx): [{ key, preview, nombre, url, file }]
    images: [],
    // Texto decorativo, NO cambia precios.
    promo: '',
    // Descuentos reales (ver src/utils/pricing.js).
    descuentoPorcentaje: '',
    tipoPromocion: PROMO_TYPES.NONE,
    descuentoSegundaUnidad: '',
  };
}

// Valor de un input de porcentaje -> entero entre 0 y 100.
function percentFromInput(value) {
  const n = Math.round(Number(value) || 0);
  return Math.min(100, Math.max(0, n));
}

// Grupos del formulario -> objeto `variantes` que se guarda:
//   { Talle: [{ nombre: 'S', descripcion: '65x25 cm', precio: 25000 }, ...] }
// Precio vacío o 0 -> null (la opción hereda el precio base del producto).
export function variantGroupsToVariantes(groups) {
  const variantes = {};
  groups.forEach((g) => {
    const label = g.label.trim();
    if (!label) return;
    const seen = new Set();
    const options = g.options
      .map((o) => {
        const precio = Math.round(Number(o.precio));
        return {
          nombre: o.nombre.trim(),
          descripcion: o.descripcion.trim(),
          precio: Number.isFinite(precio) && precio > 0 ? precio : null,
        };
      })
      .filter((o) => o.nombre && !seen.has(o.nombre) && seen.add(o.nombre));
    if (options.length) variantes[label] = options;
  });
  return variantes;
}

// Producto guardado -> estado del formulario para editarlo.
export function productToForm(product) {
  return {
    nombre: product.nombre,
    categoria: product.categoria,
    variantGroups: normalizeVariantes(product).map((g) => ({
      label: g.grupo,
      options: g.opciones.map((o) => ({
        nombre: o.nombre,
        descripcion: o.descripcion || '',
        precio: o.precio ? String(o.precio) : '',
      })),
    })),
    precio: String(product.precio),
    descripcion: product.descripcion,
    instrucciones: product.instrucciones || '',
    images: productImages(product).map((url, i) => ({
      key: `actual-${i}-${url}`,
      preview: url,
      nombre: `Foto actual ${i + 1}`,
      url,
      file: null,
    })),
    promo: product.promo || '',
    descuentoPorcentaje: product.descuentoPorcentaje ? String(product.descuentoPorcentaje) : '',
    tipoPromocion: Object.values(PROMO_TYPES).includes(product.tipoPromocion)
      ? product.tipoPromocion
      : PROMO_TYPES.NONE,
    descuentoSegundaUnidad: product.descuentoSegundaUnidad ? String(product.descuentoSegundaUnidad) : '',
  };
}

// Devuelve el primer error del formulario, o '' si está todo bien.
export function validateForm(form) {
  if (!form.nombre.trim()) return 'Ponele un nombre al producto.';
  if (!form.precio || Number(form.precio) <= 0) return 'Cargá un precio válido.';
  if (!form.descripcion.trim()) return 'Escribí una descripción.';
  const pct = Number(form.descuentoPorcentaje || 0);
  if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
    return 'El descuento directo tiene que estar entre 0 y 100.';
  }
  for (const g of form.variantGroups) {
    const filled = g.options.filter((o) => o.nombre.trim() || o.descripcion.trim() || String(o.precio).trim());
    if (!g.label.trim() && filled.length) {
      return 'Ponele nombre a cada grupo de variantes (ej: Talle, Color).';
    }
    if (filled.some((o) => !o.nombre.trim())) {
      return `Cada opción de "${g.label.trim() || 'la variante'}" necesita un nombre.`;
    }
    if (filled.some((o) => String(o.precio).trim() && !(Number(o.precio) >= 0))) {
      return `Revisá los precios de "${g.label.trim()}": tienen que ser números positivos.`;
    }
    const names = filled.map((o) => o.nombre.trim().toLowerCase());
    if (new Set(names).size !== names.length) {
      return `Hay opciones repetidas en "${g.label.trim()}".`;
    }
  }
  if (form.tipoPromocion === PROMO_TYPES.SEGUNDA_UNIDAD) {
    const pct2 = Number(form.descuentoSegundaUnidad || 0);
    if (!Number.isFinite(pct2) || pct2 <= 0 || pct2 > 100) {
      return 'Indicá el descuento de la 2da unidad (entre 1 y 100).';
    }
  }
  return '';
}

// Campos comunes a la vista previa y a lo que se guarda.
function commonFields(form) {
  return {
    categoria: form.categoria,
    descuentoPorcentaje: percentFromInput(form.descuentoPorcentaje),
    tipoPromocion: form.tipoPromocion,
    descuentoSegundaUnidad:
      form.tipoPromocion === PROMO_TYPES.SEGUNDA_UNIDAD ? percentFromInput(form.descuentoSegundaUnidad) : 0,
    tinte: CATEGORY_TINT[form.categoria] || CATEGORY_TINT.juguetes,
    variantes: variantGroupsToVariantes(form.variantGroups),
  };
}

// Producto "de mentira" para la vista previa (tarjeta y ficha).
export function formToPreview(form, insignias = []) {
  return {
    ...commonFields(form),
    id: 'vista-previa',
    nombre: form.nombre.trim() || 'Nombre del producto',
    precio: Number(form.precio) || 0,
    insignias,
    promo: form.promo.trim() || undefined,
    descripcion: form.descripcion.trim() || 'La descripción que cargues va a aparecer acá.',
    instrucciones: form.instrucciones.trim(),
    imagen: form.images[0]?.preview || undefined,
    imagenes: form.images.map((img) => img.preview),
  };
}

// Lo que se manda a la API (mismos nombres que devuelve products.php), sin
// las fotos: esas se suben aparte y se agregan como `imagenes`. Insignias y
// stock no se tocan desde el formulario: al editar, el servidor conserva lo
// que el producto ya tenía.
export function formToPayload(form) {
  return {
    ...commonFields(form),
    nombre: form.nombre.trim(),
    precio: Math.round(Number(form.precio)),
    descripcion: form.descripcion.trim(),
    instrucciones: form.instrucciones.trim(),
    promo: form.promo.trim(),
  };
}

// Valida tipo y peso de las fotos elegidas. Devuelve el error o ''.
export function validateImageFiles(files) {
  if (files.some((f) => !IMAGE_TYPES.includes(f.type))) return 'Subí imágenes JPG, PNG o WEBP.';
  if (files.some((f) => f.size > MAX_IMAGE_BYTES)) {
    return 'Alguna imagen pesa mucho. Probá con fotos de menos de 5 MB.';
  }
  return '';
}

// Lee los archivos para mostrarlos antes de subirlos. Respeta el orden en
// que se eligieron (cada lectura termina cuando quiere).
export function readImageFiles(files) {
  const read = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({ key: `${Date.now()}-${Math.random()}`, preview: reader.result, nombre: file.name, url: '', file });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  return Promise.all(files.map(read)).then((list) => list.filter(Boolean));
}
