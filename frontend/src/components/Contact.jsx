import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Loader2, Phone, Mail } from 'lucide-react';
import { CONTACT } from '@/constants/testIds';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const capabilities = [
  'Growth Marketing',
  'Performance Marketing',
  'Enterprise SEO / AI SEO',
  'Brand Strategy & Creative',
  'Content Production',
  'Marketing Automation',
];

const investments = [
  '₹2,50,000 – ₹5,00,000 / mo',
  '₹5,00,000 – ₹10,00,000 / mo',
  '₹10,00,000 – ₹25,00,000 / mo',
  '₹25,00,000+ / mo',
];

export default function Contact({
  variant = 'section', // 'section' (used inside landing) | 'page' (standalone)
  kicker = 'Secure an engagement',
  headline = "Let's build\nsomething that\ngrows.",
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    budget: '',
    services: [],
    message: '',
  });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleService = (s) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(s)
        ? f.services.filter((x) => x !== s)
        : [...f.services, s],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('Name, email and a brief about your business are required.');
      return;
    }
    setState('submitting');
    try {
      await axios.post(`${API}/contact`, form);
      setState('success');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Something went wrong. Please try again.');
      setState('idle');
    }
  };

  return (
    <section
      id="contact"
      className={`relative ${variant === 'section' ? 'py-24 md:py-32 lg:py-40' : 'pt-32 md:pt-40 pb-24 md:pb-32'} overflow-hidden`}
    >
      <div className="orb bg-[#E11D2E] w-[600px] h-[600px] -bottom-60 -left-40 opacity-25" />
      <div className="orb bg-[#7f1d1d] w-[500px] h-[500px] -top-40 -right-40 opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left column, headline + meta */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#F43F5E] mb-6">
              {kicker}
            </div>
            <h2 className="font-display text-[44px] md:text-[64px] lg:text-[80px] leading-[0.95] tracking-tighter whitespace-pre-line">
              {headline}
            </h2>
            <p className="mt-8 text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed max-w-md">
              We operate with a small number of select engagements at a time.
              Share the basics, our growth lead will respond within one business
              day with a tailored proposal.
            </p>

            <div className="mt-16 grid grid-cols-1 gap-8 max-w-md">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-2">
                  Direct line / WhatsApp
                </div>
                <a
                  href="https://wa.me/918308606641?text=Hi%20Adcom%20Media%20%E2%80%94%20I%27d%20like%20to%20talk%20about%20a%20growth%20engagement."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-[#25D366] transition-colors"
                >
                  <Phone size={16} />
                  <span className="text-[18px]">+91 83086 06641</span>
                </a>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-2">
                  Engagement inbox
                </div>
                <a href="mailto:hello.adcommedia@gmail.com" className="flex items-center gap-3 text-white hover:text-[#F43F5E] transition-colors">
                  <Mail size={16} />
                  <span className="text-[18px]">hello.adcommedia@gmail.com</span>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[rgba(255,255,255,0.08)]">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-2">Studio</div>
                  <div className="text-[15px]">Pune · Bangalore</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-2">Intake</div>
                  <div className="text-[15px]">Open, Q1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column, multi-section form card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm overflow-hidden">
              <AnimatePresence mode="wait">
                {state === 'success' ? (
                  <motion.div
                    key="success"
                    data-testid={CONTACT.successMessage}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="py-24 px-10 text-center"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-[#E11D2E] flex items-center justify-center mb-6">
                      <Check size={28} />
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl tracking-tight mb-3">
                      Brief received.
                    </h3>
                    <p className="text-[#A0A0A0] max-w-sm mx-auto">
                      A lead strategist will be in touch within one business day.
                      In the meantime, we&apos;re already reading.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    data-testid={CONTACT.form}
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="divide-y divide-[rgba(255,255,255,0.08)]"
                  >
                    {/* 01 // Capability */}
                    <FormSection number="01" label="Capability required">
                      <div className="grid sm:grid-cols-2 gap-3">
                        {capabilities.map((c) => {
                          const active = form.services.includes(c);
                          return (
                            <button
                              key={c}
                              type="button"
                              data-testid={`capability-${c.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                              onClick={() => toggleService(c)}
                              className={`relative text-left px-5 py-4 rounded-2xl border transition-all duration-300 ${
                                active
                                  ? 'border-[#F43F5E] bg-[#E11D2E]/10 text-white'
                                  : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] text-white/80 hover:border-white/30'
                              }`}
                            >
                              <span className="text-[14px] md:text-[15px] font-medium">{c}</span>
                              <span
                                className={`absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border ${
                                  active
                                    ? 'border-[#F43F5E] bg-[#F43F5E]'
                                    : 'border-white/30'
                                } transition-all`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </FormSection>

                    {/* 02 // Investment */}
                    <FormSection number="02" label="Allocated investment / month">
                      <div className="grid grid-cols-1 gap-3">
                        {investments.map((b) => {
                          const active = form.budget === b;
                          return (
                            <button
                              key={b}
                              type="button"
                              data-testid={`budget-${b}`}
                              onClick={() => setForm((f) => ({ ...f, budget: b }))}
                              className={`relative text-left px-5 py-4 rounded-2xl border transition-all duration-300 ${
                                active
                                  ? 'border-[#F43F5E] bg-[#E11D2E]/10 text-white'
                                  : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] text-white/80 hover:border-white/30'
                              }`}
                            >
                              <span className="text-[14px] md:text-[15px] font-medium">{b}</span>
                              <span
                                className={`absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border ${
                                  active
                                    ? 'border-[#F43F5E] bg-[#F43F5E]'
                                    : 'border-white/30'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </FormSection>

                    {/* 03 // Details */}
                    <FormSection number="03" label="Enterprise details">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field
                          label="Your name *"
                          testid={CONTACT.nameInput}
                          value={form.name}
                          onChange={update('name')}
                          required
                        />
                        <Field
                          label="Secure email *"
                          testid={CONTACT.emailInput}
                          type="email"
                          value={form.email}
                          onChange={update('email')}
                          required
                        />
                        <Field
                          label="Company name"
                          testid={CONTACT.companyInput}
                          value={form.company}
                          onChange={update('company')}
                        />
                        <Field
                          label="Current website"
                          testid="contact-website-input"
                          value={form.website}
                          onChange={update('website')}
                          placeholder="https://"
                        />
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-2">
                            Strategic objectives &amp; roadmap *
                          </label>
                          <textarea
                            data-testid={CONTACT.messageInput}
                            value={form.message}
                            onChange={update('message')}
                            rows={5}
                            required
                            placeholder="Goals, current bottlenecks, timeline and what success looks like in 12 months."
                            className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-2xl focus:border-white outline-none px-4 py-3 text-white placeholder:text-white/30 resize-none transition-colors"
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="mt-4 text-sm text-red-400 font-mono">{error}</div>
                      )}

                      <button
                        type="submit"
                        data-testid={CONTACT.submitButton}
                        disabled={state === 'submitting'}
                        className="group mt-8 w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-[#E11D2E] hover:bg-[#F43F5E] text-white text-sm md:text-base font-semibold uppercase tracking-[0.15em] transition-colors duration-300 disabled:opacity-60"
                      >
                        {state === 'submitting' ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Transmitting…
                          </>
                        ) : (
                          <>
                            Transmit Engagement Brief
                            <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0] text-center">
                        Reviewed by a lead strategist · Response in 24h
                      </p>
                    </FormSection>
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

function FormSection({ number, label, children }) {
  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[11px] font-mono text-[#F43F5E]">{number} //</span>
        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, testid, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-2">{label}</label>
      <input
        data-testid={testid}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-2xl focus:border-white outline-none px-4 py-3 text-white placeholder:text-white/30 transition-colors"
      />
    </div>
  );
}
