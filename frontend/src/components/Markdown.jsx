// Tiny markdown renderer for controlled AI output.
// Supports: # / ## / ### headings, - / * bullets, **bold**, *italic*, `code`.
import React from 'react';

function renderInline(text) {
  const parts = [];
  let i = 0;
  const pattern = /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)/g;
  let m;
  let last = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={i++} className="text-white font-semibold">{m[1].slice(2, -2)}</strong>);
    else if (m[2]) parts.push(<em key={i++} className="italic text-white/95">{m[2].slice(1, -1)}</em>);
    else if (m[3]) parts.push(<code key={i++} className="px-1.5 py-0.5 rounded bg-white/10 text-[#F43F5E] text-[0.9em] font-mono">{m[3].slice(1, -1)}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function Markdown({ text = '', className = '' }) {
  const lines = text.split('\n');
  const blocks = [];
  let buffer = [];
  const flushPara = () => {
    if (!buffer.length) return;
    blocks.push({ type: 'p', text: buffer.join(' ') });
    buffer = [];
  };
  const flushList = () => {
    if (!buffer.length) return;
    blocks.push({ type: 'ul', items: [...buffer] });
    buffer = [];
  };

  let mode = 'p';
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      if (mode === 'ul') flushList();
      else flushPara();
      mode = 'p';
      continue;
    }
    if (line.startsWith('### ')) {
      if (mode === 'ul') flushList(); else flushPara();
      blocks.push({ type: 'h3', text: line.slice(4) });
      mode = 'p';
    } else if (line.startsWith('## ')) {
      if (mode === 'ul') flushList(); else flushPara();
      blocks.push({ type: 'h2', text: line.slice(3) });
      mode = 'p';
    } else if (line.startsWith('# ')) {
      if (mode === 'ul') flushList(); else flushPara();
      blocks.push({ type: 'h1', text: line.slice(2) });
      mode = 'p';
    } else if (/^[-*]\s+/.test(line)) {
      if (mode === 'p') flushPara();
      mode = 'ul';
      buffer.push(line.replace(/^[-*]\s+/, ''));
    } else {
      if (mode === 'ul') flushList();
      mode = 'p';
      buffer.push(line);
    }
  }
  if (mode === 'ul') flushList(); else flushPara();

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((b, idx) => {
        if (b.type === 'h1') return <h2 key={idx} className="font-display text-2xl md:text-3xl tracking-tight text-white mt-4">{renderInline(b.text)}</h2>;
        if (b.type === 'h2') return <h3 key={idx} className="font-display text-xl md:text-2xl tracking-tight text-white mt-5">{renderInline(b.text)}</h3>;
        if (b.type === 'h3') return <h4 key={idx} className="adam-mono text-[11px] uppercase tracking-[0.28em] text-[#F43F5E] mt-4 mb-1">{renderInline(b.text)}</h4>;
        if (b.type === 'ul') return (
          <ul key={idx} className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-white/85">
            {b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}
          </ul>
        );
        return <p key={idx} className="text-[15px] leading-[1.7] text-white/85">{renderInline(b.text)}</p>;
      })}
    </div>
  );
}
