import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Sparkles, ChevronRight, Loader2, FileText, Check } from 'lucide-react';
import Markdown from '@/components/Markdown';
import { apiGet, apiPost, streamChat } from '@/lib/api';

const MODES = [
  { id: 'strategy', label: 'Strategy', accent: 'Full-spectrum CMO' },
  { id: 'seo', label: 'AI SEO', accent: 'Citation & entity' },
  { id: 'growth', label: 'Growth', accent: 'Channels & LTV' },
  { id: 'brand', label: 'Brand', accent: 'Positioning' },
];

const SUGGESTIONS = {
  strategy: [
    'What are the 3 biggest strategic risks you see for us right now?',
    'If you were our CMO for 90 days, what would you fix first?',
    'What positioning move would compound over 24 months?',
  ],
  seo: [
    'Audit our top 3 AI SEO gaps against category leaders.',
    'What schema and entity signals should we add today?',
    'Which topics should we own to earn LLM citations?',
  ],
  growth: [
    'Diagnose our growth model, not just our channels.',
    'How would you improve CAC:LTV in the next 90 days?',
    'Where does creative iteration have the biggest lift?',
  ],
  brand: [
    'How strong is our category ownership from the site alone?',
    'Rewrite our positioning in one sentence a founder would use.',
    'What voice would give us more pricing power?',
  ],
};

function makeSessionId() {
  return 'adam_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now();
}

function siteContextSummary(scan) {
  if (!scan) return '';
  const h1s = (scan.h1 || []).slice(0, 3).join(' · ');
  const h2s = (scan.h2 || []).slice(0, 6).join(' · ');
  return [
    `URL: ${scan.url}`,
    `Title: ${scan.title}`,
    `Meta description: ${scan.description || '(none)'}`,
    `H1: ${h1s || '(none)'}`,
    `H2: ${h2s || '(none)'}`,
    `Word count: ${scan.word_count}`,
    `Text sample:\n${(scan.text_sample || '').slice(0, 2400)}`,
  ].join('\n');
}

