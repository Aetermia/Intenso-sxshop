// Configuracion central de Intenso Tandil.

// Traba simple del panel /admin, solo para que no lo encuentre cualquiera.
// Esto corre en el navegador: no es seguridad real. Cuando conectes Supabase,
// reemplazá AdminGate por el login de verdad y borrá esta constante.
export const ADMIN_PASSPHRASE = 'intenso2026';

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
    subcategories: [{ id: 'juguetes-parejas', label: 'Para parejas' }],
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
