// Utilidades generales de producto (sin JSX, se pueden probar con Node).

// Máximo de fotos por producto (el backend aplica el mismo límite).
export const MAX_PRODUCT_IMAGES = 3;

// Fotos de un producto, la principal primero. Los productos del catálogo
// de ejemplo (o anteriores a las fotos múltiples) solo traen `imagen`.
export function productImages(product) {
  if (Array.isArray(product?.imagenes) && product.imagenes.length) {
    return product.imagenes.filter(Boolean).slice(0, MAX_PRODUCT_IMAGES);
  }
  return product?.imagen ? [product.imagen] : [];
}
