import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { AboutEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';
import MagneticButton from '@/components/MagneticButton';

const team = [
  { name: 'Amit Shukla', role: 'Founding Partner · Growth', img: 'https://i.pravatar.cc/300?img=12' },
  { name: 'Ishita Rao', role: 'Founding Partner · Brand', img: 'https://i.pravatar.cc/300?img=47' },
  { name: 'Vihaan Mehta', role: 'Head of Performance', img: 'https://i.pravatar.cc/300?img=11' },
  { name: 'Kabir Patel', role: 'Creative Director', img: 'https://i.pravatar.cc/300?img=15' },
  { name: 'Mira Joseph', role: 'Strategy Director', img: 'https://i.pravatar.cc/300?img=32' },
  { name: 'Rohan Nair', role: 'Head of AI SEO', img: 'https://i.pravatar.cc/300?img=33' },
];

const values = [
  { t: 'Expert-led, by design.', d: 'No pods. No trainees on your account. The hands that sold the work do the work.' },
  { t: 'Owned, not outsourced.', d: 'Strategy, creative, media, lifecycle, built under one roof, accountable to one P&L.' },
  { t: 'Taste over volume.', d: 'We ship less, and we ship better. We would rather miss a brief than break a brand.' },
  { t: 'Numbers, ruthlessly.', d: 'We measure ourselves by your revenue, not by impressions, awards or invoice hours.' },
];

export default function AboutPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />

      <main>
        {/* HERO */}
        <section ref={ref} className="relative min-h-[90vh] w-full flex flex-col justify-center overflow-hidden pt-24">
          <motion.div style={{ y: y1 }} className="orb bg-[#E11D2E] w-[500px] h-[500px] -top-40 -left-40 opacity-40" />
          <div className="orb bg-[#7f1d1d] w-[600px] h-[600px] bottom-0 right-0 opacity-30" />

          <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-32">
            <div className="flex items-center gap-3 mb-8">
              <Link to="/" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Adcom Media
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">About · Studio</span>
            </div>

            <h1 className="font-display text-[56px] sm:text-[80px] md:text-[100px] lg:text-[120px] leading-[0.9] tracking-tighter">
              <span className="block">A small studio</span>
              <span className="block italic font-light text-white/40">building the most</span>
              <span className="block text-[#F43F5E]">ambitious brands online.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]">
              Adcom Media is an independent, performance-driven growth studio of strategists,
              marketers, designers and engineers. We partner with category-defining
              founders across India, the Middle East and the US, and we measure
              ourselves by the revenue we move.
            </p>
          </motion.div>
        </section>

        {/* MANIFESTO */}
        <section className="relative py-24 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-3">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] flex items-center gap-3">
                  <span className="w-8 h-px bg-[#A0A0A0]" /> Manifesto
                </div>
              </div>
              <div className="lg:col-span-9">
                <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9 }} className="font-display text-[40px] md:text-[64px] lg:text-[80px] leading-[0.98] tracking-tighter">
                  We started Adcom because<br />
                  <span className="text-white/40">the work had gotten worse,</span><br />
                  the layers had gotten <span className="text-[#F43F5E]">thicker</span>,<br />
                  and expert hands had gotten <span className="text-[#F43F5E]">rare.</span>
                </motion.h2>
                <p className="mt-12 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]">
                  Most modern agencies are organised to scale headcount. We are organised
                  to scale outcomes. That means fewer clients, fewer meetings, fewer
                  decks, fewer middlemen, and far more time inside the actual craft.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="relative py-24 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 grid lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-5">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#A0A0A0]" /> Operating principles
                </div>
                <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight">
                  Four rules<br />
                  <span className="text-white/40">we don&apos;t break.</span>
                </h2>
              </div>
              <p className="lg:col-span-6 lg:col-start-7 text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed">
                These are not aspirations. They are the constraints we hire, brief and bill against.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
              {values.map((v, i) => (
                <motion.div key={v.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: i * 0.08 }} className="bg-black p-8 md:p-12 min-h-[260px] flex flex-col justify-between">
                  <div className="font-display text-[40px] md:text-[56px] text-white/15 leading-none">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 className="font-display text-2xl md:text-[32px] tracking-tight">{v.t}</h3>
                    <p className="mt-3 text-[15px] md:text-[16px] text-[#A0A0A0] leading-relaxed max-w-md">{v.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="relative py-24 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-[#A0A0A0]" /> The studio
              </div>
              <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight">
                Expert operators.<br /><span className="text-white/40">Doing the work, on the work.</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
              {team.map((m) => (
                <div key={m.name} className="bg-black p-6 md:p-8 group">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 mb-5">
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
                  </div>
                  <div className="font-display text-xl md:text-2xl tracking-tight">{m.name}</div>
                  <div className="text-sm text-[#A0A0A0] mt-1">{m.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="relative py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-y border-[rgba(255,255,255,0.08)] py-12 md:py-16 grid lg:grid-cols-12 gap-8 items-end">
              <p className="lg:col-span-9 font-display text-[28px] md:text-[36px] lg:text-[44px] leading-[1.1] tracking-tight">
                Quietly building the most ambitious brands online,{' '}
                <span className="text-[#F43F5E]">one engagement at a time.</span>
              </p>
              <div className="lg:col-span-3 lg:text-right">
                <MagneticButton
                  onClick={() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[#F43F5E] transition-colors"
                >
                  <span className="border-b border-white/40 group-hover:border-[#F43F5E] pb-1 transition-colors">
                    Start a conversation
                  </span>
                  <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>

        <AboutEnquiry />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
