import React, { useState, useEffect, useRef } from 'react';
import './Splash.css';

const PHRASES = [
  'Prohibido para aburridos. Tocá la pantalla para encender la llama...',
  '¿Listo para elevar la temperatura en Tandil? Entrar...',
  'Atrevete a explorar. Tocá la pantalla...',
];

export default function Splash({ onEnter }) {
  const [leaving, setLeaving] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [removed, setRemoved] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % PHRASES.length);
    }, 3200);
    return () => clearInterval(timeoutRef.current);
  }, []);

  const handleEnter = () => {
    if (leaving) return;
    clearInterval(timeoutRef.current);
    setLeaving(true);
    setTimeout(() => {
      setRemoved(true);
      onEnter();
    }, 650);
  };

  if (removed) return null;

  return (
    <div
      className={`splash ${leaving ? 'splash--leaving' : ''}`}
      onClick={handleEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleEnter();
      }}
      aria-label="Entrar a Intenso Tandil"
    >
      <div className="splash__flames" aria-hidden="true" />
      <div className="splash__content">
        <h1 className="splash__logo">
          Intens<span className="splash__logo-o">o</span>
        </h1>
        <p className="splash__phrase" key={phraseIdx}>
          {PHRASES[phraseIdx]}
        </p>
        <button className="splash__cta" onClick={(e) => { e.stopPropagation(); handleEnter(); }}>
          Pulsá para entrar
        </button>
        <small className="splash__legal">Solo mayores de 18 años</small>
      </div>
    </div>
  );
}
