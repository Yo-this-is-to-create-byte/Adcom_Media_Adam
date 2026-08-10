import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

const REVEAL_DELAY_MS = 60_000; // 60 seconds
const DESKTOP_MIN_WIDTH = 900;

const KONAMI_ROWS = [
  ['↑', '↑', '↓', '↓'],
  ['←', '→', '←', '→'],
  ['B', 'A'],
];

/** Small floating hint that appears after ~60s on desktop only. Opens a discreet card
 *  with the Konami code. Does NOT cover the site — non-modal, click-outside closes. */
export default function SecretInfoButton() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const desktop = typeof window !== 'undefined' && window.innerWidth >= DESKTOP_MIN_WIDTH;
    if (!desktop) return undefined;
    const t = setTimeout(() => setVisible(true), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Close card on outside click / escape
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (
        cardRef.current && !cardRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[70] hidden md:block" style={{ pointerEvents: 'none' }}>
      {/* The button itself */}
      <div style={{ pointerEvents: 'auto' }} className="relative">
        <motion.button
          ref={anchorRef}
          onClick={() => setOpen((v) => !v)}
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          data-testid="secret-info-btn"
          aria-label="A quiet discovery"
          className="group w-10 h-10 rounded-full border border-white/15 bg-black/60 backdrop-blur-md text-white/50 hover:text-white hover:border-[#F43F5E]/60 hover:bg-black/70 flex items-center justify-center transition-colors"
        >
          <Info size={15} />
          <span className="absolute inset-0 rounded-full border border-[#F43F5E]/0 group-hover:border-[#F43F5E]/40 transition-colors pointer-events-none" />
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              data-testid="secret-info-card"
              className="absolute bottom-12 right-0 w-[320px] rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(225,29,46,0.35)] p-5"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                data-testid="secret-info-close"
                className="absolute top-3 right-3 w-7 h-7 rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={13} />
              </button>

              <div className="adam-mono text-[9px] uppercase tracking-[0.32em] text-[#F43F5E] mb-2">To see the magic</div>
              <div className="font-display text-lg tracking-tight leading-snug mb-4">Type the sequence</div>

              <div className="space-y-2 mb-5">
                {KONAMI_ROWS.map((row, i) => (
                  <div key={i} className="flex items-center gap-2 justify-center">
                    {row.map((k, j) => (
                      <div
                        key={j}
                        className="w-9 h-9 rounded-lg border border-white/15 bg-black/60 flex items-center justify-center text-sm font-mono text-white/85"
                      >
                        {k}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="text-[11.5px] text-white/45 italic leading-relaxed text-center">
                Some things are meant to be discovered.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
