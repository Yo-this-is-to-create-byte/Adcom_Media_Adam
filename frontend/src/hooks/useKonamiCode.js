import { useEffect, useRef } from 'react';

// ↑ ↑ ↓ ↓ ← → ← → B A
const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

/**
 * Fires `onUnlock` when the Konami code is entered.
 * Ignores input while typing inside form fields.
 */
export default function useKonamiCode(onUnlock) {
  const progress = useRef(0);

  useEffect(() => {
    const handler = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = SEQUENCE[progress.current];

      if (key === expected) {
        progress.current += 1;
        if (progress.current === SEQUENCE.length) {
          progress.current = 0;
          onUnlock();
        }
      } else {
        // allow a fresh start if the wrong key was actually the first key
        progress.current = key === SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onUnlock]);
}
