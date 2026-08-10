import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Loader2, Sparkles, Check, ArrowUpRight,
  Globe, X, ChevronRight, FileText, Mail, Compass,
} from 'lucide-react';
import Markdown from '@/components/Markdown';
import { apiGet, apiPost } from '@/lib/api';

// ---------- constants ---------- //
const OPENING_LINE =
  "Let's start simple. What are you trying to achieve right now?";
const OPENING_CHIPS = [
  'More Leads', 'More Sales', 'Better Branding', 'Better Website',
  'Better SEO', 'Better Ads', 'Launch Something New', 'Something Else',
];
const DEEP_ACTIONS = [
  { id: 'roadmap', label: 'Build my 90-day roadmap', icon: FileText },
  { id: 'audit', label: 'Deep website audit', icon: Globe },
  { id: 'chat', label: 'Improve my marketing', icon: Sparkles },
  { id: 'talk', label: 'Talk to ADCOM', icon: Mail, accent: true },
  { id: 'done', label: "I'm done", icon: Check, muted: true },
];

function newSessionId() {
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

// ---------- typewriter ---------- //
function useTypewriter(text, speedMs = 14) {
  const [out, setOut] = useState('');
  useEffect(() => {
    setOut('');
    if (!text) return undefined;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speedMs);
    return () => clearInterval(t);
  }, [text, speedMs]);
  return out;
}

function AssistantBubble({ text, isLatest }) {
  const shown = useTypewriter(isLatest ? text : text, isLatest ? 14 : 0);
  const finalText = isLatest ? shown : text;
  return (
    <div className="flex items-start gap-3" data-testid="adam-chat-msg-assistant">
      <div className="w-8 h-8 rounded-full border border-[#D72638]/40 bg-[#D72638]/15 shrink-0 flex items-center justify-center mt-1">
        <Sparkles size={13} className="text-[#D72638]" />
      </div>
      <div className="max-w-[85%] md:max-w-[80%] rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/10 px-5 py-3 text-white/95 leading-[1.55] text-[15px]">
        {finalText}
        {isLatest && shown.length < text.length && (
          <span className="inline-block ml-1 w-[2px] h-[16px] align-middle bg-[#F43F5E] animate-pulse" />
        )}
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div className="flex justify-end" data-testid="adam-chat-msg-user">
      <div className="max-w-[85%] md:max-w-[70%] rounded-2xl rounded-tr-sm bg-[#E11D2E] px-5 py-3 text-white text-[15px] leading-[1.5] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3" data-testid="adam-typing">
      <div className="w-8 h-8 rounded-full border border-[#D72638]/40 bg-[#D72638]/15 shrink-0 flex items-center justify-center mt-1">
        <Sparkles size={13} className="text-[#D72638]" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/10 px-4 py-3 inline-flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/60"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({ children, onClick, testid, active = false, muted = false, accent = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testid}
      className={`text-left text-[13px] px-4 py-2.5 rounded-full border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        accent
          ? 'border-[#D72638] bg-[#D72638] text-white hover:bg-[#ff2f45]'
          : active
            ? 'border-[#D72638] bg-[#D72638]/10 text-white'
            : muted
              ? 'border-white/10 text-white/45 hover:text-white/80'
              : 'border-white/15 text-white/85 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/25'
      }`}
    >
      {children}
    </button>
  );
}

