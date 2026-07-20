import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowLeft, ArrowUpRight, Linkedin, Eye, MessageCircle, Repeat,
  ThumbsUp, Users, Building2, Compass, LineChart, ShieldCheck,
  Quote, Sparkles, PenTool, Layers, MapPin,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { CaseStudiesEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';
import MagneticButton from '@/components/MagneticButton';

/* --------------------------------------------------------------- */

const PLANT_HERO = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1800&q=80';
const PLANT_2 = 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1600&q=80';
const PLANT_3 = 'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80';
const ENGINEER = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80';
const OFFICE = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80';
const HANDSHAKE = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80';
const FOUNDER = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=1200&q=80';

const Kicker = ({ children }) => (
  <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] flex items-center gap-3">
    <span className="w-8 h-px bg-[#A0A0A0]" />
    {children}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ----------------- Count-up ----------------- */

function CountUp({ to, suffix = '', prefix = '', separator = false, decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1800;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(eased * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  const display = decimals > 0
    ? val.toFixed(decimals)
    : separator ? Math.floor(val).toLocaleString() : Math.floor(val).toString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

/* ----------------- 01 — Hero ----------------- */

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden pt-24">
      <motion.div style={{ y: yImg }} className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${PLANT_HERO})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/75 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_25%,_#000_85%)]" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 min-h-[88vh] flex flex-col justify-end">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex items-center gap-3 mb-10 flex-wrap">
          <Link to="/case-studies" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Case Studies
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#F43F5E] font-mono">CASE STUDY · 02 / B2B Engineering</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[108px] leading-[0.95] tracking-tighter max-w-6xl"
        >
          B2B doesn&apos;t happen<br />
          in a <span className="italic font-light text-white/40">demo call.</span><br />
          It happens on{' '}
          <span className="text-[#F43F5E]">LinkedIn.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-end"
        >
          <p className="lg:col-span-7 text-[17px] md:text-[19px] leading-relaxed text-[#D4D4D4] max-w-xl">
            Prochem builds turnkey chemical &amp; process plants. Their buyer is a
            plant head, a project engineer, a procurement lead. That buyer does
            not read cold emails. They read LinkedIn feeds, and they remember
            who was there long before the tender opens.
          </p>
          <div className="lg:col-span-5 lg:text-right flex flex-col lg:items-end gap-4">
            <MagneticButton
              data-testid="prochem-hero-cta"
              onClick={() => { const el = document.getElementById('reality'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-black hover:bg-[#F43F5E] hover:text-white text-sm font-semibold transition-colors"
            >
              View the journey
              <ArrowUpRight size={16} />
            </MagneticButton>
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] flex items-center gap-2">
              <MapPin size={12} /> Pune, India
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Client meta strip */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pt-10 border-t border-[rgba(255,255,255,0.08)]">
          {[
            { l: 'Client', v: 'Prochem Turnkey Projects' },
            { l: 'Industry', v: 'B2B · Process Engineering' },
            { l: 'Channel', v: 'LinkedIn · Founder-led' },
            { l: 'Engagement', v: '12 months' },
          ].map((m) => (
            <div key={m.l}>
              <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-2">{m.l}</div>
              <div className="font-display text-lg md:text-xl tracking-tight">{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------- 02 — Reality ----------------- */

function Reality() {
  return (
    <section id="reality" className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${PLANT_2})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="hidden md:block absolute -bottom-12 -right-8 w-1/2 aspect-[4/5] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ENGINEER})` }} />
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} custom={1} className="lg:col-span-6">
            <Kicker>The reality</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[56px] lg:text-[68px] leading-[1.02] tracking-tighter">
              Enterprise buyers don&apos;t<br />
              <span className="text-white/40">respond to campaigns.</span>
            </h2>
            <div className="mt-10 space-y-5 text-[17px] md:text-[19px] leading-[1.7] text-[#D4D4D4] max-w-xl">
              <p>A turnkey plant contract can take 9-18 months to close.</p>
              <ul className="space-y-2 text-[#A0A0A0]">
                {[
                  'The buyer researches quietly, months before the RFQ.',
                  'They shortlist based on who they already trust.',
                  'They cross-check LinkedIn presence before a first call.',
                  'They ask peers, not agencies, who to speak to.',
                ].map((t) => (
                  <li key={t} className="flex items-baseline gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] mt-2 shrink-0" />{t}
                  </li>
                ))}
              </ul>
              <p>
                Prochem had the engineering credibility. What they needed was
                for that credibility to be visible where the buyer was already
                looking.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------- 03 — Thesis + Cards ----------------- */

const pillars = [
  { n: '01', t: 'Founder Voice',       Icon: Users,     d: 'Positioned the founder as the technical authority the industry already knew, on the surface it lives on.' },
  { n: '02', t: 'Engineering Narrative', Icon: PenTool, d: 'Turned complex process engineering into stories buyers wanted to save, share and quote back.' },
  { n: '03', t: 'Signal, Not Reach',   Icon: LineChart, d: 'Optimised for the right 3,000 engineers seeing the feed, not the wrong 300,000.' },
  { n: '04', t: 'Repeatable Cadence',  Icon: Layers,    d: 'A weekly editorial rhythm the team could sustain long after we left the room.' },
  { n: '05', t: 'Category Authority',  Icon: ShieldCheck, d: 'Made Prochem the name plant heads mentioned in unrelated conversations.' },
];

function Thesis() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-7">
            <Kicker>Our thesis</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[72px] leading-[1.02] tracking-tighter">
              We didn&apos;t build<br />
              a brand.<br />
              <span className="text-[#F43F5E]">We built a signal.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md">
            In B2B, the buyer doesn&apos;t need to be sold to. They need to be
            reminded, quietly and repeatedly, that you are the obvious answer
            when the project brief lands on their desk.
            <span className="block mt-4 text-white italic">
              &ldquo;Who do we already know can build this?&rdquo;
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {pillars.map((c, i) => (
            <motion.div
              key={c.n}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              custom={i}
              className="group relative bg-black hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-500 p-8 md:p-10 min-h-[300px] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center group-hover:bg-[#E11D2E] group-hover:border-[#E11D2E] transition-colors duration-500">
                  <c.Icon size={20} />
                </div>
                <div className="text-xs font-mono text-[#A0A0A0]">{c.n}</div>
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-[28px] leading-tight tracking-tight">{c.t}</h3>
                <p className="mt-3 text-[14px] md:text-[15px] text-[#A0A0A0] leading-relaxed">{c.d}</p>
              </div>
            </motion.div>
          ))}
          <div className="relative bg-black p-8 md:p-10 min-h-[300px] flex flex-col justify-center text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
            <div className="relative font-display text-2xl md:text-[28px] leading-tight tracking-tight text-white/30">
              One <span className="text-[#F43F5E]">signal.</span><br />Not fifty campaigns.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------- 04 — LinkedIn KPIs ----------------- */

function KPIs() {
  const kpis = [
    { v: 128543, suffix: '', l: 'LinkedIn impressions · 12 months',   Icon: Eye,         separator: true },
    { v: 1892,   suffix: '', l: 'Reactions from the right operators', Icon: ThumbsUp,    separator: true },
    { v: 60,     suffix: '', l: 'Substantive comments · signal, not noise', Icon: MessageCircle },
    { v: 38,     suffix: '', l: 'Reposts by engineers &amp; project heads', Icon: Repeat },
  ];
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-7">
            <Kicker>12 months on LinkedIn</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[72px] leading-[1.02] tracking-tighter">
              Small numbers.<br />
              <span className="text-[#F43F5E]">The right people.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md">
            In B2B, a hundred plant engineers reading you is worth more than a
            hundred thousand strangers. These numbers are small because the room
            is small, and the room is the entire point.
          </p>
        </div>

        {/* Feature: followers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9 }}
          className="mb-8 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-8 md:p-12 lg:p-16 relative overflow-hidden"
        >
          <div className="orb bg-[#E11D2E] w-[500px] h-[500px] -bottom-40 -right-40 opacity-25" />
          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-4 flex items-center gap-2">
                <Linkedin size={14} /> Followers
              </div>
              <div className="font-display leading-none tracking-tighter">
                <div className="text-white/30 text-[40px] md:text-[64px] line-through decoration-[3px] decoration-white/20">4k</div>
                <div className="text-[80px] md:text-[120px] lg:text-[140px] text-[#F43F5E]">
                  <CountUp to={13} suffix="k+" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 lg:pl-10 lg:border-l lg:border-[rgba(255,255,255,0.08)]">
              <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-3">The follower shift</div>
              <p className="font-display text-[24px] md:text-[32px] lg:text-[40px] leading-[1.15] tracking-tight">
                From a page that looked <span className="text-white/40">dormant</span> to a
                feed the entire process-engineering community in India{' '}
                <span className="text-[#F43F5E]">quietly follows.</span>
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm text-[#A0A0A0] flex-wrap">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
                  <span className="font-mono">+225% in 12 months</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>Organic. No paid boosts.</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid of 4 metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {kpis.map((k, i) => (
            <motion.div
              key={k.l}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              custom={i}
              className="bg-black p-8 md:p-10 min-h-[240px] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <k.Icon size={16} className="text-white/40" />
              </div>
              <div>
                <div className="font-display text-[44px] md:text-[56px] lg:text-[64px] leading-none tracking-tighter">
                  <CountUp to={k.v} suffix={k.suffix} separator={k.separator} />
                </div>
                <div className="mt-4 text-[13px] md:text-[14px] text-[#A0A0A0] leading-relaxed max-w-[220px]"
                     dangerouslySetInnerHTML={{ __html: k.l }} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] text-right">
          Source · LinkedIn Analytics · 19 Jul 2025 → 18 Jul 2026
        </div>
      </div>
    </section>
  );
}

/* ----------------- 05 — What we did / process ----------------- */

const workItems = [
  { t: 'Founder-first editorial', d: 'Turned the founder&apos;s decades of plant-floor experience into a weekly LinkedIn editorial, ghost-written with technical fidelity.' },
  { t: 'Case-teardown format',    d: 'Broke down real Prochem projects — cement, chemical, process — as short field notes engineers wanted to save.' },
  { t: 'Category commentary',     d: 'Timely takes on industry news (CAPEX cycles, plant safety, EPC norms) that only an operator could credibly write.' },
  { t: 'Employee amplification',  d: 'Made it easy for the internal engineering team to share, comment and add their own voice, without it feeling forced.' },
  { t: 'Buyer targeting',         d: 'Optimised connection requests and outreach for plant heads, procurement leads and consultants in specific SIC verticals.' },
  { t: 'Editorial rituals',       d: 'A repeatable weekly rhythm handed over to the internal team: topic bank, review calendar, publishing cadence.' },
];

function WhatWeDid() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="orb bg-[#7f1d1d] w-[600px] h-[600px] -top-40 -left-40 opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-6">
            <Kicker>What actually shipped</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[64px] lg:text-[80px] leading-[1.02] tracking-tighter">
              We didn&apos;t run<br />
              <span className="text-white/40">a campaign.</span><br />
              We built <span className="text-[#F43F5E]">an editorial.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 lg:col-start-8 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md self-end">
            Six workstreams, one operating rhythm. Every piece written and
            shipped as if it would be read by the sharpest plant engineer in
            the country, because it was.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {workItems.map((it, i) => (
            <motion.div
              key={it.t}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              custom={i}
              className="bg-black p-8 md:p-12 min-h-[220px] flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">
                  {String(i + 1).padStart(2, '0')} / 06
                </div>
                <div className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center group-hover:bg-[#F43F5E] group-hover:border-[#F43F5E] transition-colors">
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <div className="mt-8">
                <h3 className="font-display text-[28px] md:text-[36px] leading-tight tracking-tight">{it.t}</h3>
                <p className="mt-3 text-[15px] md:text-[16px] text-[#A0A0A0] leading-relaxed max-w-md"
                   dangerouslySetInnerHTML={{ __html: it.d }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------- 06 — Content examples (mock LinkedIn posts) ----------------- */

const feed = [
  { tag: 'Field notes', title: 'What we learned commissioning a 200 TPD plant in 43 days.', reactions: '312', comments: '18', img: PLANT_3 },
  { tag: 'Category take', title: 'The three things every plant head should ask before signing a turnkey EPC contract.', reactions: '241', comments: '9', img: ENGINEER },
  { tag: 'Behind the build', title: 'Why we replaced the standard heat exchanger spec on this project, and what it saved.', reactions: '188', comments: '14', img: PLANT_2 },
  { tag: 'Founder essay', title: 'Twenty-seven years on the plant floor, and one thing has changed everything.', reactions: '507', comments: '32', img: OFFICE },
  { tag: 'Client note', title: 'A note from the plant head who signed our second contract, in his own words.', reactions: '221', comments: '11', img: HANDSHAKE },
];

function ContentShowcase() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-6">
            <Kicker>The editorial</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[72px] leading-[1.02] tracking-tighter">
              Not posts.<br />
              <span className="text-white/40">Field notes.</span>
            </h2>
            <div className="mt-4 text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">
              A sample of the weekly editorial cadence.
            </div>
          </div>
          <p className="lg:col-span-5 lg:col-start-8 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md">
            Every piece written like the founder was walking a plant head
            through a project, quietly, honestly, with details only an operator
            would know.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-5 md:gap-8 overflow-x-auto pl-4 sm:pl-6 lg:pl-[max(1rem,calc((100vw-80rem)/2+2rem))] pr-6 lg:pr-8 pb-6 snap-x snap-mandatory scrollbar-none">
          {feed.map((p, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.06 }}
              className="shrink-0 w-[80vw] sm:w-[420px] md:w-[460px] snap-start rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]"
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p.img})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] uppercase tracking-[0.2em] border border-white/10">
                  {p.tag}
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#E11D2E]/20 border border-[#E11D2E]/30 flex items-center justify-center">
                    <Linkedin size={16} className="text-[#F43F5E]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Prochem Turnkey Projects</div>
                    <div className="text-[11px] text-[#A0A0A0]">Sponsored by the founder&apos;s pen.</div>
                  </div>
                </div>
                <h3 className="font-display text-[20px] md:text-[22px] leading-tight tracking-tight">{p.title}</h3>
                <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center gap-5 text-[12px] font-mono text-[#A0A0A0]">
                  <span className="inline-flex items-center gap-1.5"><ThumbsUp size={12} />{p.reactions}</span>
                  <span className="inline-flex items-center gap-1.5"><MessageCircle size={12} />{p.comments}</span>
                  <span className="inline-flex items-center gap-1.5 ml-auto"><Repeat size={12} /></span>
                </div>
              </div>
            </motion.article>
          ))}
          <div className="shrink-0 w-4 md:w-12" />
        </div>
      </div>
    </section>
  );
}

/* ----------------- 07 — Buyer journey ----------------- */

const journey = [
  { Icon: Eye,          t: 'Sees a Prochem field note',        d: 'On the LinkedIn feed of a plant head they respect.' },
  { Icon: Sparkles,     t: 'Follows the page quietly',         d: 'To keep reading. No form. No CTA. Just interest.' },
  { Icon: Compass,      t: 'Reads for three months',           d: 'Category takes, project teardowns, founder essays.' },
  { Icon: Building2,    t: 'A tender lands on their desk',     d: 'And Prochem is the first name that comes to mind.' },
  { Icon: MessageCircle, t: 'Reaches out on LinkedIn first',   d: 'Warm inbound, not a cold call. Different conversation entirely.' },
  { Icon: ShieldCheck,  t: 'The contract closes',              d: 'Nine months of trust, before the first proposal.' },
];

function BuyerJourney() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Kicker>The buyer arc</Kicker>
        <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[80px] leading-[1.02] tracking-tighter">
          From feed<br />
          <span className="text-[#F43F5E]">to contract.</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-px">
        {journey.map((j, i) => (
          <motion.div
            key={j.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
            className="group grid grid-cols-12 gap-4 md:gap-10 py-8 md:py-10 border-b border-[rgba(255,255,255,0.08)] last:border-b-0 items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors px-2 md:px-0"
          >
            <div className="col-span-2 md:col-span-1">
              <div className="font-display text-[40px] md:text-[64px] leading-none text-white/15 group-hover:text-[#F43F5E] transition-colors">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                <j.Icon size={18} />
              </div>
            </div>
            <h3 className="col-span-8 md:col-span-5 font-display text-[20px] md:text-[28px] lg:text-[34px] leading-tight tracking-tight">
              {j.t}
            </h3>
            <p className="col-span-12 md:col-span-5 text-[14px] md:text-[16px] text-[#A0A0A0] leading-relaxed">
              {j.d}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ----------------- 08 — Founder spotlight ----------------- */

function FounderSpotlight() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="orb bg-[#E11D2E] w-[700px] h-[700px] top-1/2 -translate-y-1/2 -right-40 opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${FOUNDER})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/70 mb-2">Founder &amp; MD</div>
                <div className="font-display text-2xl md:text-3xl tracking-tight">Prochem Leadership</div>
                <div className="text-sm text-white/70 mt-1">Prochem Turnkey Projects Pvt Ltd</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <Kicker>Founder spotlight</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[80px] leading-[1.02] tracking-tighter">
              Built on<br />
              <span className="text-[#F43F5E]">the plant floor.</span>
            </h2>
            <div className="mt-10 rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl p-8 md:p-12 relative">
              <Quote size={36} className="text-[#E11D2E] mb-6" />
              <blockquote className="font-display text-[22px] md:text-[30px] lg:text-[34px] leading-[1.25] tracking-tight">
                &ldquo;We spent two decades earning credibility on plant floors.
                Adcom took that credibility and made it visible to every buyer
                who mattered, without ever making it feel like marketing.
                That&apos;s the entire difference.&rdquo;
              </blockquote>
              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <div>
                  <div className="font-medium">Founder &amp; Managing Director</div>
                  <div className="text-sm text-[#A0A0A0]">Prochem Turnkey Projects Pvt Ltd</div>
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">Pune, India</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------- 09 — Final outcome ----------------- */

function FinalOutcome() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Kicker>The final outcome</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-display text-[44px] md:text-[72px] lg:text-[104px] leading-[0.95] tracking-tighter max-w-6xl"
        >
          Reach was not the point.<br />
          <span className="text-white/40">Recall was.</span><br />
          <span className="text-[#F43F5E]">Contracts followed.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-12 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#D4D4D4]"
        >
          A B2B follower base that tripled in twelve months. Impressions in
          six figures inside a specialist industry that measures in
          thousands. And a company that plant heads now think of first,
          long before they open a tender.
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------- Final CTA ----------------- */

function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden border-t border-[rgba(255,255,255,0.08)]">
      <div className="orb bg-[#E11D2E] w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-25" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="font-display text-[44px] md:text-[80px] lg:text-[112px] leading-[0.95] tracking-tighter max-w-6xl"
        >
          Let&apos;s build something<br />
          <span className="text-[#F43F5E]">that grows.</span>
        </motion.h2>
        <p className="mt-10 max-w-xl text-[18px] md:text-[20px] text-[#D4D4D4] leading-relaxed">
          Growth isn&apos;t built through channels. It&apos;s built through systems.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-5 sm:items-center">
          <MagneticButton
            data-testid="prochem-final-cta"
            onClick={() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#E11D2E] hover:bg-[#F43F5E] text-white text-sm font-semibold transition-colors"
          >
            Start a conversation
            <ArrowUpRight size={16} />
          </MagneticButton>
          <Link
            to="/case-studies"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
          >
            <span className="border-b border-[rgba(255,255,255,0.2)] group-hover:border-white pb-1 transition-colors">
              View more case studies
            </span>
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------- Page ----------------- */

export default function CaseStudyProchem() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <Reality />
        <Thesis />
        <KPIs />
        <WhatWeDid />
        <ContentShowcase />
        <BuyerJourney />
        <FounderSpotlight />
        <FinalOutcome />
        <FinalCTA />
        <CaseStudiesEnquiry />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
