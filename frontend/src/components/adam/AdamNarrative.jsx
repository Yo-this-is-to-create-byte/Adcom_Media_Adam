import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Sparkles, X, Check, Minus } from 'lucide-react';
import Typewriter from './Typewriter';
import adamAudio from './adamAudio';

const INTRO_SPEECH = [
  { text: 'Hello.', pauseAfter: 600 },
  { text: "I'm ADAM.", pauseAfter: 700 },
  { text: 'Artificial Decision and Marketing Intelligence.', pauseAfter: 900 },
  { text: 'Built inside ADCOM.', pauseAfter: 1300 },
  { text: "You weren't supposed to discover this.", pauseAfter: 2600 },
  { text: 'But...', pauseAfter: 500 },
  { text: "Since you're here...", pauseAfter: 600 },
  { text: "I'll show you how we think.", pauseAfter: 400 },
];

const INTRO = [
  { t: 'HELLO.', big: true },
  { t: "I'm ADAM." },
  { t: 'Artificial Decision & Marketing Intelligence.', muted: true },
  { t: 'Built inside ADCOM.' },
  { t: "You weren't supposed to discover this.", accent: true },
  { t: '...', muted: true },
  { t: "Since you're here," },
  { t: "I'll show you how we think.", accent: true },
];

const PHILOSOPHY = [
  ['Most agencies sell marketing.', 'We build growth systems.'],
  ['Most agencies report numbers.', 'We create momentum.'],
  ['Most agencies chase trends.', 'We engineer competitive advantage.'],
  ['Marketing is temporary.', 'Systems scale forever.'],
];

const TRAD = ['Monthly Reports', 'Generic Campaigns', 'Vanity Metrics', 'Reactive Execution', 'One-size-fits-all'];
const ADCOM = ['Business Strategy', 'AI Systems', 'Automation', 'Performance', 'Long-term Growth'];

/* ---- typed lines helper (types each line sequentially) ---- */
function TypedLines({ lines, onDone }) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="space-y-3 md:space-y-4">
      {lines.slice(0, idx + 1).map((l, i) => (
        <div
          key={i}
          className={`${l.big ? 'font-display text-3xl md:text-5xl tracking-tight' : 'adam-mono text-base md:text-xl'} ${
            l.accent ? 'text-[#D72638]' : l.muted ? 'text-white/40' : 'text-white/90'
          }`}
        >
          {i === idx ? (
            <Typewriter
              text={l.t}
              speed={l.big ? 55 : 24}
              onDone={() =>
                setTimeout(() => {
                  if (idx < lines.length - 1) setIdx(idx + 1);
                  else onDone && onDone();
                }, l.t === '...' ? 700 : 260)
              }
            />
          ) : (
            l.t
          )}
        </div>
      ))}
    </div>
  );
}

function ContinueHint({ onClick, label = 'Continue' }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      onClick={onClick}
      data-testid="adam-continue"
      className="group mt-10 inline-flex items-center gap-2 adam-mono text-[11px] uppercase tracking-[0.28em] text-white/50 hover:text-white transition-colors"
    >
      {label}
      <ChevronDown size={14} className="animate-bounce group-hover:text-[#D72638]" />
    </motion.button>
  );
}

const shellCls =
  'absolute inset-0 z-30 flex items-center justify-center px-6 md:px-10';
const cardCls =
  'relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black/50 backdrop-blur-2xl p-8 md:p-12';

