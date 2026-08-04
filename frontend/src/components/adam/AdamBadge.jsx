import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'adcom_adam_unlocked';

/**
 * Subtle persistent badge shown to visitors who have already unlocked
 * ADAM Protocol. Clicking re-opens it. Bottom-left to avoid the WhatsApp CTA.
 */
export default function AdamBadge() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try { setUnlocked(localStorage.getItem(STORAGE_KEY) === '1'); } catch (e) { /* ignore */ }
    const onUnlock = () => setUnlocked(true);
    window.addEventListener('adam:unlocked', onUnlock);
    return () => window.removeEventListener('adam:unlocked', onUnlock);
  }, []);

  if (!unlocked) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.04 }}
        onClick={() => window.dispatchEvent(new Event('adam:open'))}
        data-testid="adam-badge"
        aria-label="Open ADAM Protocol"
        className="fixed bottom-6 left-6 z-[55] group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#D72638]/40 bg-black/60 backdrop-blur-xl hover:border-[#D72638] transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#D72638] opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D72638]" />
        </span>
        <span className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/70 group-hover:text-white transition-colors">
          ADAM Mode
        </span>
      </motion.button>
    </AnimatePresence>
  );
}
