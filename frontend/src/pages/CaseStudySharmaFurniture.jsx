import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowLeft, ArrowUpRight, Search, ShieldCheck, Users, Sparkles, Target,
  PhoneCall, MessageCircle, Compass, Eye, Star, MapPin, Quote,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { CaseStudiesEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';
import MagneticButton from '@/components/MagneticButton';

/* --------------------------------------------------------------- */

const SHOWROOM_HERO = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80';
const SHOWROOM_2 = 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=80';
const SHOWROOM_3 = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80';
const SOFA = 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=80';
const BEDROOM = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
const DINING = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80';
const FOUNDER = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80';

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

/* ----------------- 01 — Hero ----------------- */

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden pt-24">
      {/* Background image with parallax */}
      <motion.div style={{ y: yImg }} className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${SHOWROOM_HERO})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#000_85%)]" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 min-h-[88vh] flex flex-col justify-end">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex items-center gap-3 mb-10">
          <Link to="/case-studies" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Case Studies
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#F43F5E] font-mono">CASE STUDY · 01 / Furniture Retail</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[108px] leading-[0.95] tracking-tighter max-w-6xl"
        >
          They weren&apos;t competing<br />
          with <span className="italic font-light text-white/40">furniture stores.</span><br />
          They were competing with{' '}
          <span className="text-[#F43F5E]">delay.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-end"
        >
          <p className="lg:col-span-7 text-[17px] md:text-[19px] leading-relaxed text-[#D4D4D4] max-w-xl">
            Most furniture purchases don&apos;t happen immediately. People compare.
            They save ideas. They visit multiple stores. The challenge wasn&apos;t
            visibility, it was becoming the obvious choice when the decision
            finally happened.
          </p>
          <div className="lg:col-span-5 lg:text-right flex flex-col lg:items-end gap-4">
            <MagneticButton
              data-testid="sharma-hero-cta"
              onClick={() => { const el = document.getElementById('journey'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-black hover:bg-[#F43F5E] hover:text-white text-sm font-semibold transition-colors"
            >
              View the journey
              <ArrowUpRight size={16} />
            </MagneticButton>
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] flex items-center gap-2">
              <MapPin size={12} /> Jamshedpur, India
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Client meta strip */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pt-10 border-t border-[rgba(255,255,255,0.08)]">
          {[
            { l: 'Client', v: 'Sharma Furnituree' },
            { l: 'Industry', v: 'Furniture Retail' },
            { l: 'Founder', v: 'Sumit Sharma' },
            { l: 'Engagement', v: 'Growth System' },
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

/* ----------------- 02 — Reality / Split ----------------- */

function FurnitureRarely() {
  return (
    <section id="journey" className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left — image stack */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp} className="lg:col-span-6 relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${SHOWROOM_2})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="hidden md:block absolute -bottom-12 -right-8 w-1/2 aspect-[4/5] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${SHOWROOM_3})` }} />
            </div>
          </motion.div>

          {/* Right — copy */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp} custom={1} className="lg:col-span-6"
          >
            <Kicker>The reality</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[56px] lg:text-[68px] leading-[1.02] tracking-tighter">
              Furniture is rarely<br />
              <span className="text-white/40">an urgent purchase.</span>
            </h2>
            <div className="mt-10 space-y-5 text-[17px] md:text-[19px] leading-[1.7] text-[#D4D4D4] max-w-xl">
              <p>Most customers spend weeks researching before they visit a showroom.</p>
              <ul className="space-y-2 text-[#A0A0A0]">
                {['They compare styles.', 'They evaluate budgets.', 'They explore EMI options.', 'They seek inspiration.'].map((t) => (
                  <li key={t} className="flex items-baseline gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] mt-2 shrink-0" />{t}</li>
                ))}
              </ul>
              <p>
                Sharma Furnituree had already earned trust offline. The goal was to
                earn that same trust online, earlier in the customer journey.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------- 03 — Decision-making cards ----------------- */

const decisionCards = [
  { n: '01', t: 'Search Visibility', Icon: Search, d: 'Making Sharma Furnituree discoverable when customers were actively researching furniture.' },
  { n: '02', t: 'Digital Trust', Icon: ShieldCheck, d: 'Strengthening confidence through reviews, showroom experiences, customer stories and social proof.' },
  { n: '03', t: 'Local Influence', Icon: Users, d: 'Partnering with trusted local voices to help customers visualise furniture in real-world settings.' },
  { n: '04', t: 'Conversion Design', Icon: Target, d: 'Removing friction between interest and enquiry.' },
  { n: '05', t: 'Demand Capture', Icon: Sparkles, d: 'Ensuring high-intent visitors always had a clear next step.' },
];

function DecisionMaking() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-7">
            <Kicker>Our thesis</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[72px] leading-[1.02] tracking-tighter">
              We didn&apos;t optimise<br />
              for search.<br />
              <span className="text-[#F43F5E]">We optimised for decision making.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md">
            Instead of focusing purely on rankings, we focused on reducing
            uncertainty. Every improvement was built around one question:
            <span className="block mt-4 text-white italic">
              &ldquo;What information does a customer need before they feel
              comfortable visiting a showroom?&rdquo;
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {decisionCards.map((c, i) => (
            <motion.div
              key={c.n}
              data-testid={`sharma-decision-${c.n}`}
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
          {/* Pattern card to balance the grid */}
          <div className="relative bg-black p-8 md:p-10 min-h-[300px] flex flex-col justify-center text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
            <div className="relative font-display text-2xl md:text-[28px] leading-tight tracking-tight text-white/30">
              One <span className="text-[#F43F5E]">growth system.</span><br />Not five disconnected channels.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------- 04 — KPIs ----------------- */

function CountUp({ to, suffix = '', prefix = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [val, setVal] = React.useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1700;
    const start = performance.now() + delay;
    let raf;
    const tick = (now) => {
      const t = Math.max(0, Math.min((now - start) / dur, 1));
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.floor(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, delay]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

const kpis = [
  { v: 18, suffix: '+', l: 'First-page rankings on intent-led queries' },
  { v: 24, suffix: '%', l: 'Lift in inbound customer calls' },
  { v: 26, suffix: '%', l: 'Increase in qualified enquiries' },
  { v: 8, suffix: '',  l: 'Local creator partnerships activated' },
];

function SmallImprovements() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-6">
            <Kicker>The outcome</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[72px] leading-[1.02] tracking-tighter">
              Small improvements.<br />
              <span className="text-[#F43F5E]">Bigger outcomes.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 lg:col-start-8 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md">
            We didn&apos;t chase vanity metrics. Every number below maps to a
            concrete shift in how customers experienced the brand online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {kpis.map((k, i) => (
            <motion.div
              key={k.l}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              custom={i}
              className="bg-black p-8 md:p-10 min-h-[220px] flex flex-col justify-between"
            >
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="font-display text-[64px] md:text-[80px] lg:text-[96px] leading-none tracking-tighter">
                  <CountUp to={k.v} suffix={k.suffix} />
                </div>
                <div className="mt-4 text-[13px] md:text-[14px] text-[#A0A0A0] leading-relaxed max-w-[220px]">
                  {k.l}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------- 05 — Trust leakage process ----------------- */

const trustItems = [
  { t: 'Product discovery', d: 'Re-architected the catalog so customers could explore by room, by use, by budget — not just by category.' },
  { t: 'Mobile experience', d: 'Rebuilt the mobile journey with thumb-first navigation and instant-loading product galleries.' },
  { t: 'Trust signals', d: 'Real customer photos, verified reviews and decade-old craftsmanship stories placed where buyers hesitate.' },
  { t: 'Simplified enquiries', d: 'Pre-filled enquiry flows by product, by room and by EMI option — fewer fields, more starts.' },
  { t: 'WhatsApp accessibility', d: 'One-tap WhatsApp on every product card, with a real human (not a chatbot) on the other end.' },
  { t: 'Clearer navigation', d: 'Restructured menu, search and breadcrumbs around how customers actually think about furniture.' },
];

function TrustLeakage() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="orb bg-[#E11D2E] w-[600px] h-[600px] -top-40 -right-40 opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-6">
            <Kicker>The strongest leverage</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[64px] lg:text-[80px] leading-[1.02] tracking-tighter">
              The problem wasn&apos;t<br />
              <span className="text-white/40">traffic leakage.</span><br />
              It was <span className="text-[#F43F5E]">trust leakage.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 lg:col-start-8 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md self-end">
            Customers were discovering the brand. Many still left without action,
            not because the products weren&apos;t attractive, but because they
            still had unanswered questions. We focused on solving those
            questions before they were asked.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {trustItems.map((it, i) => (
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
                <p className="mt-3 text-[15px] md:text-[16px] text-[#A0A0A0] leading-relaxed max-w-md">{it.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------- 06 — Real homes / image scroller ----------------- */

const homes = [
  { img: SHOWROOM_2, room: 'Living', tag: 'Mr. Singh · Sonari' },
  { img: BEDROOM, room: 'Bedroom', tag: 'Priya & Rohan · Bistupur' },
  { img: DINING, room: 'Dining', tag: 'Verma family · Kadma' },
  { img: SOFA, room: 'Living', tag: 'Anand · Telco' },
  { img: SHOWROOM_3, room: 'Showroom', tag: 'Sharma Furnituree · Sakchi' },
];

function RealHomes() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-6">
            <Kicker>Local creators</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[72px] leading-[1.02] tracking-tighter">
              Real homes.<br />
              <span className="text-white/40">Real context.</span>
            </h2>
            <div className="mt-4 text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">
              Not &lsquo;influencer marketing.&rsquo;
            </div>
          </div>
          <p className="lg:col-span-5 lg:col-start-8 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md">
            Furniture looks different inside a catalog. People make buying
            decisions when they can imagine products inside spaces similar to
            their own. Local creators helped bridge that gap, not by selling, but
            by helping customers visualise possibilities.
          </p>
        </div>
      </div>

      {/* Horizontal scroller (native overflow for premium feel + smooth) */}
      <div className="relative">
        <div className="flex gap-5 md:gap-8 overflow-x-auto pl-4 sm:pl-6 lg:pl-[max(1rem,calc((100vw-80rem)/2+2rem))] pr-6 lg:pr-8 pb-6 snap-x snap-mandatory scrollbar-none">
          {homes.map((h, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.06 }}
              className="shrink-0 w-[78vw] sm:w-[420px] md:w-[480px] snap-start"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] group">
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.04] transition-transform duration-700"
                     style={{ backgroundImage: `url(${h.img})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/60">{h.room}</div>
                  <div className="mt-2 font-display text-xl tracking-tight">{h.tag}</div>
                </div>
              </div>
            </motion.figure>
          ))}
          <div className="shrink-0 w-4 md:w-12" />
        </div>
      </div>
    </section>
  );
}

