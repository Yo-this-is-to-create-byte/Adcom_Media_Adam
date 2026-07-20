import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { CareersEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';

const roles = [
  { title: 'Lead Growth Strategist', team: 'Growth', location: 'Pune / Bangalore', type: 'Full-time' },
  { title: 'Performance Marketing Lead', team: 'Performance', location: 'Pune', type: 'Full-time' },
  { title: 'Brand Designer (Lead)', team: 'Brand', location: 'Bangalore', type: 'Full-time' },
  { title: 'AI SEO Editor', team: 'AI SEO', location: 'Bangalore', type: 'Full-time' },
  { title: 'Creative Producer', team: 'Content', location: 'Pune', type: 'Full-time' },
  { title: 'Marketing Engineer', team: 'Automation', location: 'Bangalore', type: 'Full-time' },
];

const principles = [
  { t: 'Expert by default.', d: 'Every role demands real ownership. We do not staff client accounts with trainees.' },
  { t: 'Ownership, not headcount.', d: 'You will own outcomes end-to-end, not a sliver of someone else\'s scope.' },
  { t: 'Craft over churn.', d: 'We ship less, and we ship better. Long arcs, real depth, no agency-life burnout theatre.' },
];

export default function Careers() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        <section className="relative min-h-[80vh] w-full flex flex-col justify-center overflow-hidden pt-24">
          <div className="orb bg-[#E11D2E] w-[500px] h-[500px] -top-40 -right-40 opacity-30" />
          <div className="orb bg-[#7f1d1d] w-[600px] h-[600px] bottom-0 left-0 opacity-25" />

          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-32">
            <div className="flex items-center gap-3 mb-8">
              <Link to="/" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Adcom Media
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Careers</span>
            </div>
            <h1 className="font-display text-[56px] sm:text-[80px] md:text-[100px] lg:text-[120px] leading-[0.9] tracking-tighter">
              <span className="block">Expert hands.</span>
              <span className="block italic font-light text-white/40">Real work.</span>
              <span className="block text-[#F43F5E]">No layers.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]">
              We hire infrequently and we hire well. If you are tired of pods, decks,
              and meetings about meetings, and you want to do the best work of your
              career on category-defining brands, read on.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="relative py-24 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-[#A0A0A0]" /> Working here
              </div>
              <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight">
                Three things<br /><span className="text-white/40">we don&apos;t compromise on.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
              {principles.map((p, i) => (
                <motion.div key={p.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08 }} className="bg-black p-8 md:p-10 min-h-[240px] flex flex-col justify-between">
                  <div className="font-display text-[40px] md:text-[56px] text-white/15 leading-none">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 className="font-display text-2xl md:text-[28px] tracking-tight">{p.t}</h3>
                    <p className="mt-3 text-[15px] text-[#A0A0A0] leading-relaxed">{p.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section className="relative py-24 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight">
                Open roles.<br /><span className="text-white/40">All expert.</span>
              </h2>
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0]">
                {roles.length} positions · Updated weekly
              </div>
            </div>

            <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] overflow-hidden divide-y divide-[rgba(255,255,255,0.08)]">
              {roles.map((r, i) => (
                <motion.a
                  key={r.title}
                  href="mailto:hello.adcommedia@gmail.com?subject=Application"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="group flex items-center justify-between gap-6 p-6 md:p-8 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0] mb-2">
                      {r.team}
                    </div>
                    <div className="font-display text-2xl md:text-3xl lg:text-[40px] leading-tight tracking-tight group-hover:text-[#F43F5E] transition-colors">
                      {r.title}
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-8 text-sm text-[#A0A0A0]">
                    <span className="inline-flex items-center gap-2"><MapPin size={14} />{r.location}</span>
                    <span>{r.type}</span>
                  </div>
                  <ArrowUpRight size={24} className="text-white/40 group-hover:text-[#F43F5E] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </motion.a>
              ))}
            </div>

            <p className="mt-10 text-[15px] text-[#A0A0A0] max-w-2xl">
              Don&apos;t see your role?{' '}
              <a href="mailto:hello.adcommedia@gmail.com" className="text-white underline hover:text-[#F43F5E] transition-colors">
                Send us a note
              </a>{' '}
             , we hire opportunistically when we meet the right operator.
            </p>
          </div>
        </section>

        <CareersEnquiry />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
