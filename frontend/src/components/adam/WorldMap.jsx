import React from 'react';
import { motion } from 'framer-motion';

const HUB = { x: 300, y: 96 };
const NODES = [
  { id: 'IN', label: 'India', x: 300, y: 96, hub: true },
  { id: 'AU', label: 'Australia', x: 352, y: 150 },
  { id: 'AE', label: 'UAE', x: 258, y: 92 },
  { id: 'US', label: 'USA', x: 96, y: 74 },
];

function arc(a, b) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 40;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

/**
 * Abstract "global operations" network map. Not a literal map —
 * faint graticule + a connection network radiating from the India hub.
 */
export default function WorldMap() {
  const dots = React.useMemo(
    () => Array.from({ length: 90 }).map(() => ({
      x: 20 + Math.random() * 360,
      y: 24 + Math.random() * 150,
      r: Math.random() > 0.85 ? 1 : 0.6,
    })),
    []
  );

  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto">
      {/* graticule */}
      <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" fill="none">
        {[40, 70, 100, 130, 160].map((y) => (
          <ellipse key={y} cx="200" cy="100" rx={190} ry={100 - Math.abs(100 - y) * 0.55} />
        ))}
        {[60, 120, 200, 280, 340].map((x) => (
          <line key={x} x1={x} y1="20" x2={x} y2="180" />
        ))}
      </g>

      {/* faint dot field */}
      <g fill="rgba(255,255,255,0.18)">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} />
        ))}
      </g>

      {/* connection arcs */}
      {NODES.filter((n) => !n.hub).map((n, i) => {
        const d = arc(HUB, n);
        return (
          <g key={n.id}>
            <path d={d} fill="none" stroke="rgba(215,38,56,0.35)" strokeWidth="0.8" className="adam-dash" />
            <circle r="1.6" fill="#D72638">
              <animateMotion dur={`${6 + i * 2}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        );
      })}

      {/* nodes */}
      {NODES.map((n) => (
        <g key={n.id}>
          {n.hub && (
            <circle cx={n.x} cy={n.y} r="6" fill="none" stroke="rgba(215,38,56,0.5)" strokeWidth="0.6">
              <animate attributeName="r" values="4;9;4" dur="3.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="3.2s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={n.x} cy={n.y} r={n.hub ? 2.6 : 1.8} fill={n.hub ? '#D72638' : '#ffffff'} />
          <text
            x={n.x + (n.id === 'US' ? 6 : 6)}
            y={n.y - 4}
            className="adam-mono"
            fontSize="6"
            fill="rgba(255,255,255,0.6)"
            style={{ letterSpacing: '0.15em' }}
          >
            {n.label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function WorldMapWrapper({ children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      {children}
    </motion.div>
  );
}
