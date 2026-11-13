import { useEffect, useRef } from 'react';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Accesibilidad de diálogos (ficha de producto, carrito):
//   - al abrirse, pone el foco en `initialFocusRef` (el botón de cerrar);
//   - Tab y Shift+Tab no se escapan del panel;
//   - Escape llama a onEscape;
//   - al cerrarse, devuelve el foco a lo que lo abrió.
//
// preventScroll: el foco programático puede disparar un scroll del navegador
// antes de que useScrollLock guarde la posición real (la página "saltaba").
export function useFocusTrap(panelRef, initialFocusRef, active, onEscape) {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return undefined;
    const previous = document.activeElement;
    initialFocusRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onEscapeRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(FOCUSABLE);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus?.({ preventScroll: true });
    };
  }, [panelRef, initialFocusRef, active]);
}
