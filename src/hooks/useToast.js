import { useCallback, useEffect, useState } from 'react';

// Aviso temporal ("Producto actualizado"): aparece y se va solo.
export function useToast(duration = 2600) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(t);
  }, [toast, duration]);

  const showToast = useCallback((msg) => setToast({ msg, id: Date.now() }), []);
  return [toast?.msg || '', showToast];
}
