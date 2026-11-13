import { useEffect, useRef } from 'react';

// Cierra un menú o desplegable al hacer clic afuera o al apretar Escape.
//
//   ref      -> elemento que contiene el menú (y su botón); un clic adentro
//               no lo cierra.
//   active   -> solo escucha mientras el menú está abierto.
//   onClose  -> se llama al hacer clic afuera, y con Escape si no se pasa
//               onEscape.
//   onEscape -> opcional, para manejar Escape distinto (ej: volver de un
//               submenú antes de cerrar todo).
export function useDismiss(ref, active, onClose, onEscape) {
  // Refs para no volver a registrar los listeners en cada render.
  const handlers = useRef({ onClose, onEscape });
  handlers.current = { onClose, onEscape };

  useEffect(() => {
    if (!active) return undefined;
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handlers.current.onClose();
    };
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      (handlers.current.onEscape || handlers.current.onClose)();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [ref, active]);
}
