import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Loader2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * EnquirySection — a compact, on-brand enquiry form that matches Contact.jsx styling.
 *
 * config props:
 *   kicker, headline (JSX or string), description, cta, microcopy, source
 *   fields: array of field configs
 *     { name, label, type: 'text'|'email'|'url'|'tel'|'textarea'|'select'|'multiselect'|'date', options?, required?, col?: 1|2 }
 */
export default function EnquirySection({
  id = 'enquiry',
  kicker = 'Enquiry',
  headline,
  description,
  cta = 'Send Enquiry',
  microcopy = 'Typically responds within one business day. Your details stay private.',
  source,
  fields,
  variant = 'section', // 'section' | 'compact'
}) {
  const [form, setForm] = useState(() =>
    fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === 'multiselect' ? [] : '' }), {})
  );
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const toggleMulti = (name, v) =>
    setForm((f) => ({
      ...f,
      [name]: f[name].includes(v) ? f[name].filter((x) => x !== v) : [...f[name], v],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    // Basic validation
    for (const f of fields) {
      if (f.required && (!form[f.name] || (Array.isArray(form[f.name]) && !form[f.name].length))) {
        setError(`${f.label} is required.`);
        return;
      }
    }
    setState('submitting');
    try {
      // Map form → API payload
      const payload = { source, ...form };
      // Backend expects `services` array + `message` string minimum
      if (!payload.message) payload.message = form.challenge || form.project_type || 'Enquiry from ' + (source || 'website');
      if (form.services && !Array.isArray(form.services)) payload.services = [form.services];
      await axios.post(`${API}/contact`, payload);
      setState('success');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Something went wrong. Please try again.');
      setState('idle');
    }
  };

  const wrapperPad = variant === 'compact' ? 'py-16 md:py-20' : 'py-24 md:py-32 lg:py-40';

  return (
    <section id={id} className={`relative ${wrapperPad} overflow-hidden`}>
      <div className="orb bg-[#E11D2E] w-[500px] h-[500px] -bottom-60 -left-40 opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`grid ${variant === 'compact' ? 'lg:grid-cols-12 gap-10' : 'lg:grid-cols-12 gap-12 lg:gap-20'}`}>
          {/* Left */}
          <div className="lg:col-span-5">
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#F43F5E] mb-6">{kicker}</div>
            <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[0.95] tracking-tighter">
              {headline}
            </h2>
            {description && (
              <p className="mt-6 text-[17px] md:text-[19px] text-[#A0A0A0] leading-relaxed max-w-md">
                {description}
              </p>
            )}
          </div>

          {/* Right — form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm overflow-hidden">
              <AnimatePresence mode="wait">
                {state === 'success' ? (
                  <motion.div
                    key="ok" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="py-20 px-10 text-center"
                  >
                    <div className="mx-auto w-14 h-14 rounded-full bg-[#E11D2E] flex items-center justify-center mb-5">
                      <Check size={24} />
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-3">Enquiry received.</h3>
                    <p className="text-[#A0A0A0] max-w-sm mx-auto">
                      Our lead strategist will be in touch within one business day.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="f" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-6 md:p-10 space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {fields.map((f) => (
                        <FieldRenderer
                          key={f.name}
                          f={f}
                          value={form[f.name]}
                          onChange={(v) => set(f.name, v)}
                          onToggle={(v) => toggleMulti(f.name, v)}
                        />
                      ))}
                    </div>
                    {error && <div className="text-sm text-red-400 font-mono">{error}</div>}
                    <button
                      type="submit"
                      data-testid={`enquiry-submit-${source || 'default'}`}
                      disabled={state === 'submitting'}
                      className="group mt-2 w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-[#E11D2E] hover:bg-[#F43F5E] text-white text-sm md:text-base font-semibold uppercase tracking-[0.15em] transition-colors duration-300 disabled:opacity-60"
                    >
                      {state === 'submitting' ? (
                        <><Loader2 size={18} className="animate-spin" />Sending…</>
                      ) : (
                        <>{cta}<Send size={16} className="group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                    <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0] text-center">
                      {microcopy}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldRenderer({ f, value, onChange, onToggle }) {
  const base = 'w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-2xl focus:border-white outline-none px-4 py-3 text-white placeholder:text-white/30 transition-colors';
  const wrapper = f.col === 2 ? 'md:col-span-2' : '';

  if (f.type === 'textarea') {
    return (
      <div className={wrapper}>
        <label className="block text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-2">
          {f.label}{f.required && ' *'}
        </label>
        <textarea rows={f.rows || 4} value={value} onChange={(e) => onChange(e.target.value)} required={f.required}
          placeholder={f.placeholder || ''} className={`${base} resize-none`} />
      </div>
    );
  }
  if (f.type === 'select') {
    return (
      <div className={wrapper}>
        <label className="block text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-3">
          {f.label}{f.required && ' *'}
        </label>
        <div className="flex flex-wrap gap-2">
          {f.options.map((o) => {
            const active = value === o;
            return (
              <button key={o} type="button" onClick={() => onChange(o)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm border transition-colors ${
                  active ? 'bg-white text-black border-white' : 'border-[rgba(255,255,255,0.12)] text-white/80 hover:border-white'
                }`}>
                {o}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if (f.type === 'multiselect') {
    return (
      <div className={wrapper}>
        <label className="block text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-3">
          {f.label}{f.required && ' *'}
        </label>
        <div className="flex flex-wrap gap-2">
          {f.options.map((o) => {
            const active = (value || []).includes(o);
            return (
              <button key={o} type="button" onClick={() => onToggle(o)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm border transition-colors ${
                  active ? 'bg-[#E11D2E]/15 text-white border-[#F43F5E]' : 'border-[rgba(255,255,255,0.12)] text-white/80 hover:border-white'
                }`}>
                {o}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  // text / email / url / tel / date / file
  return (
    <div className={wrapper}>
      <label className="block text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-2">
        {f.label}{f.required && ' *'}
      </label>
      <input
        type={f.type || 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={f.required}
        placeholder={f.placeholder || ''}
        className={base}
      />
    </div>
  );
}
