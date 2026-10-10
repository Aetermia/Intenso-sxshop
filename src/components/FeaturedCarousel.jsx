import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ProductArt from './ProductArt.jsx';
import './FeaturedCarousel.css';

const INTERVAL_MS = 3500;
const SCROLL_MS = 480;
const NORMALIZE_MS = 140;

export default function FeaturedCarousel({ products, onOpen, auto = true }) {
  const count = products.length;
  const loop = count > 1;
  // Para el loop repetimos la lista 3 veces y usamos la copia del medio como
  // "real": así cualquier card tiene vecinas reales a ambos lados, incluso al
  // dar la vuelta. Al quedar fuera de la copia del medio, se salta sin costura.
  const slides = loop ? [...products, ...products, ...products] : products;
  const homeStart = loop ? count : 0;
  const homeEnd = loop ? 2 * count : count;

  const [index, setIndex] = useState(homeStart);
  const scrollerRef = useRef(null);
  const slideRefs = useRef([]);
  const normalizeTimer = useRef(null);
  const tweenRef = useRef({ raf: null, snap: null });
  const prefersReduced = useRef(false);
  const indexRef = useRef(index);

  // Índice "real" (sin repeticiones) a partir de la posición en el scroller.
  const realIndexOf = (i) => (loop ? ((i % count) + count) % count : i);
  const activeReal = realIndexOf(index);

  useEffect(() => { indexRef.current = index; }, [index]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { prefersReduced.current = mq.matches; };
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', update); };
  }, []);

  // Corta la animación en curso y restaura el scroll-snap.
  const stopTween = useCallback(() => {
    const t = tweenRef.current;
    if (t.raf !== null) {
      cancelAnimationFrame(t.raf);
      t.raf = null;
    }
    if (t.snap !== null) {
      if (scrollerRef.current) scrollerRef.current.style.scrollSnapType = t.snap;
      t.snap = null;
    }
  }, []);

  // Centra un slide con una animación de duración fija.
  // animate=false para los saltos instantáneos del loop.
  const scrollToSlide = useCallback((i, { animate = true } = {}) => {
    const scroller = scrollerRef.current;
    const slide = slideRefs.current[i];
    if (!scroller || !slide) return;
    const target = Math.max(0, slide.offsetLeft - (scroller.clientWidth - slide.clientWidth) / 2);

    stopTween();

    if (!animate || prefersReduced.current) {
      scroller.scrollLeft = target;
      return;
    }

    const start = scroller.scrollLeft;
    const change = target - start;
    if (Math.abs(change) < 1) return;

    // Desactivamos el snap durante el tween para que no compita con la animación.
    tweenRef.current.snap = scroller.style.scrollSnapType;
    scroller.style.scrollSnapType = 'none';

    const startTime = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const t = Math.min(1, (now - startTime) / SCROLL_MS);
      scroller.scrollLeft = start + change * ease(t);
      if (t < 1) {
        tweenRef.current.raf = requestAnimationFrame(step);
      } else {
        scroller.scrollLeft = target;
        scroller.style.scrollSnapType = tweenRef.current.snap || '';
        tweenRef.current.snap = null;
        tweenRef.current.raf = null;
      }
    };
    tweenRef.current.raf = requestAnimationFrame(step);
  }, [stopTween]);

  // Al cambiar la cantidad, volvemos a centrar el primer destacado.
  // useLayoutEffect para centrar antes de pintar y evitar el salto inicial.
  useLayoutEffect(() => {
    setIndex(homeStart);
    scrollToSlide(homeStart, { animate: false });
  }, [count, homeStart, scrollToSlide]);

  // Auto-avance: un intervalo simple que avanza y listo. No depende del scroll
  // ni del índice (lee el actual del ref), así el paso es parejo siempre.
  useEffect(() => {
    if (!auto || count <= 1) return undefined;
    const id = setInterval(() => {
      const cur = indexRef.current;
      let next = cur + 1;
      if (next >= slides.length) next = homeStart;
      setIndex(next);
      scrollToSlide(next);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [auto, count, slides.length, homeStart, scrollToSlide]);

  useEffect(() => () => {
    clearTimeout(normalizeTimer.current);
    stopTween();
  }, [stopTween]);

  // Slide más cercano al centro del viewport.
  const nearestSlide = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return 0;
    const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const center = slide.offsetLeft + slide.clientWidth / 2;
      const dist = Math.abs(center - viewportCenter);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    return nearest;
  };

  // Mantiene el índice sincronizado al scrollear a mano y, si quedó fuera de la
  // copia del medio, salta (sin animación) al slide equivalente: así es infinito.
  const handleScroll = () => {
    const nearest = nearestSlide();
    setIndex((prev) => (prev === nearest ? prev : nearest));

    if (!loop) return;
    clearTimeout(normalizeTimer.current);
    normalizeTimer.current = setTimeout(() => {
      const n = nearestSlide();
      let target = n;
      if (n < homeStart) target = n + count;
      else if (n >= homeEnd) target = n - count;
      if (target !== n) {
        setIndex(target);
        scrollToSlide(target, { animate: false });
      }
    }, NORMALIZE_MS);
  };

  if (count === 0) return null;

  return (
    <section className="carousel" aria-label="Productos destacados">
      <div className="container carousel__wrap">
        <div className="carousel__viewport">
          <div className="carousel__scroller" ref={scrollerRef} onScroll={handleScroll}>
            {slides.map((p, i) => (
              <article
                key={`${i}-${p.id}`}
                ref={(el) => { slideRefs.current[i] = el; }}
                className={`carousel__slide${i === index ? ' carousel__slide--active' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${realIndexOf(i) + 1} de ${count}`}
                onClick={() => {
                  if (i === index) {
                    onOpen && onOpen(p);
                  } else {
                    setIndex(i);
                    scrollToSlide(i);
                  }
                }}
              >
                <div className="carousel__media">
                  <ProductArt product={p} size="hero" />
                  {p.promo && <span className="badge badge--promo carousel__promo">{p.promo}</span>}
                  <div className="carousel__shade" aria-hidden="true" />
                  <div className="carousel__caption">
                    <h3 className="carousel__name">{p.nombre}</h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {count > 1 && (
          <div className="carousel__dots" role="tablist" aria-label="Elegir destacado">
            {products.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`carousel__dot ${i === activeReal ? 'carousel__dot--active' : ''}`}
                onClick={() => { setIndex(homeStart + i); scrollToSlide(homeStart + i); }}
                role="tab"
                aria-selected={i === activeReal}
                aria-label={`Ver ${p.nombre}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
