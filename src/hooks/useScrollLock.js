import { useEffect } from 'react';

// Contador compartido: con el splash, el modal y el carrito pudiendo estar
// activos por separado, cada uno "pide" el bloqueo y lo libera al desmontar.
// Así nunca gana el último que corrió (que era el bug: el splash bloqueaba
// y un efecto que corría después lo desbloqueaba al toque).
let lockCount = 0;
let savedScrollY = 0;

function lockBody() {
  if (lockCount !== 1) return;
  savedScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.classList.add('no-scroll');
  // position:fixed es necesario en iOS Safari: overflow:hidden en <body> no
  // alcanza para bloquear el scroll táctil del fondo.
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
}

function unlockBody() {
  if (lockCount !== 0) return;
  document.body.classList.remove('no-scroll');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, savedScrollY);
}

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    lockCount += 1;
    lockBody();
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      unlockBody();
    };
  }, [active]);
}