function ChatBubble({ msg, streaming }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 ${
          isUser
            ? 'bg-[#E11D2E] text-white rounded-tr-sm'
            : 'bg-white/[0.04] border border-white/10 rounded-tl-sm text-white/95'
        }`}
        data-testid={`adam-chat-msg-${msg.role}`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap leading-[1.55]">{msg.text}</div>
        ) : (
          <>
            <Markdown text={msg.text || '…'} />
            {streaming && (
              <span className="inline-block ml-1 w-[2px] h-[16px] align-middle bg-[#F43F5E] animate-pulse" />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function AdamWorkspace({ onExit }) {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scan, setScan] = useState(null);
  const [scanErr, setScanErr] = useState('');
  const [mode, setMode] = useState('strategy');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [engineReady, setEngineReady] = useState(true);
  const [roadmap, setRoadmap] = useState('');
  const [buildingRoadmap, setBuildingRoadmap] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [lead, setLead] = useState({ name: '', email: '', message: '' });
  const [leadSent, setLeadSent] = useState(false);
  const [leadErr, setLeadErr] = useState('');
  const scrollRef = useRef(null);
  const sessionIdRef = useRef(makeSessionId());
  const abortRef = useRef(null);

  useEffect(() => {
    apiGet('/adam/status').then((s) => setEngineReady(!!s.llm_enabled)).catch(() => setEngineReady(false));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, roadmap, buildingRoadmap]);

  // If URL changes, reset session so the AI has fresh context
  const runScan = useCallback(async () => {
    if (!url.trim()) return;
    setScanning(true); setScanErr(''); setScan(null); setMessages([]); setRoadmap('');
    sessionIdRef.current = makeSessionId();
    let target = url.trim();
    if (!/^https?:\/\//i.test(target)) target = `https://${target}`;
    try {
      const s = await apiPost('/adam/scrape', { url: target });
      setScan(s);
    } catch (e) {
      setScanErr(e.message || 'Could not scan that site');
    } finally { setScanning(false); }
  }, [url]);

  const sendMessage = useCallback(async (text) => {
    const clean = (text ?? input).trim();
    if (!clean || busy) return;
    setInput('');
    const userMsg = { role: 'user', text: clean };
    const asstMsg = { role: 'assistant', text: '' };
    setMessages((m) => [...m, userMsg, asstMsg]);
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const stream = streamChat({
        session_id: sessionIdRef.current,
        mode,
        message: clean,
        site_context: siteContextSummary(scan),
      }, controller.signal);
      for await (const chunk of stream) {
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last && last.role === 'assistant') {
            copy[copy.length - 1] = { ...last, text: (last.text || '') + (last.text ? '\n' : '') + chunk };
          }
          return copy;
        });
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last && last.role === 'assistant') {
          copy[copy.length - 1] = { ...last, text: (last.text || '') + `\n\n_Stream ended: ${e.message || 'error'}_` };
        }
        return copy;
      });
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }, [input, busy, mode, scan]);

  const generateRoadmap = useCallback(async () => {
    if (buildingRoadmap) return;
    setBuildingRoadmap(true); setRoadmap('');
    try {
      const goal = messages.filter((m) => m.role === 'user').slice(-3).map((m) => m.text).join(' | ') || 'Grow contribution profit and category authority over the next 90 days.';
      const r = await apiPost('/adam/roadmap', {
        session_id: sessionIdRef.current,
        site_context: siteContextSummary(scan),
        goal,
      });
      setRoadmap(r.markdown || '');
    } catch (e) {
      setRoadmap(`### Roadmap unavailable\n${e.message || 'Please try again in a moment.'}`);
    } finally { setBuildingRoadmap(false); }
  }, [buildingRoadmap, messages, scan]);

  const downloadRoadmap = () => {
    const blob = new Blob([`# 90-day Roadmap for ${scan?.title || url}\n\nGenerated by ADAM · Adcom Media\n\n${roadmap}`], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `adam-roadmap-${(scan?.url || 'website').replace(/[^a-z0-9]+/gi, '-').slice(0, 40)}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const submitLead = async () => {
    setLeadErr('');
    if (!lead.email || !lead.name) { setLeadErr('Name and email required.'); return; }
    try {
      await apiPost('/contact', {
        name: lead.name,
        email: lead.email,
        website: scan?.url || url || '',
        message: `[ADAM lead · ${mode.toUpperCase()} session]\n\n${lead.message || 'Interested in a strategy call.'}\n\nSession id: ${sessionIdRef.current}\nSite scanned: ${scan?.url || url || 'n/a'}\nLast question: ${messages.filter(m => m.role === 'user').slice(-1)[0]?.text || 'n/a'}`,
        source: 'adam-workspace',
      });
      setLeadSent(true);
    } catch (e) {
      setLeadErr(e.message || 'Could not send. Try again.');
    }
  };

  const suggestions = SUGGESTIONS[mode] || [];
  const hasChat = messages.length > 0;

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-black/60 backdrop-blur-xl" data-testid="adam-workspace">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-8 pt-4 md:pt-6 pb-3 border-b border-white/10 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#D72638]/40 bg-[#D72638]/15 flex items-center justify-center">
            <Sparkles size={14} className="text-[#D72638]" />
          </div>
          <div>
            <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-[#D72638]">ADAM · Live</div>
            <div className="text-sm text-white/85 font-medium">Growth Intelligence Workspace</div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              data-testid={`adam-mode-${m.id}`}
              onClick={() => setMode(m.id)}
              className={`adam-mono text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border transition-colors ${mode === m.id ? 'border-[#D72638] text-white bg-[#D72638]/15' : 'border-white/10 text-white/50 hover:text-white/85'}`}
              title={m.accent}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 grid lg:grid-cols-12 gap-0">
        {/* Left rail — URL + scan summary */}
        <aside className="lg:col-span-4 border-r border-white/10 flex flex-col min-h-0">
          <div className="p-5 md:p-6">
            <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-3">Analyse a website</div>
            <div className="relative">
              <input
                data-testid="adam-url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runScan()}
                placeholder="your-brand.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black border border-white/10 focus:border-[#D72638] outline-none text-sm placeholder:text-white/30"
              />
              <Search size={15} className="absolute top-1/2 -translate-y-1/2 left-4 text-white/40" />
            </div>
            <button
              data-testid="adam-scan-btn"
              onClick={runScan}
              disabled={!url.trim() || scanning}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#D72638] text-white text-sm font-semibold hover:bg-[#ff2f45] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {scanning ? <><Loader2 size={14} className="animate-spin" /> Scanning</> : <>Scan site <ChevronRight size={14} /></>}
            </button>
            {scanErr && <div className="mt-3 text-xs text-[#F43F5E]">{scanErr}</div>}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-5 md:px-6 pb-6">
            {scan ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5" data-testid="adam-scan-card">
                <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#D72638] mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D72638] animate-pulse" /> Brand profile
                </div>
                <div className="font-display text-lg leading-tight tracking-tight mb-1">{scan.title || '(no title)'}</div>
                <div className="text-xs text-white/50 break-all mb-4">{scan.url}</div>
                {scan.description && <div className="text-sm text-white/70 leading-relaxed mb-4">{scan.description}</div>}
                {(scan.h1 || []).length > 0 && (
                  <div className="mb-3">
                    <div className="adam-mono text-[10px] uppercase tracking-[0.22em] text-white/40 mb-1.5">Top H1</div>
                    <div className="text-sm text-white/85">{scan.h1[0]}</div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-xs text-white/60">
                  <div><span className="text-white/40">Words</span> · {scan.word_count}</div>
                  <div><span className="text-white/40">Lang</span> · {scan.language || 'auto'}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-white/40 leading-relaxed">
                Paste your live website URL. ADAM will parse the copy, title, meta and headings — then talk to you as if it just met the brand.
              </div>
            )}

            {scan && (
              <div className="mt-6">
                <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-3">Try asking</div>
                <div className="flex flex-col gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      data-testid="adam-suggestion"
                      className="text-left text-sm text-white/75 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right — chat + roadmap + lead */}
        <section className="lg:col-span-8 flex flex-col min-h-0">
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
            {!scan && !hasChat && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-[#D72638] mb-4">Step 1</div>
                <div className="font-display text-3xl md:text-4xl tracking-tight max-w-xl leading-tight">
                  Give ADAM your URL.<br />
                  <span className="text-white/50">It will read your brand before it speaks.</span>
                </div>
              </div>
            )}
            {scan && !hasChat && (
              <div className="text-white/70 text-sm max-w-xl">
                <span className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#D72638]">ADAM</span>
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                  Site read. I have a picture of <span className="text-white font-medium">{scan.title || 'your brand'}</span>. Pick a mode above, or start with one of the suggestions on the left. Ask me anything about growth, positioning, or how the market sees you.
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <ChatBubble key={i} msg={m} streaming={busy && i === messages.length - 1 && m.role === 'assistant'} />
            ))}

            {/* Roadmap */}
            {(roadmap || buildingRoadmap) && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[#D72638]/40 bg-black/60 p-5 md:p-6" data-testid="adam-roadmap">
                <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-[#D72638] mb-3 flex items-center gap-2">
                  <FileText size={12} /> 90-Day Roadmap
                </div>
                {buildingRoadmap && !roadmap ? (
                  <div className="flex items-center gap-2 text-sm text-white/60"><Loader2 size={14} className="animate-spin" /> Composing…</div>
                ) : (
                  <>
                    <Markdown text={roadmap} />
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button onClick={downloadRoadmap} className="px-4 py-2 rounded-full border border-white/15 text-xs uppercase tracking-widest hover:bg-white/5">Download .md</button>
                      <button onClick={() => setShowLead(true)} className="px-4 py-2 rounded-full bg-[#D72638] text-white text-xs uppercase tracking-widest hover:bg-[#ff2f45]">Talk to the studio</button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-white/10 bg-black/60 px-4 md:px-8 py-4">
            {!engineReady && (
              <div className="mb-3 text-xs text-[#F43F5E]">AI engine offline. Configure EMERGENT_LLM_KEY.</div>
            )}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <textarea
                  data-testid="adam-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={scan ? 'Ask ADAM anything about growth, brand or SEO…' : 'Scan a site first, then ask ADAM anything.'}
                  disabled={!scan || busy}
                  rows={1}
                  className="w-full resize-none px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#D72638] outline-none text-sm placeholder:text-white/30 disabled:opacity-50"
                />
              </div>
              <button
                data-testid="adam-send-btn"
                onClick={() => sendMessage()}
                disabled={!scan || !input.trim() || busy}
                className="w-11 h-11 rounded-full bg-[#D72638] text-white flex items-center justify-center hover:bg-[#ff2f45] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                title="Send"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            {hasChat && !roadmap && !buildingRoadmap && (
              <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
                <button onClick={generateRoadmap} disabled={busy} data-testid="adam-generate-roadmap" className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/50 hover:text-white flex items-center gap-2 disabled:opacity-40">
                  <FileText size={12} /> Generate 90-day roadmap
                </button>
                <button onClick={() => setShowLead(true)} data-testid="adam-open-lead" className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#D72638] hover:text-white flex items-center gap-2">
                  Talk to the studio <ChevronRight size={12} />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Lead capture */}
      <AnimatePresence>
        {showLead && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4" data-testid="adam-lead-modal">
            <motion.div initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-8">
              {leadSent ? (
                <div className="text-center py-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#D72638]/15 border border-[#D72638]/40 flex items-center justify-center mb-4">
                    <Check size={20} className="text-[#D72638]" />
                  </div>
                  <div className="font-display text-2xl mb-2">Thanks — we'll be in touch.</div>
                  <div className="text-sm text-white/60">The studio will reply within one working day.</div>
                  <button onClick={() => { setShowLead(false); setLeadSent(false); }} className="mt-6 px-5 py-2 rounded-full border border-white/15 text-xs uppercase tracking-widest hover:bg-white/5">Close</button>
                </div>
              ) : (
                <>
                  <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#D72638] mb-2">Handover</div>
                  <div className="font-display text-2xl md:text-3xl tracking-tight mb-5">Bring in the humans.</div>
                  <p className="text-sm text-white/60 mb-6">ADAM has enough context. Leave your details and a partner from Adcom will reach out with a tailored next step — no pitch deck, no fluff.</p>
                  <div className="space-y-3">
                    <input placeholder="Your name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} data-testid="adam-lead-name" className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-[#D72638] outline-none text-sm" />
                    <input placeholder="Work email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} data-testid="adam-lead-email" className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-[#D72638] outline-none text-sm" />
                    <textarea placeholder="Anything specific you want the team to see?" value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} data-testid="adam-lead-message" rows={3} className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-[#D72638] outline-none text-sm placeholder:text-white/30" />
                  </div>
                  {leadErr && <div className="mt-3 text-xs text-[#F43F5E]">{leadErr}</div>}
                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button onClick={() => setShowLead(false)} className="px-4 py-2 rounded-full border border-white/15 text-xs uppercase tracking-widest hover:bg-white/5">Cancel</button>
                    <button onClick={submitLead} data-testid="adam-lead-submit" className="px-5 py-2 rounded-full bg-[#D72638] text-white text-xs uppercase tracking-widest hover:bg-[#ff2f45]">Send to studio</button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
