import React, { useEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue } from 'framer-motion';
import adamAudio from './adamAudio';

const LINES = [
  { t: '> INITIALIZING ADCOM CORE...', delay: 500 },
  { t: 'Loading Systems', bar: 18, delay: 900 },
  { t: 'Loading Design Engine', bar: 57, delay: 900 },
  { t: 'Loading Growth Systems', bar: 86, delay: 900 },
  { t: 'Connecting...', delay: 700 },
  { t: 'ADAM', bar: 100, accent: true, delay: 900 },
  { t: 'System Online.', accent: true, delay: 550 },
];

/** Animated progress bar that counts up from 0 -> pct on mount. */
function Bar({ pct }) {
  const mv = useMotionValue(0);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const controls = animate(mv, pct, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [pct, mv]);

  const filled = Math.round((val / 100) * 10);
  return (
    <span className="adam-mono text-[11px] md:text-xs tabular-nums">
      <span className="text-[#D72638]">{'█'.repeat(filled)}</span>
      <span className="text-white/20">{'░'.repeat(10 - filled)}</span>
      <span className="ml-2 text-white/60 inline-block w-9 text-right">{val}%</span>
    </span>
  );
}

/** Step 1 (glitch + caret + silence) then Step 2 (terminal boot). */
export default function AdamBoot({ onComplete }) {
  const [stage, setStage] = useState('glitch'); // glitch -> boot
  const [visible, setVisible] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const mountedRef = useRef(true);
  const startedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Step 1: brief glitch + silence, then start booting (ref-guarded so it
  // survives React StrictMode's double-invoke without being cancelled).
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setTimeout(() => {
      if (mountedRef.current) setStage('boot');
    }, 2000);
  }, []);

  // Step 2: reveal boot lines one by one, then complete
  useEffect(() => {
    if (stage !== 'boot') return undefined;
    if (visible >= LINES.length) {
      const done = setTimeout(() => onCompleteRef.current && onCompleteRef.current(), 1000);
      return () => clearTimeout(done);
    }
    const t = setTimeout(() => {
      if (mountedRef.current) setVisible((v) => v + 1);
    }, LINES[visible].delay);
    return () => clearTimeout(t);
  }, [stage, visible]);

  // audio cues as each boot line reveals
  useEffect(() => {
    if (stage !== 'boot' || visible === 0) return;
    const line = LINES[visible - 1];
    if (line && line.bar !== undefined) {
      [0, 1, 2, 3].forEach((i) => setTimeout(() => adamAudio.processTick(), i * 130));
    } else {
      adamAudio.uiClick();
    }
    if (visible >= LINES.length) setTimeout(() => adamAudio.softConfirm(), 200);
  }, [stage, visible]);

  if (stage === 'glitch') {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="adam-glitch-active">
          <span className="adam-mono text-2xl md:text-3xl text-white/90 adam-caret">▊</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl px-6"
        data-testid="adam-boot"
      >
        <div className="space-y-3">
          {LINES.slice(0, visible).map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-between gap-4"
            >
              <span className={`adam-mono text-[13px] md:text-sm ${l.accent ? 'text-[#D72638]' : 'text-white/75'}`}>
                {l.t}
                {l.bar !== undefined ? '...' : ''}
              </span>
              {l.bar !== undefined && <Bar pct={l.bar} />}
            </motion.div>
          ))}
          {visible < LINES.length && <span className="adam-mono text-sm text-[#D72638] adam-caret">▊</span>}
        </div>
      </motion.div>
    </div>
  );
}