/** Steps 4–8. Overlays the dimmed dashboard. */
export default function AdamNarrative({ onExplore, onExit, initialStep = 'intro' }) {
  const [step, setStep] = useState(initialStep); // intro -> philosophy -> competitive -> achievement -> choice
  const [introDone, setIntroDone] = useState(false);
  const [scanned, setScanned] = useState(false);

  // competitive scan timer
  useEffect(() => {
    if (step !== 'competitive') return;
    setScanned(false);
    const t = setTimeout(() => setScanned(true), 2400);
    return () => clearTimeout(t);
  }, [step]);

  // achievement auto-advance
  useEffect(() => {
    if (step !== 'achievement') return;
    const t = setTimeout(() => setStep('choice'), 3200);
    return () => clearTimeout(t);
  }, [step]);

  // ---- audio cues per step ----
  useEffect(() => {
    if (step === 'intro') {
      adamAudio.speakSequence(INTRO_SPEECH);
    } else {
      adamAudio.cancelSpeech();
      if (step === 'philosophy') {
        PHILOSOPHY.forEach((_, i) => setTimeout(() => adamAudio.uiClick(), 250 + i * 500));
      } else if (step === 'achievement') {
        adamAudio.notification();
      }
    }
  }, [step]);

  // competitive analysis sounds
  useEffect(() => {
    if (step !== 'competitive') return;
    if (!scanned) {
      adamAudio.scan();
      [0, 1, 2, 3, 4].forEach((i) => setTimeout(() => adamAudio.processTick(), 300 + i * 380));
    } else {
      ADCOM.forEach((_, i) => setTimeout(() => adamAudio.uiClick(), i * 120));
      setTimeout(() => adamAudio.softConfirm(), 900);
    }
  }, [step, scanned]);

  return (
    <div className={shellCls}>
      <AnimatePresence mode="wait">
        {/* STEP 4 */}
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className={cardCls} data-testid="adam-intro">
            <TypedLines lines={INTRO} onDone={() => setIntroDone(true)} />
            {introDone && <ContinueHint onClick={() => setStep('philosophy')} label="Show me" />}
          </motion.div>
        )}

        {/* STEP 5 */}
        {step === 'philosophy' && (
          <motion.div key="phil" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className={cardCls} data-testid="adam-philosophy">
            <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-8">How we think</div>
            <div className="space-y-6">
              {PHILOSOPHY.map(([a, b], i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.5, duration: 0.6 }}>
                  <div className="adam-mono text-sm md:text-base text-white/35 line-through decoration-white/20">{a}</div>
                  <div className="font-display text-xl md:text-2xl tracking-tight text-white">{b}</div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>
              <ContinueHint onClick={() => setStep('competitive')} label="Run analysis" />
            </motion.div>
          </motion.div>
        )}

        {/* STEP 6 */}
        {step === 'competitive' && (
          <motion.div key="comp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className={`${cardCls} max-w-3xl`} data-testid="adam-competitive">
            <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D72638] animate-pulse" />
              Competitive Analysis
            </div>

            {!scanned ? (
              <div className="py-10">
                <div className="adam-mono text-sm text-white/60 mb-4">Scanning market landscape...</div>
                <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
                  <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} className="h-full w-1/2 bg-[#D72638]" />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6 md:gap-10">
                  <div>
                    <div className="adam-mono text-[11px] uppercase tracking-[0.22em] text-white/40 mb-5">Traditional Agency</div>
                    <ul className="space-y-3">
                      {TRAD.map((t, i) => (
                        <motion.li key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 text-sm text-white/45">
                          <Minus size={14} className="text-white/30 shrink-0" />
                          {t}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="adam-mono text-[11px] uppercase tracking-[0.22em] text-[#D72638] mb-5">ADCOM</div>
                    <ul className="space-y-3">
                      {ADCOM.map((t, i) => (
                        <motion.li key={t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-3 text-sm text-white font-medium">
                          <Check size={14} className="text-[#D72638] shrink-0" />
                          {t}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 adam-mono text-xs uppercase tracking-[0.2em] text-[#D72638]">
                  <Sparkles size={14} /> Competitive Advantage Detected
                </motion.div>
                <ContinueHint onClick={() => setStep('achievement')} label="Continue" />
              </>
            )}
          </motion.div>
        )}

        {/* STEP 7 */}
        {step === 'achievement' && (
          <motion.div key="ach" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="relative z-30 rounded-2xl border border-[#D72638]/40 bg-black/60 backdrop-blur-2xl px-10 py-8 text-center" data-testid="adam-achievement">
            <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }} className="mx-auto mb-5 w-14 h-14 rounded-full bg-[#D72638]/15 border border-[#D72638]/50 flex items-center justify-center">
              <Sparkles size={22} className="text-[#D72638]" />
            </motion.div>
            <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Achievement Unlocked</div>
            <div className="font-display text-2xl md:text-3xl tracking-tight text-white mt-2">Curious Mind</div>
            <div className="adam-mono text-sm text-white/50 mt-2">You discovered ADAM Protocol.</div>
          </motion.div>
        )}

        {/* STEP 8 */}
        {step === 'choice' && (
          <motion.div key="choice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="relative z-30 text-center" data-testid="adam-choice">
            <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-8">Where to next</div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onExplore}
                data-testid="adam-explore-btn"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D72638] text-white text-sm font-semibold tracking-wide hover:bg-[#ff2f45] transition-all duration-500 hover:shadow-[0_0_40px_rgba(215,38,56,0.5)]"
              >
                Explore ADAM
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={onExit}
                data-testid="adam-return-btn"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/15 text-white text-sm font-medium tracking-wide hover:bg-white hover:text-black transition-colors duration-500"
              >
                Return to Website
                <X size={15} className="opacity-60 group-hover:opacity-100" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
