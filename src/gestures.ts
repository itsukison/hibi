import { useEffect, useRef, type RefObject } from 'react';

type Handlers = { onZoomOut?: () => void; onZoomIn?: () => void; onSwipe?: (dir: 1 | -1) => void };

// Two-finger pinch (touch), ctrl+wheel (trackpad pinch on desktop) and horizontal swipe.
// The element needs `touch-action: pan-y` so the browser leaves pinch and sideways pans to us.
export function usePinchSwipe(ref: RefObject<HTMLElement | null>, handlers: Handlers) {
  const h = useRef(handlers);
  h.current = handlers;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pts = new Map<number, { x: number; y: number }>();
    let startDist = 0, pinched = false, swipeFrom: { x: number; y: number } | null = null;
    let suppressUntil = 0, wheelAcc = 0, wheelLock = 0;

    const dist = () => { const [a, b] = [...pts.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; };
    const down = (e: PointerEvent) => {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) { startDist = dist(); pinched = false; swipeFrom = null; }
      else if (pts.size === 1) swipeFrom = { x: e.clientX, y: e.clientY };
    };
    const move = (e: PointerEvent) => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size !== 2 || pinched) return;
      const r = dist() / startDist;
      if (r < 0.75) { pinched = true; h.current.onZoomOut?.(); }
      else if (r > 1.33) { pinched = true; h.current.onZoomIn?.(); }
    };
    const up = (e: PointerEvent) => {
      if (swipeFrom && pts.size === 1) {
        const dx = e.clientX - swipeFrom.x, dy = e.clientY - swipeFrom.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) { suppressUntil = Date.now() + 350; h.current.onSwipe?.(dx < 0 ? 1 : -1); }
      }
      pts.delete(e.pointerId);
      if (pts.size === 0) swipeFrom = null;
    };
    // Swallow only the click that the swipe gesture itself produces.
    const click = (e: MouseEvent) => { if (Date.now() < suppressUntil) { e.stopPropagation(); e.preventDefault(); suppressUntil = 0; } };
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      if (Date.now() < wheelLock) return;
      wheelAcc += e.deltaY;
      if (Math.abs(wheelAcc) > 30) {
        if (wheelAcc > 0) h.current.onZoomOut?.(); else h.current.onZoomIn?.();
        wheelAcc = 0; wheelLock = Date.now() + 500;
      }
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    el.addEventListener('wheel', wheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true);
      el.removeEventListener('wheel', wheel);
    };
  }, [ref]);
}
