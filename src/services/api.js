// Única puerta de entrada al backend PHP (carpeta backend/ del repo).
// Ningún componente llama a fetch directo: todo pasa por acá.
//
// Dónde está la API:
//   - Por defecto en "/backend/api", o sea en el mismo dominio que el sitio
//     (https://tu-dominio/backend/api/products.php).
//   - Si el backend vive en otro lado, definí VITE_API_URL antes de
//     compilar (ver .env.example).
import { CATEGORY_TINT } from '../data/config.js';

export const API_URL = (import.meta.env.VITE_API_URL || '/backend/api').replace(/\/+$/, '');

// Origen del backend cuando la API está en otro dominio ('' si es el mismo).
const API_ORIGIN = /^https?:\/\//i.test(API_URL) ? new URL(API_URL).origin : '';

const TOKEN_KEY = 'intenso_admin_token';
const DEFAULT_TINT = ['#DC015B', '#A80044'];

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status; // 0 = no hubo respuesta (sin conexión / backend caído)
  }
}

// --- Sesión del panel -------------------------------------------------
// El token vive en sessionStorage: se borra solo al cerrar la pestaña.
export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function setToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* noop */
  }
}

// --- Pedido genérico --------------------------------------------------
async function request(path, { method = 'GET', body, formData, auth = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (auth) {
    const token = getToken();
    if (!token) throw new ApiError('Iniciá sesión de nuevo.', 401);
    headers.Authorization = `Bearer ${token}`;
    // Mismo token en un header propio: hay hostings que no le pasan
    // "Authorization" a PHP (ver backend/auth.php).
    headers['X-Auth-Token'] = token;
  }
  const init = { method, headers };
  if (formData) {
    init.body = formData; // el navegador arma solo el Content-Type multipart
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_URL}/${path}`, init);
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Revisá tu conexión.', 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* respuesta que no es JSON (ej: un 404 en HTML del hosting) */
  }

  if (!res.ok || data === null) {
    const fallback = res.ok
      ? 'El servidor respondió algo inesperado.'
      : `Error del servidor (${res.status}).`;
    // Si la respuesta "ok" no era JSON, casi seguro la API no está en esa
    // dirección: se trata como backend no disponible.
    throw new ApiError(data?.error || fallback, res.ok ? 0 : res.status);
  }
  return data;
}

// --- Productos: formato de la API -> formato que usan los componentes --
// Fotos subidas desde el panel: el backend devuelve una ruta del estilo
// "/backend/uploads/x.jpg". Si la API está en otro dominio hay que
// anteponérselo; las fotos del sitio ("/products/...") quedan como están.
function resolveImage(imagen) {
  if (!imagen) return '';
  if (API_ORIGIN && imagen.startsWith('/') && !imagen.startsWith('/products/')) {
    return API_ORIGIN + imagen;
  }
  return imagen;
}

function toInt(value) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// Deja el producto con la forma exacta que esperan ProductCard, ProductModal,
// el carrito y pricing.js/variants.js, venga como venga de la base.
export function normalizeProduct(raw) {
  const tinte = Array.isArray(raw.tinte) && raw.tinte.length === 2 && raw.tinte[0] && raw.tinte[1]
    ? raw.tinte
    : CATEGORY_TINT[raw.categoria] || DEFAULT_TINT;
  const variantes = raw.variantes && typeof raw.variantes === 'object' && !Array.isArray(raw.variantes)
    ? raw.variantes
    : {};
  // Fotos (hasta 3): la primera es la principal, la que va en la tarjeta.
  const imagenes = (Array.isArray(raw.imagenes) && raw.imagenes.length ? raw.imagenes : [raw.imagen])
    .filter((url) => typeof url === 'string' && url)
    .map(resolveImage);
  return {
    id: Number(raw.id),
    slug: raw.slug || '',
    sku: raw.sku || undefined,
    nombre: raw.nombre || '',
    categoria: raw.categoria || '',
    precio: toInt(raw.precio),
    imagen: imagenes[0] || '',
    imagenes,
    insignias: Array.isArray(raw.insignias) ? raw.insignias.filter((b) => typeof b === 'string') : [],
    variantes,
    descripcion: raw.descripcion || '',
    instrucciones: raw.instrucciones || '',
    promo: raw.promo || undefined,
    descuentoPorcentaje: Math.min(100, toInt(raw.descuentoPorcentaje)),
    tipoPromocion: raw.tipoPromocion || 'NONE',
    descuentoSegundaUnidad: Math.min(100, toInt(raw.descuentoSegundaUnidad)),
    tinte,
    destacado: Boolean(raw.destacado),
    activo: raw.activo !== false,
    sinStock: Boolean(raw.sinStock),
  };
}

// --- Tienda (público) -------------------------------------------------
export async function fetchProducts() {
  const data = await request('products.php');
  if (!Array.isArray(data.products)) throw new ApiError('El servidor respondió algo inesperado.', 0);
  return data.products.map(normalizeProduct);
}

// --- Panel (requiere sesión) -------------------------------------------
export async function login(email, password) {
  const data = await request('login.php', { method: 'POST', body: { email, password } });
  setToken(data.token);
  return data.admin;
}

// Devuelve el admin si el token guardado sigue sirviendo, o null si no.
export async function currentSession() {
  if (!getToken()) return null;
  try {
    const data = await request('me.php', { auth: true });
    return data.admin;
  } catch (err) {
    if (err.status === 401) {
      setToken('');
      return null;
    }
    throw err;
  }
}

export async function logout() {
  try {
    if (getToken()) await request('logout.php', { method: 'POST', auth: true });
  } catch {
    /* si falla igual cerramos la sesión de este navegador */
  }
  setToken('');
}

export function clearSession() {
  setToken('');
}

export async function fetchAllProducts() {
  const data = await request('products.php?all=1', { auth: true });
  return (data.products || []).map(normalizeProduct);
}

export async function createProduct(payload) {
  return normalizeProduct(await request('products.php', { method: 'POST', body: payload, auth: true }));
}

// Editar y borrar van como POST con "_method": hay hostings compartidos
// que bloquean PUT y DELETE antes de que lleguen a PHP.
export async function updateProduct(id, payload) {
  return normalizeProduct(
    await request(`products.php?id=${encodeURIComponent(id)}&_method=PUT`, { method: 'POST', body: payload, auth: true })
  );
}

export async function deleteProduct(id) {
  await request(`products.php?id=${encodeURIComponent(id)}&_method=DELETE`, { method: 'POST', auth: true });
}

// Sube una foto y devuelve la dirección para guardar en `imagen`.
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('imagen', file);
  const data = await request('upload.php', { method: 'POST', formData, auth: true });
  return data.url;
}
