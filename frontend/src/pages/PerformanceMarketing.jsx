import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowLeft,
  Target,
  Sparkles,
  Megaphone,
  Activity,
  LineChart,
  Layers,
  Quote,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { ServiceEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';
import MagneticButton from '@/components/MagneticButton';

/* ------------------------------------------------------------------ */
/*  Reusable bits                                                     */
/* ------------------------------------------------------------------ */

const Kicker = ({ children }) => (
  <div className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#A0A0A0] flex items-center gap-3">
    <span className="w-8 h-px bg-[#A0A0A0]" />
    {children}
  </div>
);

const charVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.45 + i * 0.025, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  }),
};

function CharReveal({ text, baseDelay = 0 }) {
  return (
    <span className="inline-block overflow-hidden align-baseline">
      <span className="inline-block">
        {text.split('').map((c, i) => (
          <motion.span
            key={i}
            custom={i + baseDelay}
            variants={charVariants}
            initial="hidden"
            animate="visible"
            className="inline-block whitespace-pre"
          >
            {c}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  01, Hero                                                         */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" ref={ref} className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-24">
      <motion.div style={{ y: y1 }} className="orb bg-[#E11D2E] w-[500px] h-[500px] -top-40 -left-40 animate-pulse-slow" />
      <motion.div style={{ y: y2 }} className="orb bg-[#F43F5E] w-[400px] h-[400px] top-1/3 -right-40 animate-pulse-slow" />
      <div className="orb bg-[#7f1d1d] w-[600px] h-[600px] bottom-0 left-1/3 opacity-30" />

      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
        }}
      />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="flex items-center gap-3 mb-8"
        >
          <Link
            to="/"
            data-testid="perf-back-home"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Adcom Media
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">
            Service · Performance
          </span>
        </motion.div>

        <h1 className="font-display text-[56px] sm:text-[80px] md:text-[100px] lg:text-[120px] leading-[0.9] tracking-tighter">
          <span className="block">
            <CharReveal text="Performance" baseDelay={0} />
          </span>
          <span className="block">
            <span className="italic font-light text-white/40 align-baseline">
              <CharReveal text="isn't bought." baseDelay={11} />
            </span>
          </span>
          <span className="block">
            <CharReveal text="It's " baseDelay={24} />
            <span className="text-[#F43F5E]">
              <CharReveal text="engineered." baseDelay={29} />
            </span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]"
        >
          We build performance marketing systems that turn attention into customers
          and campaigns into <span className="text-white">sustainable growth</span>,
          not paid spikes that disappear when the budget does.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row gap-6 sm:items-center"
        >
          <MagneticButton
            data-testid="perf-hero-primary-cta"
            onClick={() => go('contact')}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#E11D2E] hover:bg-[#F43F5E] text-white text-sm font-semibold transition-colors duration-300"
          >
            Start a Growth Conversation
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </MagneticButton>

          <button
            data-testid="perf-hero-secondary-cta"
            onClick={() => go('growth-stories')}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
          >
            <span className="border-b border-[rgba(255,255,255,0.2)] group-hover:border-white pb-1 transition-colors">
              View results
            </span>
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  02, The Reality                                                  */
/* ------------------------------------------------------------------ */

function Reality() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3">
            <Kicker>The reality</Kicker>
          </div>
          <div className="lg:col-span-9">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[40px] md:text-[64px] lg:text-[88px] leading-[0.98] tracking-tighter"
            >
              Most brands don't have<br />
              an <span className="text-white/40">ad problem.</span>
              <br />
              They have a{' '}
              <span className="text-[#F43F5E]">system problem.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]"
            >
              Throwing budget at campaigns rarely creates sustainable growth.
              The brands that compound are the ones with a system, clear positioning,
              creative built for the funnel, attribution that tells the truth, and a
              feedback loop that gets sharper every week.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  03, Philosophy / Pillars                                         */
/* ------------------------------------------------------------------ */

const pillars = [
  { slug: 'growth-strategy', title: 'Growth Strategy', desc: 'The thesis behind every rupee spent, channels, segments and unit economics that scale.', Icon: Target },
  { slug: 'creative-systems', title: 'Creative Systems', desc: 'Concept-led, modular ad systems that compound learning rather than burn out in a week.', Icon: Sparkles },
  { slug: 'paid-acquisition', title: 'Paid Acquisition', desc: 'Expert-led media buying across Meta, Google, YouTube and emerging surfaces, without the platform tribalism.', Icon: Megaphone },
  { slug: 'cro', title: 'Conversion Optimisation', desc: 'Landing experiences, funnels and lifecycle moments engineered to convert the traffic you already pay for.', Icon: Activity },
  { slug: 'analytics-attribution', title: 'Analytics & Attribution', desc: 'A measurement model your CFO trusts and your media buyer can act on, not vanity dashboards.', Icon: LineChart },
  { slug: 'scaling-frameworks', title: 'Scaling Frameworks', desc: 'Structured testing, budget allocation and incrementality protocols that turn signal into spend.', Icon: Layers },
];

function Philosophy() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <div className="mb-6"><Kicker>The Adcom approach</Kicker></div>
            <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight max-w-3xl">
              Six disciplines.<br />
              <span className="text-white/40">One growth engine.</span>
            </h2>
          </div>
          <p className="max-w-md text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed">
            Strategy, creative, media buying and optimisation don't sit in
            separate rooms here. They operate as one system, owned by expert
            operators, accountable to revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {pillars.map((p, i) => (
            <motion.div
              key={p.slug}
              data-testid={`perf-pillar-${p.slug}`}
              data-cursor="hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-black hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-500 p-8 md:p-10 min-h-[280px] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center group-hover:bg-[#E11D2E] group-hover:border-[#E11D2E] transition-colors duration-500">
                  <p.Icon size={20} className="text-white" />
                </div>
                <ArrowUpRight size={18} className="text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
              </div>
              <div>
                <div className="text-xs text-[#A0A0A0] mb-2 font-mono">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="font-display text-2xl md:text-[28px] leading-tight tracking-tight">{p.title}</h3>
                <p className="mt-3 text-[14px] md:text-[15px] text-[#A0A0A0] leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  04, Growth Stories                                               */
/* ------------------------------------------------------------------ */

const stories = [
  {
    slug: 'lumen',
    client: 'Lumen Skincare',
    industry: 'D2C Beauty',
    challenge: 'Paid Meta plateaued at ₹40L/mo with deteriorating ROAS. Creative was the bottleneck, not budget.',
    approach: 'Rebuilt the creative system around problem-led concepts, restructured CBOs for incrementality, and rewired the post-click experience.',
    outcome: 'Scaled spend 3.4x in 90 days without ROAS decay. Customer acquisition cost fell quarter-over-quarter for four straight quarters.',
    metrics: [
      { v: '+330%', l: 'Qualified leads' },
      { v: '4.2x', l: 'Blended ROAS' },
      { v: '−38%', l: 'Blended CAC' },
    ],
  },
  {
    slug: 'forge',
    client: 'Forge Athleisure',
    industry: 'D2C Apparel',
    challenge: 'Strong product, brittle funnel. Revenue swung 60% month-on-month and the team couldn\'t explain why.',
    approach: 'Built a measurement model the team trusts, segmented audiences by purchase intent, and shifted creative cadence from monthly to weekly.',
    outcome: 'Predictable, compounding revenue with a clear line from creative concept to contribution margin.',
    metrics: [
      { v: '+180%', l: 'Revenue growth' },
      { v: '3.1x', l: 'Repeat purchase' },
      { v: '14d', l: 'Time-to-decision' },
    ],
  },
  {
    slug: 'meridian',
    client: 'Meridian B2B',
    industry: 'Enterprise SaaS',
    challenge: 'Pipeline was generous on the top, hollow at the bottom. Sales was closing meetings, not deals.',
    approach: 'Re-architected paid + outbound around ICP intent signals, rebuilt LP narratives by buyer stage and rewired attribution to revenue.',
    outcome: 'Pipeline quality replaced pipeline quantity as the operating metric, and ACV climbed with it.',
    metrics: [
      { v: '+220%', l: 'SQL → Won' },
      { v: '2.6x', l: 'ACV growth' },
      { v: '−42%', l: 'Cost per SQL' },
    ],
  },
];

function GrowthStories() {
  return (
    <section id="growth-stories" className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-5">
            <div className="mb-6"><Kicker>Selected growth stories</Kicker></div>
            <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight">
              Stories first.<br />
              <span className="text-white/40">Numbers second.</span>
            </h2>
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed">
            A handful of recent engagements. Industries change, channels change,
            the operating model doesn't.
          </p>
        </div>

        <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {stories.map((s, i) => (
            <motion.article
              key={s.slug}
              data-testid={`perf-story-${s.slug}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="bg-black hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-500 p-8 md:p-12 lg:p-16"
            >
              <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                <div className="lg:col-span-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0] mb-3">
                    {String(i + 1).padStart(2, '0')} · {s.industry}
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight">
                    {s.client}
                  </h3>
                </div>

                <div className="lg:col-span-8 space-y-8">
                  <StoryBlock label="Challenge" body={s.challenge} />
                  <StoryBlock label="Approach" body={s.approach} />
                  <StoryBlock label="Outcome" body={s.outcome} />

                  <div className="pt-6 border-t border-[rgba(255,255,255,0.08)] grid grid-cols-3 gap-6">
                    {s.metrics.map((m) => (
                      <div key={m.l}>
                        <div className="font-display text-2xl md:text-3xl lg:text-4xl text-[#F43F5E] tracking-tight">
                          {m.v}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] mt-1">
                          {m.l}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryBlock({ label, body }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-3">
        <div className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">{label}</div>
      </div>
      <p className="col-span-12 md:col-span-9 text-[16px] md:text-[18px] leading-relaxed text-white/85">
        {body}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  05, Growth Framework                                             */
/* ------------------------------------------------------------------ */

const phases = [
  {
    n: '01',
    title: 'Diagnose',
    desc: 'Audit performance, customer journeys, messaging gaps and acquisition bottlenecks. The truth before the plan.',
    tag: 'Phase 01',
  },
  {
    n: '02',
    title: 'Define',
    desc: 'Build the acquisition strategy, targeting architecture, funnel structure and growth roadmap, defensible to your board.',
    tag: 'Phase 02',
  },
  {
    n: '03',
    title: 'Design & Build',
    desc: 'Develop campaigns, creative systems, landing experiences and the tracking infrastructure that makes optimisation possible.',
    tag: 'Phase 03',
  },
  {
    n: '04',
    title: 'Deploy & Compound',
    desc: 'Launch, optimise and scale through continuous testing, iteration and performance refinement, week after week.',
    tag: 'Phase 04',
  },
];

function PhaseRow({ s, i, total }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'start 20%'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [40, 0]);
  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="grid grid-cols-12 gap-6 md:gap-10 py-12 md:py-16 border-t border-[rgba(255,255,255,0.08)]"
    >
      <div className="col-span-12 md:col-span-2">
        <div className="font-display text-[40px] md:text-[56px] text-[#F43F5E] leading-none">{s.n}</div>
        <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">{s.tag}</div>
      </div>
      <motion.div style={{ x }} className="col-span-12 md:col-span-7">
        <h3 className="font-display text-[32px] md:text-[40px] lg:text-[48px] leading-tight tracking-tight">{s.title}</h3>
        <p className="mt-4 text-[16px] md:text-[18px] text-[#A0A0A0] leading-relaxed max-w-2xl">{s.desc}</p>
      </motion.div>
      <div className="hidden md:flex col-span-3 items-center justify-end">
        <div className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">
          {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </div>
    </motion.div>
  );
}

function GrowthFramework() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-20 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="mb-6"><Kicker>Our growth framework</Kicker></div>
            <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight">
              A four-phase<br />
              <span className="text-white/40">growth engine.</span>
            </h2>
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed">
            Every performance engagement runs through the same proprietary system,
            calibrated to your category, stage and ambition. It's how the work
            compounds long after the launch week.
          </p>
        </div>

        <div>
          {phases.map((s, i) => (
            <PhaseRow key={s.n} s={s} i={i} total={phases.length} />
          ))}
          <div className="border-t border-[rgba(255,255,255,0.08)]" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  06, Different                                                    */
/* ------------------------------------------------------------------ */

function Different() {
  const items = [
    { k: '01', t: 'Strategy before spend', d: 'No budget moves until we can explain why it will compound.' },
    { k: '02', t: 'Creative before optimisation', d: 'You can\'t optimise your way out of a creative problem. We start there.' },
    { k: '03', t: 'Systems before scaling', d: 'We scale what we can measure, and we measure what actually drives revenue.' },
  ];
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <div className="mb-6"><Kicker>Why we're different</Kicker></div>
            <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight">
              We don't sell clicks.<br />
              <span className="text-white/40">We engineer outcomes.</span>
            </h2>
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed">
            Three principles run through every engagement. They are not slogans,
            they are the reason our work outlasts the retainer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {items.map((it, i) => (
            <motion.div
              key={it.k}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-black p-8 md:p-10 min-h-[260px] flex flex-col justify-between"
            >
              <div className="font-display text-[40px] md:text-[56px] text-white/15 leading-none">{it.k}</div>
              <div>
                <h3 className="font-display text-2xl md:text-[28px] tracking-tight">{it.t}</h3>
                <p className="mt-3 text-[15px] text-[#A0A0A0] leading-relaxed">{it.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  07, Client Perspective                                           */
/* ------------------------------------------------------------------ */

function ClientPerspective() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12"><Kicker>Client perspective</Kicker></div>

        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <Quote className="text-[#E11D2E] mb-6" size={40} />
          <p className="font-display text-[28px] md:text-[44px] lg:text-[56px] leading-[1.15] tracking-tight max-w-5xl">
            "We came to Adcom looking for a media buyer. We left with an operating
            system. Eighteen months later, performance still compounds, and the
            team has never been sharper."
          </p>
          <div className="mt-12 flex items-center gap-5">
            <img
              src="https://i.pravatar.cc/120?img=33"
              alt=""
              className="w-14 h-14 rounded-full object-cover border border-[rgba(255,255,255,0.1)]"
            />
            <div>
              <div className="font-semibold">Ishaan Verma</div>
              <div className="text-sm text-[#A0A0A0]">Founder &amp; CEO, Lumen Skincare</div>
            </div>
          </div>
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  08, Closing                                                      */
/* ------------------------------------------------------------------ */

function Closing() {
  const go = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="orb bg-[#E11D2E] w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-25" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[52px] md:text-[88px] lg:text-[120px] leading-[0.92] tracking-tighter max-w-6xl"
        >
          Growth isn't<br />
          a campaign.<br />
          <span className="text-[#F43F5E]">It's a commitment.</span>
        </motion.h2>

        <div className="mt-12 grid lg:grid-cols-12 gap-10 items-end">
          <p className="lg:col-span-7 text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed max-w-2xl">
            For brands ready to scale with clarity, creativity and performance,
            we open a small number of select engagements each quarter.
          </p>
          <div className="lg:col-span-5 lg:text-right">
            <MagneticButton
              data-testid="perf-closing-cta"
              onClick={go}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black hover:bg-[#F43F5E] hover:text-white text-sm font-semibold transition-colors duration-300"
            >
              Start a Growth Conversation
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function PerformanceMarketing() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <Reality />
        <Philosophy />
        <GrowthStories />
        <GrowthFramework />
        <Different />
        <ClientPerspective />
        <Closing />
        <ServiceEnquiry service="Performance Marketing" />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
