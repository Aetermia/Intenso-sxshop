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

export const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'mas-pedidos', label: 'Más pedidos' },
  { id: 'juguetes', label: 'Juguetes' },
  { id: 'juegos', label: 'Juegos' },
  { id: 'lenceria-mujer', label: 'Lencería Mujer' },
  { id: 'lenceria-hombre', label: 'Lencería Hombre' },
  { id: 'lubricantes', label: 'Lubricantes' },
  { id: 'cosmetica', label: 'Cosmética' },
  { id: 'suplementos-potenciadores', label: 'Suplementos y Potenciadores' },
  { id: 'bdsm', label: 'BDSM' },
];