/* ----------------- 07 — Growth system timeline ----------------- */

const timeline = [
  { t: 'Search discovery', d: 'Found when the buyer was looking.' },
  { t: 'Trust building', d: 'Reviews, stories, real homes.' },
  { t: 'Engagement', d: 'Saved ideas. Returned visits.' },
  { t: 'Enquiries', d: 'A clear next step, every time.' },
  { t: 'Showroom visits', d: 'A walk-in already half-decided.' },
  { t: 'Customer referrals', d: 'Families telling other families.' },
];

function GrowthSystem() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 30%'] });
  const widthPct = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={ref} className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <Kicker>The framework</Kicker>
        <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[80px] leading-[1.02] tracking-tighter max-w-4xl">
          A growth system.<br />
          <span className="text-white/40">Not a campaign.</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress rail */}
        <div className="relative hidden md:block mb-10">
          <div className="h-px w-full bg-[rgba(255,255,255,0.08)]" />
          <motion.div style={{ width: widthPct }} className="absolute top-0 left-0 h-px bg-[#E11D2E]" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {timeline.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="bg-black p-6 md:p-8 min-h-[200px] flex flex-col justify-between"
            >
              <div className="text-xs font-mono text-[#F43F5E]">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className="font-display text-[20px] md:text-[22px] leading-tight tracking-tight">{s.t}</h3>
                <p className="mt-2 text-[13px] text-[#A0A0A0] leading-relaxed">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------- 08 — Customer journey ----------------- */

const journey = [
  { Icon: Search, t: 'Discovers the brand online', d: 'Through search, maps and trusted local content.' },
  { Icon: Eye, t: 'Explores products & showroom', d: 'Real room photos, room-by-room navigation.' },
  { Icon: Star, t: 'Builds confidence through reviews', d: 'Verified customer photos and stories.' },
  { Icon: MessageCircle, t: 'Connects through WhatsApp', d: 'One-tap, real human on the other end.' },
  { Icon: PhoneCall, t: 'Visits the showroom', d: 'Already half-decided, ready to feel the craft.' },
  { Icon: Compass, t: 'Makes the purchase decision', d: 'And often, refers another family.' },
];

function CustomerJourney() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Kicker>The customer arc</Kicker>
        <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[80px] leading-[1.02] tracking-tighter">
          From search result<br />
          <span className="text-[#F43F5E]">to store visit.</span>
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

/* ----------------- 09 — Founder spotlight ----------------- */

function FounderSpotlight() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="orb bg-[#7f1d1d] w-[700px] h-[700px] top-1/2 -translate-y-1/2 -left-40 opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${FOUNDER})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/70 mb-2">Founder</div>
                <div className="font-display text-2xl md:text-3xl tracking-tight">Sumit Sharma</div>
                <div className="text-sm text-white/70 mt-1">Sharma Furnituree · Jamshedpur</div>
              </div>
            </div>
          </motion.div>

          {/* Glassmorphic card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <Kicker>Founder spotlight</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[80px] leading-[1.02] tracking-tighter">
              Building for<br />
              <span className="text-[#F43F5E]">generations.</span>
            </h2>
            <div className="mt-10 rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl p-8 md:p-12 relative">
              <Quote size={36} className="text-[#E11D2E] mb-6" />
              <blockquote className="font-display text-[24px] md:text-[32px] lg:text-[36px] leading-[1.25] tracking-tight">
                &ldquo;Sharma Furnituree wasn&apos;t built around transactions.
                It was built around helping families create homes. Adcom understood
                that on the first call, and built the marketing around it,
                not the other way around.&rdquo;
              </blockquote>
              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <div>
                  <div className="font-medium">Sumit Sharma</div>
                  <div className="text-sm text-[#A0A0A0]">Founder, Sharma Furnituree</div>
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">Est. 1998</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------- 10 — Final outcome ----------------- */

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
          Visibility was the output.<br />
          <span className="text-white/40">Trust was the strategy.</span><br />
          <span className="text-[#F43F5E]">Growth was the result.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-12 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#D4D4D4]"
        >
          We didn&apos;t help Sharma Furnituree rank higher. We helped them
          become easier to discover. Easier to trust. And easier to choose.
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
            data-testid="sharma-final-cta"
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

export default function CaseStudySharmaFurniture() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <FurnitureRarely />
        <DecisionMaking />
        <SmallImprovements />
        <TrustLeakage />
        <RealHomes />
        <GrowthSystem />
        <CustomerJourney />
        <FounderSpotlight />
        <FinalOutcome />
        <FinalCTA />
        <CaseStudiesEnquiry />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
