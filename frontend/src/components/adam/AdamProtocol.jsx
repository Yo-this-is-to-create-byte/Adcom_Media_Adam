import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import useKonamiCode from '@/hooks/useKonamiCode';
import adamAudio from './adamAudio';
import AdamBackground from './AdamBackground';
import AdamBoot from './AdamBoot';
import AdamDashboard from './AdamDashboard';
import AdamNarrative from './AdamNarrative';

const STORAGE_KEY = 'adcom_adam_unlocked';

const FINALE = [
  { t: 'One last thing...', muted: true },
  { t: 'People who notice details...' },
  { t: 'usually build extraordinary things.', accent: true },
  { t: 'If you found this,' },
  { t: "you're probably the kind of client we enjoy working with." },
  { t: "Let's build something remarkable.", accent: true },
  { t: '— Team ADCOM', muted: true },
];

export default function AdamProtocol() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('boot'); // boot -> dashboard -> narrative -> explore
  const [showFinale, setShowFinale] = useState(false);
  const [muted, setMuted] = useState(adamAudio.isMuted());
  const finaleTimer = useRef(null);
  const dashTimer = useRef(null);
  const navigate = useNavigate();

  const close = useCallback(() => {
    adamAudio.cancelSpeech();
    adamAudio.softConfirm();
    adamAudio.stopAmbient(2);
    setActive(false);
    setShowFinale(false);
    setPhase('boot');
    clearTimeout(finaleTimer.current);
    clearTimeout(dashTimer.current);
    document.body.style.overflow = '';
    document.body.classList.remove('adam-nocursor');
  }, []);

  // deliberate exit via a button — say a soft farewell first
  const closeWithFarewell = useCallback(() => {
    adamAudio.speak('Until next time.', { rate: 0.82, pitch: 0.9 });
    setTimeout(() => close(), 900);
  }, [close]);

  const activate = useCallback(() => {
    if (active) return;
    adamAudio.resume();
    adamAudio.confirmBeep();
    adamAudio.glitch(0.45);
    adamAudio.startAmbient(0.05, 2.4);
    setActive(true);
    setPhase('boot');
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* ignore */ }
    window.dispatchEvent(new Event('adam:unlocked'));
    document.body.style.overflow = 'hidden';
    document.body.classList.add('adam-nocursor');
    clearTimeout(finaleTimer.current);
    finaleTimer.current = setTimeout(() => setShowFinale(true), 30000);
  }, [active]);

  useKonamiCode(activate);

  // allow the persistent badge to re-open ADAM
  useEffect(() => {
    window.addEventListener('adam:open', activate);
    return () => window.removeEventListener('adam:open', activate);
  }, [activate]);

  // ESC exits instantly
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close]);

  // boot finished -> reveal native cursor, show dashboard, auto-advance to narrative
  const onBootDone = useCallback(() => {
    document.body.classList.remove('adam-nocursor');
    setPhase('dashboard');
  }, []);

  useEffect(() => {
    if (phase !== 'dashboard') return undefined;
    dashTimer.current = setTimeout(() => setPhase('narrative'), 6500);
    return () => clearTimeout(dashTimer.current);
  }, [phase]);

  // audio cues on phase changes
  useEffect(() => {
    if (!active) return;
    if (phase === 'dashboard') {
      adamAudio.setAmbient(0.065, 1.2);
      adamAudio.softConfirm();
      [0, 1, 2].forEach((i) => setTimeout(() => adamAudio.pulse(), 300 + i * 260));
      setTimeout(() => adamAudio.scan(), 500);
    } else if (phase === 'narrative') {
      adamAudio.duckAmbient();
    } else if (phase === 'explore') {
      adamAudio.unduckAmbient();
      adamAudio.keyboardInit();
    }
  }, [phase, active]);

  // soft tone when the finale appears
  useEffect(() => {
    if (showFinale) {
      adamAudio.cancelSpeech();
      adamAudio.softConfirm();
    }
  }, [showFinale]);

  const toggleMute = () => setMuted(adamAudio.toggleMuted());

  const bookCall = () => {
    close();
    navigate('/contact');
  };

  const dimmed = phase === 'narrative';

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="adam-protocol"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[999] bg-black text-white overflow-hidden select-none"
          data-testid="adam-protocol"
        >
          <AdamBackground />

          {/* mute / unmute toggle */}
          <button
            onClick={toggleMute}
            data-testid="adam-mute-toggle"
            aria-label={muted ? 'Unmute ADAM Protocol' : 'Mute ADAM Protocol'}
            className="absolute top-4 left-4 md:top-6 md:left-8 z-40 w-10 h-10 rounded-full border border-white/15 bg-black/40 backdrop-blur-xl flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* boot */}
          {phase === 'boot' && <AdamBoot onComplete={onBootDone} />}

          {/* dashboard (also under narrative, dimmed) */}
          {(phase === 'dashboard' || phase === 'narrative' || phase === 'explore') && (
            <AdamDashboard dimmed={dimmed} />
          )}

          {/* narrative overlay */}
          {phase === 'narrative' && (
            <AdamNarrative onExplore={() => setPhase('explore')} onExit={close} />
          )}

          {/* explore mode controls */}
          {phase === 'explore' && (
            <div className="absolute top-4 right-4 md:top-6 md:right-8 z-40 flex items-center gap-4">
              <span className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#D72638] hidden sm:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D72638] animate-pulse" /> ADAM Mode
              </span>
              <button
                onClick={closeWithFarewell}
                data-testid="adam-exit-explore"
                className="adam-mono text-[11px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/15 text-white/80 hover:bg-white hover:text-black transition-colors"
              >
                Return to Website
              </button>
            </div>
          )}

          {/* persistent ESC hint */}
          {(phase === 'dashboard' || phase === 'explore') && (
            <div className="absolute bottom-14 right-4 md:right-8 adam-mono text-[9px] uppercase tracking-[0.28em] text-white/25">
              Press ESC to exit
            </div>
          )}

          {/* 30s finale */}
          <AnimatePresence>
            {showFinale && (
              <motion.div
                key="finale"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-6"
                data-testid="adam-finale"
              >
                <div className="max-w-xl text-center">
                  <div className="space-y-3 mb-10">
                    {FINALE.map((l, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.5, duration: 0.7 }}
                        className={`${l.muted ? 'adam-mono text-sm text-white/40' : 'text-lg md:text-xl'} ${
                          l.accent ? 'text-[#D72638] font-medium' : 'text-white/90'
                        }`}
                      >
                        {l.t}
                      </motion.p>
                    ))}
                  </div>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + FINALE.length * 0.5 + 0.3, duration: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={bookCall}
                      data-testid="adam-book-call"
                      className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D72638] text-white text-sm font-semibold hover:bg-[#ff2f45] transition-all duration-500 hover:shadow-[0_0_40px_rgba(215,38,56,0.5)]"
                    >
                      Book a Strategy Call
                      <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => setShowFinale(false)}
                      data-testid="adam-finale-dismiss"
                      className="adam-mono text-[11px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors px-4 py-2"
                    >
                      Keep exploring
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
