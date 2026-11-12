// Configuracion central de Intenso Tandil.

export const STORE = {
  name: 'Intenso Tandil',
  phone: '5492494247314', // Numero oficial de WhatsApp
  address: '9 de Julio 555, Tandil',
  instagram: '@intenso.tandil',
  instagramUrl: 'https://www.instagram.com/intensotandil?stkn=bDR6ZHJuaDQ5NnVz',
};

export const AETERMIA_INSTAGRAM_URL =
  'https://www.instagram.com/aetermia_soluciones?stkn=MnUyOGtuN3BhOWhq';

export const AETERMIA_WEBSITE_URL = 'https://soluciones.aetermia.site/';

// Link de WhatsApp listo para usar (con mensaje precargado opcional).
export function whatsappUrl(message) {
  const base = `https://wa.me/${STORE.phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// "5492494247314" -> "+54 9 2494 247314", solo para mostrar en pantalla.
export function phoneDisplay() {
  const p = STORE.phone;
  return `+${p.slice(0, 2)} ${p.slice(2, 3)} ${p.slice(3, 7)} ${p.slice(7)}`;
}

// Categorías con subcategorías opcionales. Un producto puede tener como
// `categoria` el id de una categoría "simple" (ej: 'lubricantes'), el id de
// una subcategoría (ej: 'lenceria-mujer'), o el id de una categoría con
// subcategorías para quedar en su "Ver todo" (ej: 'juguetes' sin más).
export const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'mas-pedidos', label: 'Más pedidos' },
  {
    id: 'juguetes',
    label: 'Juguetes',
    subcategories: [
      { id: 'juguetes-parejas', label: 'Para parejas' },
      { id: 'juguetes-anillos', label: 'Anillos' },
      { id: 'juguetes-bolas-kegel', label: 'Bolas Kegel' },
      { id: 'juguetes-bombas-vacio', label: 'Bombas de Vacío' },
      { id: 'juguetes-succionadores', label: 'Succionadores' },
      { id: 'juguetes-estimuladores', label: 'Estimuladores' },
      { id: 'juguetes-masturbadores', label: 'Masturbadores' },
      { id: 'juguetes-strap-on', label: 'Strap On' },
      { id: 'juguetes-dildos', label: 'Dildos' },
      { id: 'juguetes-anal-toys', label: 'Anales' },
      { id: 'juguetes-vibradores', label: 'Vibradores' },
      { id: 'juguetes-masajeadores', label: 'Masajeadores' },
      { id: 'juguetes-internacional', label: 'Internacional' },
    ],
  },
  { id: 'juegos', label: 'Juegos' },
  {
    id: 'lenceria',
    label: 'Lencería',
    subcategories: [
      { id: 'lenceria-mujer', label: 'Lencería Mujer' },
      { id: 'lenceria-hombre', label: 'Lencería Hombre' },
    ],
  },
  { id: 'lubricantes', label: 'Lubricantes' },
  {
    id: 'cosmetica',
    label: 'Cosmética',
    subcategories: [
      { id: 'cosmetica-masajes', label: 'Para masajes' },
      { id: 'cosmetica-perfumes', label: 'Perfumes' },
    ],
  },
  { id: 'suplementos-potenciadores', label: 'Suplementos y Potenciadores' },
  { id: 'bdsm', label: 'BDSM' },
];

// Categorías "reales" (sin Todos / Más pedidos), tal cual se recorren para
// armar menús y el selector del admin.
export const REAL_CATEGORIES = CATEGORIES.filter(
  (c) => c.id !== 'todos' && c.id !== 'mas-pedidos'
);

// Etiqueta de una categoría o subcategoría por id, para mostrar la activa.
export function categoryLabel(id) {
  for (const c of CATEGORIES) {
    if (c.id === id) return c.label;
    const sub = c.subcategories?.find((s) => s.id === id);
    if (sub) return sub.label;
  }
  return null;
}

// Un producto matchea un id de categoría/subcategoría seleccionado si:
// - es exactamente su `categoria`, o
// - el id seleccionado es una categoría "padre" con subcategorías y el
//   producto está en esa categoría padre o en cualquiera de sus hijas
//   (eso arma el "Ver todo en X").
export function productMatchesCategory(product, id) {
  if (product.categoria === id) return true;
  const parent = CATEGORIES.find((c) => c.id === id && c.subcategories);
  if (!parent) return false;
  return parent.subcategories.some((s) => s.id === product.categoria);
}

// Colores [inicio, fin] del fondo de la tarjeta cuando un producto no tiene
// foto, según su categoría.
export const CATEGORY_TINT = {
  juguetes: ['#DC015B', '#A80044'],
  'juguetes-parejas': ['#e07bd0', '#9c27b0'],
  juegos: ['#F4A6C1', '#DC015B'],
  lenceria: ['#D63384', '#8e0f58'],
  'lenceria-mujer': ['#D63384', '#8e0f58'],
  'lenceria-hombre': ['#6b4a5a', '#2b1620'],
  lubricantes: ['#f5426b', '#c2185b'],
  cosmetica: ['#f8a5c2', '#b8945f'],
  'cosmetica-masajes': ['#ffb74d', '#e65100'],
  'cosmetica-perfumes': ['#f8bbd0', '#ad1457'],
  'suplementos-potenciadores': ['#ff9d4d', '#DC015B'],
  bdsm: ['#3a3a3a', '#141414'],
};
