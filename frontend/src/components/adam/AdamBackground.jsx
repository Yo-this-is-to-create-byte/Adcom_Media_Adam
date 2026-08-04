import React, { useMemo } from 'react';

/**
 * Layered cinematic background for ADAM Protocol:
 * noise, fine engineering grid, soft crimson glow, floating particles, scanlines.
 * Purely decorative.
 */
export default function AdamBackground({ scanlines = true }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2,
        dur: `${6 + Math.random() * 10}s`,
        delay: `${Math.random() * 6}s`,
        red: Math.random() > 0.7,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 adam-glow" />
      <div className="absolute inset-0 adam-grid" />
      <div className="absolute inset-0 noise" style={{ opacity: 0.06 }} />
      {particles.map((p, i) => (
        <span
          key={i}
          className="adam-float absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: p.dur,
            animationDelay: p.delay,
            background: p.red ? 'rgba(215,38,56,0.7)' : 'rgba(255,255,255,0.5)',
            boxShadow: p.red ? '0 0 6px rgba(215,38,56,0.8)' : '0 0 4px rgba(255,255,255,0.4)',
          }}
        />
      ))}
      {scanlines && <div className="absolute inset-0 adam-scanlines" />}
    </div>
  );
}