// ---------- Summary Cards ---------- //
function SummaryCards({ summary }) {
  const biz = summary?.business || {};
  const web = summary?.website;
  return (
    <div className="space-y-4" data-testid="adam-summary">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-[#D72638]/30 bg-black/50 p-6 backdrop-blur-md"
      >
        <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-[#D72638] mb-4">Business snapshot</div>
        <dl className="grid gap-4">
          <SummaryRow label="Business" value={biz.business} />
          <SummaryRow label="Primary goal" value={biz.primary_goal} />
          <SummaryRow label="Current challenge" value={biz.current_challenge} />
          <SummaryRow label="Opportunity" value={biz.opportunity} accent />
        </dl>
      </motion.div>
      {web && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
          data-testid="adam-summary-website"
        >
          <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4 flex items-center gap-2">
            <Globe size={12} /> Website snapshot
          </div>
          <dl className="grid gap-4">
            <SummaryRow label="What's working" value={web.whats_working} />
            <SummaryRow label="Needs attention" value={web.needs_attention} />
            <SummaryRow label="Biggest opportunity" value={web.biggest_opportunity} />
            <SummaryRow label="Quick win" value={web.quick_win} accent />
          </dl>
        </motion.div>
      )}
    </div>
  );
}
function SummaryRow({ label, value, accent = false }) {
  return (
    <div>
      <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/45 mb-1.5">{label}</div>
      <div className={`text-[15px] leading-[1.55] ${accent ? 'text-white font-medium' : 'text-white/90'}`}>{value || '—'}</div>
    </div>
  );
}

// ---------- Main Workspace ---------- //
export default function AdamWorkspace({ onExit }) {
  // messages: { role: 'user'|'assistant', text }
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({});
  const [suggestions, setSuggestions] = useState(OPENING_CHIPS);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState('greet'); // greet → discover → offer_website → scan → summary → deep_menu → roadmap → handover_open → done
  const [scan, setScan] = useState(null);
  const [scanErr, setScanErr] = useState('');
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [roadmap, setRoadmap] = useState('');
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [engineReady, setEngineReady] = useState(true);
  const [urlValue, setUrlValue] = useState('');
  const [showHandover, setShowHandover] = useState(false);
  const [handoverSent, setHandoverSent] = useState(false);
  const [handoverErr, setHandoverErr] = useState('');

  const sessionIdRef = useRef(newSessionId());
  const scrollRef = useRef(null);
  const turnCountRef = useRef(0);

  useEffect(() => {
    apiGet('/adam/status').then((s) => setEngineReady(!!s.llm_enabled)).catch(() => setEngineReady(false));
    // seed opening line into the transcript
    setMessages([{ role: 'assistant', text: OPENING_LINE }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, phase, summaryLoading, roadmapLoading, scan]);

  // ---------- Send a user message through /adam/discover ---------- //
  const sendTurn = useCallback(async (text) => {
    const clean = (text || '').trim();
    if (!clean || busy) return;
    setInput('');
    setSuggestions([]);
    // optimistic user bubble
    setMessages((m) => [...m, { role: 'user', text: clean }]);
    setBusy(true);
    turnCountRef.current += 1;

    try {
      const priorTranscript = messages.map((m) => ({ role: m.role, text: m.text }));
      const res = await apiPost('/adam/discover', {
        session_id: sessionIdRef.current,
        message: clean,
        profile,
        transcript: priorTranscript,
      });

      const nextProfile = { ...profile, ...(res.extracted || {}) };
      setProfile(nextProfile);
      setMessages((m) => [...m, { role: 'assistant', text: res.reply || '…' }]);
      setSuggestions(res.suggestions || []);

      // Offer website prompt after 3+ turns if we don't already have it, once, then let LLM pace naturally
      const substantiveFields = Object.values(nextProfile).filter(Boolean).length;
      if (res.ready_for_summary || substantiveFields >= 5) {
        // ask about website once
        if (!nextProfile.website && phase === 'greet') {
          setPhase('offer_website');
        } else if (phase !== 'summary') {
          // move to summary directly if we already have website (or the user skipped earlier)
          setPhase('offer_website');
        }
      } else if (phase === 'greet') {
        setPhase('discover');
      }
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: `Something interrupted my train of thought. ${e.message ? '(' + e.message + ')' : ''} Try again?` }]);
    } finally {
      setBusy(false);
    }
  }, [messages, profile, busy, phase]);

  // ---------- Website scan ---------- //
  const runScan = useCallback(async (rawUrl) => {
    let target = (rawUrl || urlValue).trim();
    if (!target) return;
    if (!/^https?:\/\//i.test(target)) target = `https://${target}`;
    setPhase('scanning');
    setScanErr('');
    setMessages((m) => [...m, { role: 'user', text: `Scan ${target}` }]);
    try {
      const s = await apiPost('/adam/scrape', { url: target });
      setScan(s);
      setProfile((p) => ({ ...p, website: s.url }));
      setMessages((m) => [...m, { role: 'assistant', text: `Site read. I have a picture of ${s.title || 'your brand'}. Give me a moment — putting the whole thing together.` }]);
      // proceed straight to summary
      generateSummary(s);
    } catch (e) {
      setScanErr(e.message || 'Could not reach that URL');
      setMessages((m) => [...m, { role: 'assistant', text: `I couldn't reach that URL — happens sometimes. We can continue without it.` }]);
      setPhase('offer_website');
    }
  }, [urlValue]);

  const skipWebsite = useCallback(() => {
    setMessages((m) => [...m, { role: 'user', text: 'Continue without website' }, { role: 'assistant', text: `No problem. I can still give you a direction from what you've told me — one moment.` }]);
    generateSummary(null);
  }, []);

  // ---------- Summary generation ---------- //
  const generateSummary = useCallback(async (siteScanArg) => {
    setSummaryLoading(true);
    setPhase('summary');
    try {
      const s = await apiPost('/adam/summary', {
        session_id: sessionIdRef.current,
        profile,
        site_context: siteScanArg ? siteContextSummary(siteScanArg) : (scan ? siteContextSummary(scan) : null),
      });
      setSummary(s);
      setPhase('deep_menu');
      setMessages((m) => [...m, { role: 'assistant', text: `Perfect. I have what I need. Here's what I'm seeing.` }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: `I couldn't compose the snapshot just now. ${e.message ? '(' + e.message + ')' : ''}` }]);
    } finally {
      setSummaryLoading(false);
    }
  }, [profile, scan]);

  // ---------- 90-day Roadmap ---------- //
  const generateRoadmap = useCallback(async () => {
    if (roadmapLoading) return;
    setRoadmapLoading(true);
    setPhase('roadmap');
    // Update status
    try { await apiPost('/adam/lead/upsert', { session_id: sessionIdRef.current, profile, transcript: messages, status: 'ANALYSIS_STARTED' }); } catch (_) { /* ignore */ }
    try {
      const goal = profile.goal || 'Build a stronger growth model over the next 90 days.';
      const r = await apiPost('/adam/roadmap', {
        session_id: sessionIdRef.current,
        site_context: scan ? siteContextSummary(scan) : null,
        goal: `${goal}. Business: ${profile.business_type || profile.industry || 'unspecified'}. Audience: ${profile.audience || 'unspecified'}. Pain points: ${profile.pain_points || 'unspecified'}. Current marketing: ${profile.marketing_channels || 'unspecified'}.`,
      });
      setRoadmap(r.markdown || '');
    } catch (e) {
      setRoadmap(`### Roadmap unavailable\n${e.message || 'Please try again in a moment.'}`);
    } finally {
      setRoadmapLoading(false);
    }
  }, [profile, scan, messages, roadmapLoading]);

  // ---------- Deep menu action ---------- //
  const onDeepAction = useCallback(async (id) => {
    if (id === 'roadmap') { generateRoadmap(); return; }
    if (id === 'audit') {
      if (!scan) {
        setPhase('offer_website');
        setMessages((m) => [...m, { role: 'assistant', text: `I'll need your website URL for the deep audit — drop it below.` }]);
        return;
      }
      // continue the conversation in "audit" mode via /discover
      setPhase('discover');
      sendTurn('Give me a deeper audit of my website — go into technical SEO, positioning, conversion.');
      return;
    }
    if (id === 'chat') {
      setPhase('discover');
      sendTurn('How would you improve my marketing operating model? Diagnose the model, not the channels.');
      return;
    }
    if (id === 'talk') { setShowHandover(true); return; }
    if (id === 'done') {
      setPhase('done');
      setMessages((m) => [...m, { role: 'assistant', text: `Great. Nothing to sign, nothing to submit — take what's useful. If anything I said resonates, you know where to find us.` }]);
    }
  }, [scan, generateRoadmap, sendTurn]);

  // ---------- Handover ---------- //
  const submitHandover = useCallback(async () => {
    setHandoverErr('');
    if (!profile.email && !profile.phone) { setHandoverErr('Add an email or phone so the studio can reply.'); return; }
    try {
      await apiPost('/adam/handover', {
        session_id: sessionIdRef.current,
        profile,
        transcript: messages,
        summary,
        roadmap_markdown: roadmap || null,
        site_context: scan ? siteContextSummary(scan) : null,
      });
      setHandoverSent(true);
    } catch (e) {
      setHandoverErr(e.message || 'Could not send. Try again.');
    }
  }, [profile, messages, summary, roadmap, scan]);

  // ---------- UI helpers ---------- //
  const showComposer = ['greet', 'discover', 'summary', 'deep_menu', 'roadmap', 'done'].includes(phase);
  const disabledInput = busy || summaryLoading || roadmapLoading || phase === 'scanning';

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-black/70 backdrop-blur-2xl" data-testid="adam-workspace">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-8 pt-4 md:pt-5 pb-3 border-b border-white/10 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#D72638]/40 bg-[#D72638]/15 flex items-center justify-center">
            <Sparkles size={14} className="text-[#D72638]" />
          </div>
          <div>
            <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-[#D72638] flex items-center gap-1.5">
              ADAM · Live
              <span className="w-1 h-1 rounded-full bg-[#D72638] animate-pulse" />
            </div>
            <div className="text-sm text-white/85 font-medium">Growth Consultant</div>
          </div>
        </div>
        <button
          onClick={onExit}
          data-testid="adam-workspace-exit"
          className="ml-auto adam-mono text-[10px] uppercase tracking-[0.24em] text-white/50 hover:text-white flex items-center gap-2"
        >
          Return to site <X size={12} />
        </button>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((m, i) => {
            const isLatest = i === messages.length - 1;
            if (m.role === 'assistant') return <AssistantBubble key={i} text={m.text} isLatest={isLatest && !busy && !summaryLoading} />;
            return <UserBubble key={i} text={m.text} />;
          })}

          {busy && <TypingIndicator />}

          {/* Website offer */}
          {phase === 'offer_website' && !busy && !summaryLoading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5" data-testid="adam-offer-website"
            >
              <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#D72638] mb-2">One more thing</div>
              <div className="text-[15px] text-white/90 leading-[1.55] mb-4">
                If you have a website, share it with me. I can give you a quick snapshot of what I see. Totally optional.
              </div>
              <div className="flex items-center gap-2 mb-3">
                <input
                  data-testid="adam-url-input"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runScan()}
                  placeholder="your-brand.com"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-white/10 focus:border-[#D72638] outline-none text-sm placeholder:text-white/30"
                />
                <button data-testid="adam-scan-btn" onClick={() => runScan()} disabled={!urlValue.trim()} className="px-5 py-2.5 rounded-full bg-[#D72638] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#ff2f45] disabled:opacity-40 disabled:cursor-not-allowed">
                  Analyse
                </button>
              </div>
              <button data-testid="adam-skip-website" onClick={skipWebsite} className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/45 hover:text-white flex items-center gap-1.5">
                Continue without website <ChevronRight size={12} />
              </button>
              {scanErr && <div className="mt-3 text-xs text-[#F43F5E]">{scanErr}</div>}
            </motion.div>
          )}

          {phase === 'scanning' && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-center gap-3 text-white/70 text-sm" data-testid="adam-scanning">
              <Loader2 size={14} className="animate-spin text-[#D72638]" /> Reading your website…
            </div>
          )}

          {/* Summary reward */}
          {summaryLoading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex items-center gap-3 text-white/70 text-sm" data-testid="adam-summary-loading">
              <Loader2 size={14} className="animate-spin text-[#D72638]" /> Composing your snapshot…
            </div>
          )}
          {summary && !summaryLoading && <SummaryCards summary={summary} />}

          {/* Deep-menu */}
          {phase === 'deep_menu' && summary && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5" data-testid="adam-deep-menu">
              <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/45 mb-3 flex items-center gap-2"><Compass size={12} /> If you&apos;d like, I can go deeper</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {DEEP_ACTIONS.map((a) => (
                  <button
                    key={a.id}
                    data-testid={`adam-deep-${a.id}`}
                    onClick={() => onDeepAction(a.id)}
                    className={`text-left px-4 py-3 rounded-xl border flex items-center gap-3 transition-all ${
                      a.accent
                        ? 'border-[#D72638] bg-[#D72638] text-white hover:bg-[#ff2f45]'
                        : a.muted
                          ? 'border-white/10 text-white/50 hover:text-white/85 bg-transparent'
                          : 'border-white/15 text-white/90 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/25'
                    }`}
                  >
                    <a.icon size={15} />
                    <span className="text-sm font-medium">{a.label}</span>
                    <ArrowUpRight size={14} className="ml-auto opacity-60" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Roadmap */}
          {(roadmap || roadmapLoading) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[#D72638]/40 bg-black/60 p-5 md:p-6" data-testid="adam-roadmap">
              <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-[#D72638] mb-3 flex items-center gap-2">
                <FileText size={12} /> Your 90-day roadmap
              </div>
              {roadmapLoading && !roadmap ? (
                <div className="flex items-center gap-2 text-sm text-white/60"><Loader2 size={14} className="animate-spin" /> Composing…</div>
              ) : (
                <>
                  <Markdown text={roadmap} />
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        const blob = new Blob([`# 90-day Roadmap for ${profile.company || profile.name || 'your business'}\n\nGenerated by ADAM · Adcom Media\n\n${roadmap}`], { type: 'text/markdown' });
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = `adam-roadmap.md`;
                        a.click();
                        URL.revokeObjectURL(a.href);
                      }}
                      className="px-4 py-2 rounded-full border border-white/15 text-[11px] uppercase tracking-widest hover:bg-white/5"
                    >Download .md</button>
                    <button
                      data-testid="adam-open-handover"
                      onClick={() => setShowHandover(true)}
                      className="px-4 py-2 rounded-full bg-[#D72638] text-white text-[11px] uppercase tracking-widest hover:bg-[#ff2f45]"
                    >Talk to ADCOM</button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Composer */}
      {showComposer && (
        <div className="shrink-0 border-t border-white/10 bg-black/70 px-4 md:px-8 py-4">
          <div className="max-w-3xl mx-auto">
            {!engineReady && <div className="mb-3 text-xs text-[#F43F5E]">AI engine offline. Configure EMERGENT_LLM_KEY.</div>}
            {suggestions.length > 0 && !busy && (
              <div className="flex flex-wrap gap-2 mb-3" data-testid="adam-suggestions">
                {suggestions.map((s, i) => (
                  <Chip key={i} onClick={() => sendTurn(s)} testid="adam-suggestion" disabled={disabledInput}>{s}</Chip>
                ))}
              </div>
            )}
            <div className="flex items-end gap-3">
              <textarea
                data-testid="adam-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTurn(input); } }}
                placeholder="Type your reply…"
                disabled={disabledInput}
                rows={1}
                className="flex-1 resize-none px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#D72638] outline-none text-sm placeholder:text-white/30 disabled:opacity-50"
              />
              <button
                data-testid="adam-send-btn"
                onClick={() => sendTurn(input)}
                disabled={disabledInput || !input.trim()}
                className="w-11 h-11 rounded-full bg-[#D72638] text-white flex items-center justify-center hover:bg-[#ff2f45] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Handover modal */}
      <AnimatePresence>
        {showHandover && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
            data-testid="adam-handover-modal"
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8">
              {handoverSent ? (
                <div className="text-center py-4" data-testid="adam-handover-success">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#D72638]/15 border border-[#D72638]/40 flex items-center justify-center mb-4">
                    <Check size={20} className="text-[#D72638]" />
                  </div>
                  <div className="font-display text-2xl mb-2">Brief sent to the studio.</div>
                  <div className="text-sm text-white/60">A strategist will reach out within one working day — with everything ADAM learned already in hand.</div>
                  <button onClick={() => { setShowHandover(false); setHandoverSent(false); onExit && onExit(); }} className="mt-6 px-5 py-2 rounded-full border border-white/15 text-xs uppercase tracking-widest hover:bg-white/5">Close</button>
                </div>
              ) : (
                <>
                  <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#D72638] mb-2">Handover</div>
                  <div className="font-display text-2xl md:text-3xl tracking-tight mb-4">Bring in the humans.</div>
                  <p className="text-sm text-white/60 leading-relaxed mb-5">
                    I&apos;ll pass everything you&apos;ve shared — the business context, the summary and the roadmap if we built one — to a strategist at ADCOM. No pitch deck, no dead form.
                  </p>
                  <div className="space-y-3">
                    {!profile.name && (
                      <input placeholder="Your name" onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} data-testid="adam-handover-name" className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-[#D72638] outline-none text-sm" />
                    )}
                    {profile.name && (
                      <div className="text-xs text-white/50 flex items-center gap-2"><Check size={12} className="text-[#D72638]" /> Name: <span className="text-white/85">{profile.name}</span></div>
                    )}
                    {!profile.email && (
                      <input placeholder="Work email" onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} data-testid="adam-handover-email" className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-[#D72638] outline-none text-sm" />
                    )}
                    {profile.email && (
                      <div className="text-xs text-white/50 flex items-center gap-2"><Check size={12} className="text-[#D72638]" /> Email: <span className="text-white/85">{profile.email}</span></div>
                    )}
                    {!profile.phone && (
                      <input placeholder="Phone (optional)" onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} data-testid="adam-handover-phone" className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-[#D72638] outline-none text-sm" />
                    )}
                    {profile.phone && (
                      <div className="text-xs text-white/50 flex items-center gap-2"><Check size={12} className="text-[#D72638]" /> Phone: <span className="text-white/85">{profile.phone}</span></div>
                    )}
                  </div>
                  {handoverErr && <div className="mt-3 text-xs text-[#F43F5E]">{handoverErr}</div>}
                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button onClick={() => setShowHandover(false)} className="px-4 py-2 rounded-full border border-white/15 text-xs uppercase tracking-widest hover:bg-white/5">Not yet</button>
                    <button onClick={submitHandover} data-testid="adam-handover-submit" className="px-5 py-2 rounded-full bg-[#D72638] text-white text-xs uppercase tracking-widest hover:bg-[#ff2f45]">Send brief to ADCOM</button>
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
