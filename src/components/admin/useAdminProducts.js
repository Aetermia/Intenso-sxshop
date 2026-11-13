import { useCallback, useEffect, useRef, useState } from 'react';
import { createProduct, deleteProduct, fetchAllProducts, updateProduct, uploadImage } from '../../services/api.js';

// Estado del catálogo en el panel y todas las operaciones contra la API.
// Lo que se cambia acá queda publicado en la tienda al instante.
//
// Cada operación lanza un Error con un mensaje listo para mostrar. Si el
// servidor rechaza el token (sesión vencida) se llama a onSessionExpired.
export function useAdminProducts(onSessionExpired) {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [loadError, setLoadError] = useState('');
  const expiredRef = useRef(onSessionExpired);
  expiredRef.current = onSessionExpired;

  const friendly = useCallback((err) => {
    if (err?.status === 401) {
      expiredRef.current?.();
      return new Error('La sesión venció. Ingresá de nuevo.');
    }
    return new Error(err?.message || 'Ocurrió un error inesperado.');
  }, []);

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      setProducts(await fetchAllProducts());
      setStatus('ready');
    } catch (err) {
      setLoadError(friendly(err).message);
      setStatus('error');
    }
  }, [friendly]);

  useEffect(() => {
    reload();
  }, [reload]);

  const replace = (saved) => setProducts((list) => list.map((p) => (p.id === saved.id ? saved : p)));

  // Crea (id null) o edita un producto. Las fotos nuevas se suben primero y
  // en el producto se guarda solo la dirección de cada una, en orden.
  const save = async (id, payload, images) => {
    try {
      const imagenes = [];
      for (const img of images) {
        imagenes.push(img.file ? await uploadImage(img.file) : img.url);
      }
      const data = { ...payload, imagenes };
      if (id) {
        const saved = await updateProduct(id, data);
        replace(saved);
        return saved;
      }
      const saved = await createProduct(data);
      setProducts((list) => [...list, saved]);
      return saved;
    } catch (err) {
      throw friendly(err);
    }
  };

  // Edición parcial: solo cambia el stock, el resto queda como está.
  const toggleStock = async (product) => {
    try {
      const saved = await updateProduct(product.id, { sinStock: !product.sinStock });
      replace(saved);
      return saved;
    } catch (err) {
      throw friendly(err);
    }
  };

  const remove = async (product) => {
    try {
      await deleteProduct(product.id);
      setProducts((list) => list.filter((p) => p.id !== product.id));
    } catch (err) {
      throw friendly(err);
    }
  };

  return { products, status, loadError, reload, save, toggleStock, remove };
}
