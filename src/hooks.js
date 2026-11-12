import { useEffect, useRef, useState } from 'react';
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}
export function useCarousel(count, delay, blocked = false) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0),
    [paused, setPaused] = useState(reduced),
    [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false);
  useEffect(() => {
    if (count < 2 || reduced || paused || hovered || focused || blocked) return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % count);
    }, delay);
    return () => clearInterval(timer);
  }, [count, delay, reduced, paused, hovered, focused, blocked]);
  useEffect(() => {
    setIndex((current) => (count ? Math.min(current, count - 1) : 0));
  }, [count]);
  const touchStart = useRef(0);
  return {
    index,
    paused: paused || reduced,
    setPaused: () => setPaused((value) => !value),
    go: (next) => setIndex((next + count) % count),
    bindings: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      },
      onKeyDown: (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          setIndex(
            (i) => (i + (event.key === 'ArrowRight' ? 1 : -1) + count) % count,
          );
        }
      },
      onTouchStart: (event) => {
        touchStart.current = event.changedTouches[0].clientX;
      },
      onTouchEnd: (event) => {
        const delta = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 50)
          setIndex((i) => (i + (delta < 0 ? 1 : -1) + count) % count);
      },
    },
  };
}
