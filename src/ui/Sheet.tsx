import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { soft } from './motion';

type Props = { open: boolean; onClose: () => void; label: string; children: ReactNode };

// Bottom sheet inside the phone (DESIGN.md §5 Sheet). Escape or the scrim closes it.
export function Sheet({ open, onClose, label, children }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const key = (e: KeyboardEvent) => e.key === 'Escape' && close.current();
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); prev?.focus?.(); };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="sheet-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="sheet-scrim" onClick={onClose} />
          <motion.div ref={panel} className="sheet" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={soft}>
            <span className="sheet-handle" aria-hidden />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
