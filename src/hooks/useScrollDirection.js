import { useEffect, useRef, useState } from 'react';

// Dirección del scroll para el header retráctil: se oculta al bajar y
// reaparece apenas se sube.
//
//   threshold -> px mínimos de movimiento antes de cambiar de estado (evita
//                parpadeos por el rebote del scroll táctil).
//   topOffset -> hasta esta altura el header está siempre visible.
//   pinned    -> mientras sea true, el header no se oculta (ej: escribiendo
//                en el buscador o con el menú de categorías abierto).
//
// Devuelve { isHidden, isAtTop }.
export function useScrollDirection({ threshold = 8, topOffset = 80, pinned = false } = {}) {
  const [isHidden, setIsHidden] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const pinnedRef = useRef(pinned);
  pinnedRef.current = pinned;

  useEffect(() => {
    if (pinned) setIsHidden(false);
  }, [pinned]);

  useEffect(() => {
    let lastY = null;
    let ticking = false;

    const update = () => {
      ticking = false;
      // Con el modal o el carrito abiertos, useScrollLock fija el <body> y la
      // página "salta" a 0 y vuelve: esos saltos no son scroll del usuario.
      if (document.body.classList.contains('no-scroll')) {
        lastY = null;
        return;
      }
      // Se recorta al rango real para ignorar el rebote elástico de iOS en
      // los extremos de la página.
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.min(Math.max(window.scrollY, 0), maxY);
      setIsAtTop(y <= 0);

      if (lastY === null) {
        lastY = y;
        return;
      }
      if (y <= topOffset || pinnedRef.current) {
        setIsHidden(false);
        lastY = y;
        return;
      }
      const delta = y - lastY;
      if (Math.abs(delta) < threshold) return; // acumula hasta superar el umbral
      setIsHidden(delta > 0);
      lastY = y;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, topOffset]);

  return { isHidden: isHidden && !pinned, isAtTop };
}
