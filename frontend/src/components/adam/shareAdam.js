import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';

const SHARE_TEXT =
  'I just unlocked the ADAM Protocol — a hidden AI operating system built inside ADCOM Media. Enter the Konami code on their site to find it. ↑ ↑ ↓ ↓ ← → ← → B A';

/** Native share sheet with graceful clipboard fallback. */
export async function shareAdam() {
  const url = (typeof window !== 'undefined' && window.location.origin) || '';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'ADAM Protocol · ADCOM Media', text: SHARE_TEXT, url });
      return 'shared';
    }
  } catch (e) {
    return 'none';
  }
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${url}`);
      return 'copied';
    }
  } catch (e) { /* ignore */ }
  return 'none';
}

/** Reusable "share your discovery" button used in ADAM Protocol. */
export function ShareButton({ variant = 'ghost', label = 'Share this discovery', onShared }) {
  const [state, setState] = useState('idle'); // idle | shared | copied

  const handle = async () => {
    const res = await shareAdam();
    if (res === 'copied') {
      setState('copied');
      setTimeout(() => setState('idle'), 2400);
    } else if (res === 'shared') {
      setState('shared');
      setTimeout(() => setState('idle'), 2400);
    }
    if (onShared) onShared(res);
  };

  const base =
    'group inline-flex items-center gap-2 transition-colors duration-300';
  const styles =
    variant === 'pill'
      ? 'px-6 py-3 rounded-full border border-white/15 text-white/80 text-sm hover:bg-white hover:text-black'
      : 'adam-mono text-[11px] uppercase tracking-[0.24em] text-white/50 hover:text-white';

  const text = state === 'copied' ? 'Link copied' : state === 'shared' ? 'Shared' : label;

  return (
    <motion.button
      onClick={handle}
      data-testid="adam-share-btn"
      className={`${base} ${styles}`}
      whileTap={{ scale: 0.96 }}
    >
      {state === 'idle' ? <Share2 size={14} /> : <Check size={14} className="text-[#D72638]" />}
      {text}
    </motion.button>
  );
}
