import React from 'react';
import { motion } from 'framer-motion';

/**
 * Minimal rotating vector-ring AI core with pulse + soft glow.
 * `size` in px. Label content is passed as children.
 */
export default function AICore({ size = 300 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* soft glow */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '8%',
          background: 'radial-gradient(circle, rgba(215,38,56,0.22), transparent 68%)',
          filter: 'blur(6px)',
        }}
      />

      {/* pulse rings */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="adam-pulse-ring absolute rounded-full border border-[#D72638]/40"
          style={{ inset: '18%', animationDelay: `${i * 1.1}s` }}
        />
      ))}

      {/* rotating vector rings (SVG) */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
        <g className="adam-spin-slow">
          <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" strokeDasharray="2 6" />
        </g>
        <g className="adam-spin">
          <circle cx="100" cy="100" r="64" fill="none" stroke="rgba(215,38,56,0.55)" strokeWidth="0.8" strokeDasharray="40 220" strokeLinecap="round" />
          <circle cx="100" cy="36" r="2.2" fill="#D72638" />
        </g>
        <g className="adam-spin-rev">
          <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" strokeDasharray="1 5" />
          <circle cx="150" cy="100" r="1.6" fill="rgba(255,255,255,0.8)" />
        </g>
        <circle cx="100" cy="100" r="38" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      </svg>

      {/* inner label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-6"
      >
        <div className="font-display text-3xl md:text-4xl tracking-tight text-white">ADAM</div>
        <div className="adam-mono mt-2 text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/45 leading-relaxed">
          Artificial Decision &amp;<br />Marketing Intelligence
        </div>
      </motion.div>
    </div>
  );
}
