import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Loader2, X, Mail, Phone, Globe, Building2, User,
  MapPin, Target, Users, Wrench, IndianRupee, Clock, FileText,
  Sparkles, ChevronRight, Trash2, CheckCircle2,
} from 'lucide-react';
import { apiGet, apiPatch, apiDelete } from '@/lib/api';
import Markdown from '@/components/Markdown';

const STATUSES = ['DRAFT', 'QUALIFIED', 'ANALYSIS_STARTED', 'ANALYSIS_COMPLETED', 'CONTACT_REQUESTED', 'CONVERTED'];

function StatusBadge({ status }) {
  const map = {
    DRAFT: 'border-white/15 text-white/50',
    QUALIFIED: 'border-white/25 text-white/80',
    ANALYSIS_STARTED: 'border-white/30 text-white',
    ANALYSIS_COMPLETED: 'border-[#F43F5E]/40 text-white/95 bg-[#F43F5E]/5',
    CONTACT_REQUESTED: 'border-[#F43F5E]/60 text-white bg-[#F43F5E]/15',
    CONVERTED: 'border-emerald-400/60 text-emerald-200 bg-emerald-400/10',
  };
  return (
    <span className={`adam-mono text-[9.5px] uppercase tracking-[0.22em] px-2 py-1 rounded-full border ${map[status] || map.DRAFT}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function ScorePill({ score }) {
  const color = score >= 70 ? 'text-emerald-300' : score >= 40 ? 'text-[#F43F5E]' : 'text-white/50';
  return (
    <div className={`adam-mono text-[11px] font-medium ${color}`}>
      {score}<span className="text-white/25 text-[10px]">/100</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon size={13} className="text-white/40 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="adam-mono text-[9px] uppercase tracking-[0.24em] text-white/40">{label}</div>
        <div className="text-white/90 leading-snug break-words">{value}</div>
      </div>
    </div>
  );
}

function LeadDetail({ lead, onClose, onMutate }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const p = lead.profile || {};
  const bizSum = lead.business_summary;
  const webSum = lead.website_summary;

  const update = async (next) => {
    setBusy(true);
    try {
      const updated = await apiPatch(`/admin/leads/${lead.lead_id}/status`, { status: next });
      setStatus(updated.status);
      onMutate && onMutate(updated);
    } catch (e) {
      window.alert(e.message || 'Failed to update');
    } finally { setBusy(false); }
  };

  const remove = async () => {
    if (!window.confirm(`Delete lead ${p.company || p.name || lead.lead_id}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await apiDelete(`/admin/leads/${lead.lead_id}`);
      onMutate && onMutate({ deleted: lead.lead_id });
      onClose();
    } catch (e) {
      window.alert(e.message || 'Delete failed');
    } finally { setBusy(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-xl flex items-start md:items-center justify-center overflow-y-auto p-4 md:p-8"
      data-testid="lead-detail"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl my-8 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 md:px-8 py-5 border-b border-white/10 flex items-center gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <StatusBadge status={status} />
              <ScorePill score={lead.lead_score} />
              <span className="adam-mono text-[10px] text-white/30">{lead.lead_id}</span>
            </div>
            <div className="font-display text-2xl md:text-3xl tracking-tight truncate">
              {p.company || p.name || 'Unknown lead'}
            </div>
          </div>
          <button
            onClick={onClose}
            data-testid="lead-detail-close"
            className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="grid lg:grid-cols-5 gap-0">
          {/* Left column: profile + actions */}
          <aside className="lg:col-span-2 border-r border-white/10 p-6 md:p-7 space-y-5">
            <div>
              <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#F43F5E] mb-3">Lead</div>
              <div className="space-y-3">
                <InfoRow icon={User} label="Name" value={p.name} />
                <InfoRow icon={Building2} label="Company" value={p.company} />
                <InfoRow icon={Mail} label="Email" value={p.email} />
                <InfoRow icon={Phone} label="Phone" value={p.phone} />
                <InfoRow icon={Globe} label="Website" value={p.website} />
                <InfoRow icon={MapPin} label="Location / Market" value={[p.location, p.market].filter(Boolean).join(' · ')} />
              </div>
            </div>
            <div>
              <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#F43F5E] mb-3">Business</div>
              <div className="space-y-3">
                <InfoRow icon={Target} label="Goal" value={p.goal} />
                <InfoRow icon={Users} label="Audience" value={p.audience} />
                <InfoRow icon={Sparkles} label="Industry / type" value={[p.industry, p.business_type].filter(Boolean).join(' · ')} />
                <InfoRow icon={Wrench} label="Pain points" value={p.pain_points} />
                <InfoRow icon={Wrench} label="Current marketing" value={p.marketing_channels} />
                <InfoRow icon={IndianRupee} label="Budget" value={p.budget} />
                <InfoRow icon={Clock} label="Timeline" value={p.timeline} />
              </div>
            </div>

            {/* Status controls */}
            <div className="pt-4 border-t border-white/10">
              <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/50 mb-3">Status</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => update(s)}
                    disabled={busy || s === status}
                    data-testid={`lead-status-${s.toLowerCase()}`}
                    className={`adam-mono text-[9.5px] uppercase tracking-[0.22em] px-2.5 py-1.5 rounded-full border transition-colors disabled:cursor-not-allowed ${
                      s === status
                        ? 'border-[#F43F5E] bg-[#F43F5E]/15 text-white'
                        : 'border-white/12 text-white/55 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <button
                onClick={() => update('CONVERTED')}
                disabled={busy || status === 'CONVERTED'}
                data-testid="lead-mark-converted"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-black font-semibold text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 size={14} /> {status === 'CONVERTED' ? 'Converted' : 'Mark converted'}
              </button>
              <button
                onClick={remove}
                disabled={busy}
                data-testid="lead-delete"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/60 text-xs uppercase tracking-widest hover:bg-[#E11D2E] hover:border-[#E11D2E] hover:text-white transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </aside>

          {/* Right column: summaries + transcript */}
          <section className="lg:col-span-3 p-6 md:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
            {bizSum && (
              <div>
                <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#F43F5E] mb-3">ADAM · Business summary</div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2 text-sm leading-relaxed">
                  <div><span className="text-white/45">Business — </span>{bizSum.business}</div>
                  <div><span className="text-white/45">Goal — </span>{bizSum.primary_goal}</div>
                  <div><span className="text-white/45">Challenge — </span>{bizSum.current_challenge}</div>
                  <div><span className="text-white/45">Opportunity — </span><span className="text-white">{bizSum.opportunity}</span></div>
                </div>
              </div>
            )}
            {webSum && (
              <div>
                <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#F43F5E] mb-3">ADAM · Website snapshot</div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2 text-sm leading-relaxed">
                  <div><span className="text-white/45">Working — </span>{webSum.whats_working}</div>
                  <div><span className="text-white/45">Attention — </span>{webSum.needs_attention}</div>
                  <div><span className="text-white/45">Opportunity — </span>{webSum.biggest_opportunity}</div>
                  <div><span className="text-white/45">Quick win — </span><span className="text-white">{webSum.quick_win}</span></div>
                </div>
              </div>
            )}
            {lead.roadmap_markdown && (
              <div>
                <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-[#F43F5E] mb-3 flex items-center gap-2">
                  <FileText size={12} /> 90-day roadmap
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Markdown text={lead.roadmap_markdown} />
                </div>
              </div>
            )}

            <div>
              <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/50 mb-3">Transcript · {(lead.transcript || []).length} turns</div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                {(lead.transcript || []).length === 0 && (
                  <div className="text-sm text-white/40">No conversation captured.</div>
                )}
                {(lead.transcript || []).map((t, i) => (
                  <div key={i}>
                    <div className={`adam-mono text-[9px] uppercase tracking-[0.28em] mb-1 ${t.role === 'user' ? 'text-white/45' : 'text-[#F43F5E]'}`}>
                      {t.role === 'user' ? 'Lead' : 'ADAM'}
                    </div>
                    <div className="text-sm text-white/85 leading-[1.55] whitespace-pre-wrap">{t.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LeadInbox() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [markingId, setMarkingId] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (statusFilter) qs.set('status', statusFilter);
      if (query.trim()) qs.set('q', query.trim());
      const [list, s] = await Promise.all([
        apiGet(`/admin/leads${qs.toString() ? `?${qs}` : ''}`),
        apiGet('/admin/leads/stats'),
      ]);
      setLeads(list);
      setStats(s);
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, [statusFilter]);

  const markConverted = async (lead) => {
    setMarkingId(lead.lead_id);
    try {
      await apiPatch(`/admin/leads/${lead.lead_id}/status`, { status: 'CONVERTED' });
      setLeads((ls) => ls.map((l) => l.lead_id === lead.lead_id ? { ...l, status: 'CONVERTED' } : l));
      // Reload stats
      apiGet('/admin/leads/stats').then(setStats).catch(() => {});
    } catch (e) {
      window.alert(e.message || 'Failed to mark converted');
    } finally { setMarkingId(null); }
  };

  const onDetailMutate = (updated) => {
    if (updated?.deleted) {
      setLeads((ls) => ls.filter((l) => l.lead_id !== updated.deleted));
    } else if (updated?.lead_id) {
      setLeads((ls) => ls.map((l) => l.lead_id === updated.lead_id ? updated : l));
    }
    apiGet('/admin/leads/stats').then(setStats).catch(() => {});
  };

  const statCards = useMemo(() => {
    const by = stats?.by_status || {};
    return [
      { label: 'Total leads', value: stats?.total ?? 0, testid: 'lead-stat-total' },
      { label: 'Contact requested', value: by.CONTACT_REQUESTED || 0, testid: 'lead-stat-contact-requested' },
      { label: 'Converted', value: by.CONVERTED || 0, testid: 'lead-stat-converted' },
      { label: 'Avg score', value: stats?.avg_score ?? 0, testid: 'lead-stat-score' },
    ];
  }, [stats]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div>
        <div className="adam-mono text-[11px] uppercase tracking-[0.3em] text-[#F43F5E] mb-3">Inbox · ADAM leads</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tighter leading-[0.95]">
          The signal.<br /><span className="text-white/40">Who&apos;s worth calling first.</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {statCards.map((s) => (
          <div key={s.label} data-testid={s.testid} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-2">{s.label}</div>
            <div className="font-display text-4xl md:text-5xl tracking-tight text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            data-testid="lead-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && refresh()}
            placeholder="Search company, email, name…"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-black border border-white/10 focus:border-[#F43F5E] outline-none text-sm placeholder:text-white/30"
          />
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 left-4 text-white/40" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('')}
            data-testid="lead-filter-all"
            className={`adam-mono text-[10px] uppercase tracking-[0.24em] px-3 py-1.5 rounded-full border transition-colors ${statusFilter === '' ? 'border-[#F43F5E] text-white bg-[#F43F5E]/15' : 'border-white/10 text-white/50 hover:text-white/85'}`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              data-testid={`lead-filter-${s.toLowerCase()}`}
              className={`adam-mono text-[10px] uppercase tracking-[0.24em] px-3 py-1.5 rounded-full border transition-colors ${statusFilter === s ? 'border-[#F43F5E] text-white bg-[#F43F5E]/15' : 'border-white/10 text-white/50 hover:text-white/85'}`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="adam-mono text-[11px] uppercase tracking-[0.3em] text-white/50">Leads · {leads.length}</div>
          {loading && <div className="text-xs text-white/40">Refreshing…</div>}
        </div>
        <ul className="divide-y divide-white/[0.06]">
          {leads.map((l) => {
            const p = l.profile || {};
            const lastAssistant = [...(l.transcript || [])].reverse().find((t) => t.role === 'assistant');
            const preview = (lastAssistant?.text || '').slice(0, 140);
            return (
              <li
                key={l.lead_id}
                data-testid={`lead-row-${l.lead_id}`}
                className="p-5 md:p-6 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                onClick={() => setDetail(l)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center shrink-0">
                    <span className="text-sm text-white/70 font-medium">
                      {(p.company || p.name || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <StatusBadge status={l.status} />
                      <ScorePill score={l.lead_score} />
                      <span className="adam-mono text-[10px] text-white/30">
                        {new Date(l.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="font-display text-lg md:text-xl tracking-tight text-white truncate">
                      {p.company || p.name || 'Unknown lead'}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-white/50">
                      {p.name && <span>{p.name}</span>}
                      {p.email && <span className="text-white/70">{p.email}</span>}
                      {p.goal && <span>· {p.goal}</span>}
                    </div>
                    {preview && (
                      <div className="mt-3 text-sm text-white/60 leading-snug line-clamp-2">
                        <span className="text-[#F43F5E]/70 adam-mono text-[10px] uppercase tracking-widest mr-2">ADAM</span>
                        {preview}{preview.length >= 140 ? '…' : ''}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {l.status !== 'CONVERTED' && (
                      <button
                        onClick={() => markConverted(l)}
                        disabled={markingId === l.lead_id}
                        data-testid={`lead-mark-converted-${l.lead_id}`}
                        className="adam-mono text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border border-emerald-400/40 text-emerald-200 hover:bg-emerald-400/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1.5"
                      >
                        {markingId === l.lead_id ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                        Convert
                      </button>
                    )}
                    <button
                      onClick={() => setDetail(l)}
                      className="adam-mono text-[10px] uppercase tracking-[0.22em] text-white/50 hover:text-white flex items-center gap-1"
                    >
                      View <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {!loading && leads.length === 0 && (
            <li className="p-12 text-center text-white/50">
              <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-[#F43F5E] mb-2">Empty inbox</div>
              <div>No leads match this filter yet.</div>
            </li>
          )}
        </ul>
      </div>

      <AnimatePresence>
        {detail && <LeadDetail lead={detail} onClose={() => setDetail(null)} onMutate={onDetailMutate} />}
      </AnimatePresence>
    </div>
  );
}
