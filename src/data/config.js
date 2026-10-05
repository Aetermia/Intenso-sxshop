// Configuracion central de Intenso Tandil.

// Traba simple del panel /admin, solo para que no lo encuentre cualquiera.
// Esto corre en el navegador: no es seguridad real. Cuando conectes Supabase,
// reemplazá AdminGate por el login de verdad y borrá esta constante.
export const ADMIN_PASSPHRASE = 'intenso2026';

export const STORE = {
  name: 'Intenso Tandil',
  phone: '5492494685156', // Numero oficial de WhatsApp (tomado del Instagram @intensotandil)
  address: '9 de Julio 555, Tandil',
  instagram: '@intenso.tandil',
};

export const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'mas-pedidos', label: 'Más pedidos' },
  { id: 'juguetes', label: 'Juguetes' },
  { id: 'lenceria', label: 'Lencer\u00eda' },
  { id: 'lubricantes', label: 'Lubricantes & Cosm\u00e9tica' },
  { id: 'parejas', label: 'Parejas' },
  { id: 'bdsm', label: 'BDSM' },
];
