import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AICore from './AICore';
import WorldMap from './WorldMap';

const STATS = [
  { l: 'Status', v: 'ONLINE', accent: true },
  { l: 'Current Version', v: 'v1.0.0' },
  { l: 'AI Confidence', v: '99.8%' },
  { l: 'Strategy Engine', v: 'ACTIVE', accent: true },
  { l: 'Automation', v: 'RUNNING', accent: true },
  { l: 'Growth Systems', v: 'READY', accent: true },
];

const DIAGNOSTICS = [
  'Campaign Engine Ready',
  'Creative Intelligence Ready',
  'AI SEO Loaded',
  'Automation Running',
  'Performance Systems Online',
];

const LOCATIONS = ['India', 'Australia', 'UAE', 'USA'];

function Panel({ children, className = '', label, testid }) {
  return (
    <div
      data-testid={testid}
      className={`relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 md:p-6 ${className}`}
    >
      {label && (
        <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D72638]" />
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

function StatRow({ l, v, accent }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
      <span className="adam-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{l}</span>
      <span className={`adam-mono text-xs tracking-wide ${accent ? 'text-[#D72638]' : 'text-white/90'}`}>
        {accent && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D72638] mr-2 align-middle" />}
        {v}
      </span>
    </div>
  );
}

function Sparkline() {
  const pts = React.useMemo(
    () => Array.from({ length: 24 }).map((_, i) => `${(i / 23) * 100},${20 - Math.abs(Math.sin(i * 0.6)) * 16 - Math.random() * 2}`),
    []
  );
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="w-full h-10">
      <polyline points={pts.join(' ')} fill="none" stroke="rgba(215,38,56,0.6)" strokeWidth="0.8" />
      <polyline points={`0,24 ${pts.join(' ')} 100,24`} fill="rgba(215,38,56,0.08)" stroke="none" />
    </svg>
  );
}

function Waveform() {
  return (
    <div className="flex items-end justify-center gap-1 h-10">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[2px] bg-white/40 rounded-full"
          animate={{ height: [4, 6 + (i % 7) * 3 + 8, 4] }}
          transition={{ duration: 1.4 + (i % 5) * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }}
          style={{ minHeight: 4 }}
        />
      ))}
    </div>
  );
}

/** Step 3 — the ADAM operating system dashboard. */
export default function AdamDashboard({ dimmed = false }) {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString('en-GB', { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: dimmed ? 0.18 : 1, filter: dimmed ? 'blur(2px)' : 'blur(0px)' }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-10 flex flex-col pt-16 md:pt-20"
      data-testid="adam-dashboard"
    >
      {/* top status strip */}
      <div className="shrink-0 px-4 md:px-8 flex items-center justify-between adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
        <span className="text-white/70">ADAM // ADCOM CORE OS</span>
        <span className="hidden sm:inline">Secure Session · {clock}</span>
      </div>

      {/* main grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 px-4 md:px-8 py-4 overflow-y-auto scrollbar-none">
        {/* left */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Panel label="ADCOM CORE" testid="adam-panel-core">
            <div className="space-y-0">
              {STATS.map((s) => (
                <StatRow key={s.l} {...s} />
              ))}
            </div>
          </Panel>
          <Panel label="Client Activity" className="hidden lg:block">
            <Sparkline />
            <div className="adam-mono text-[10px] text-white/35 mt-2 tracking-widest">LIVE · 4 REGIONS</div>
          </Panel>
        </div>

        {/* center */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center gap-6 py-4">
          <AICore size={typeof window !== 'undefined' && window.innerWidth < 640 ? 230 : 320} />
          <div className="w-full max-w-sm">
            <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-2 text-center">
              AI Status · Listening
            </div>
            <Waveform />
          </div>
        </div>

        {/* right */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Panel label="Global Operations" testid="adam-panel-ops">
            <div className="adam-mono text-[11px] text-white/70 leading-relaxed mb-3">
              Based in <span className="text-[#D72638]">Pune</span>
              <br />Working Worldwide
            </div>
            <WorldMap />
            <div className="grid grid-cols-2 gap-2 mt-4">
              {LOCATIONS.map((c) => (
                <div key={c} className="adam-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  {c}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* bottom diagnostics ticker */}
      <div className="shrink-0 border-t border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee py-2.5">
          {[...DIAGNOSTICS, ...DIAGNOSTICS, ...DIAGNOSTICS, ...DIAGNOSTICS].map((d, i) => (
            <span key={i} className="adam-mono text-[10px] uppercase tracking-[0.22em] text-white/45 mx-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D72638]" />
              {d}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
