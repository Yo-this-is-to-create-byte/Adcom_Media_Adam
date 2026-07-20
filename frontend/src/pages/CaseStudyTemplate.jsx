import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Quote, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';
import MagneticButton from '@/components/MagneticButton';
import { CaseStudiesEnquiry } from '@/components/enquiries';

const Kicker = ({ children }) => (
  <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] flex items-center gap-3">
    <span className="w-8 h-px bg-[#A0A0A0]" />{children}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }),
};

function CountUp({ to, suffix = '', separator = false, decimals = 0 }) {
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
  const display = decimals > 0 ? val.toFixed(decimals) : separator ? Math.floor(val).toLocaleString() : Math.floor(val).toString();
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ----------- Sections ----------- */

function Hero({ data }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden pt-24">
      <motion.div style={{ y: yImg }} className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${data.hero.image})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/75 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_25%,_#000_85%)]" />
      </motion.div>
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 min-h-[88vh] flex flex-col justify-end">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="flex items-center gap-3 mb-10 flex-wrap">
          <Link to="/case-studies" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />Case Studies
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#F43F5E] font-mono">{data.hero.eyebrow}</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.45 }}
          className="font-display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[108px] leading-[0.95] tracking-tighter max-w-6xl"
          dangerouslySetInnerHTML={{ __html: data.hero.headline }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.1 }} className="mt-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <p className="lg:col-span-7 text-[17px] md:text-[19px] leading-relaxed text-[#D4D4D4] max-w-xl">{data.hero.sub}</p>
          <div className="lg:col-span-5 lg:text-right flex flex-col lg:items-end gap-4">
            <MagneticButton onClick={() => { const el = document.getElementById('thesis'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-black hover:bg-[#F43F5E] hover:text-white text-sm font-semibold transition-colors">
              View the journey<ArrowUpRight size={16} />
            </MagneticButton>
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] flex items-center gap-2">
              <MapPin size={12} />{data.hero.location}
            </div>
          </div>
        </motion.div>
      </motion.div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pt-10 border-t border-[rgba(255,255,255,0.08)]">
          {data.hero.meta.map((m) => (
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

function Thesis({ data }) {
  return (
    <section id="thesis" className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-7">
            <Kicker>{data.thesis.kicker}</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[72px] leading-[1.02] tracking-tighter"
                dangerouslySetInnerHTML={{ __html: data.thesis.title }} />
          </div>
          <p className="lg:col-span-5 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md">{data.thesis.body}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {data.thesis.pillars.map((c, i) => (
            <motion.div key={c.t} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} custom={i}
              className="group relative bg-black hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-500 p-8 md:p-10 min-h-[280px] flex flex-col justify-between">
              <div className="text-xs font-mono text-[#A0A0A0]">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <h3 className="font-display text-2xl md:text-[26px] leading-tight tracking-tight">{c.t}</h3>
                <p className="mt-3 text-[14px] md:text-[15px] text-[#A0A0A0] leading-relaxed">{c.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function KPIs({ data }) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-7">
            <Kicker>{data.kpis.kicker}</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[72px] leading-[1.02] tracking-tighter"
                dangerouslySetInnerHTML={{ __html: data.kpis.title }} />
          </div>
          <p className="lg:col-span-5 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md">{data.kpis.body}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {data.kpis.items.map((k, i) => (
            <motion.div key={k.l} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} custom={i}
              className="bg-black p-8 md:p-10 min-h-[220px] flex flex-col justify-between">
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <div className="font-display text-[48px] md:text-[64px] lg:text-[80px] leading-none tracking-tighter">
                  {k.custom ? k.custom : <CountUp to={k.v} suffix={k.suffix || ''} separator={k.separator} decimals={k.decimals || 0} />}
                </div>
                <div className="mt-4 text-[13px] md:text-[14px] text-[#A0A0A0] leading-relaxed max-w-[240px]">{k.l}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work({ data }) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="orb bg-[#7f1d1d] w-[600px] h-[600px] -top-40 -left-40 opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-6">
            <Kicker>{data.work.kicker}</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[64px] lg:text-[80px] leading-[1.02] tracking-tighter"
                dangerouslySetInnerHTML={{ __html: data.work.title }} />
          </div>
          <p className="lg:col-span-5 lg:col-start-8 text-[17px] md:text-[19px] text-[#D4D4D4] leading-relaxed max-w-md self-end">{data.work.body}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {data.work.items.map((it, i) => (
            <motion.div key={it.t} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} custom={i}
              className="bg-black p-8 md:p-12 min-h-[220px] flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">
                  {String(i + 1).padStart(2, '0')} / {String(data.work.items.length).padStart(2, '0')}
                </div>
                <div className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center group-hover:bg-[#F43F5E] group-hover:border-[#F43F5E] transition-colors">
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <div className="mt-8">
                <h3 className="font-display text-[26px] md:text-[32px] leading-tight tracking-tight">{it.t}</h3>
                <p className="mt-3 text-[15px] text-[#A0A0A0] leading-relaxed max-w-md">{it.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey({ data }) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Kicker>{data.journey.kicker}</Kicker>
        <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[80px] leading-[1.02] tracking-tighter"
            dangerouslySetInnerHTML={{ __html: data.journey.title }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-px">
        {data.journey.steps.map((s, i) => (
          <motion.div key={s.t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
            className="group grid grid-cols-12 gap-4 md:gap-10 py-8 md:py-10 border-b border-[rgba(255,255,255,0.08)] last:border-b-0 items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors px-2 md:px-0">
            <div className="col-span-2 md:col-span-2">
              <div className="font-display text-[40px] md:text-[64px] leading-none text-white/15 group-hover:text-[#F43F5E] transition-colors">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
            <h3 className="col-span-10 md:col-span-5 font-display text-[20px] md:text-[28px] lg:text-[32px] leading-tight tracking-tight">{s.t}</h3>
            <p className="col-span-12 md:col-span-5 text-[14px] md:text-[16px] text-[#A0A0A0] leading-relaxed">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Founder({ data }) {
  if (!data.founder) return null;
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="orb bg-[#E11D2E] w-[700px] h-[700px] top-1/2 -translate-y-1/2 -right-40 opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9 }} className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${data.founder.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/70 mb-2">{data.founder.role}</div>
                <div className="font-display text-2xl md:text-3xl tracking-tight">{data.founder.name}</div>
                <div className="text-sm text-white/70 mt-1">{data.founder.company}</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, delay: 0.1 }} className="lg:col-span-7">
            <Kicker>Client perspective</Kicker>
            <h2 className="mt-6 font-display text-[40px] md:text-[60px] lg:text-[72px] leading-[1.02] tracking-tighter"
                dangerouslySetInnerHTML={{ __html: data.founder.headline }} />
            <div className="mt-10 rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl p-8 md:p-12 relative">
              <Quote size={36} className="text-[#E11D2E] mb-6" />
              <blockquote className="font-display text-[22px] md:text-[30px] lg:text-[34px] leading-[1.25] tracking-tight">
                &ldquo;{data.founder.quote}&rdquo;
              </blockquote>
              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <div>
                  <div className="font-medium">{data.founder.name}</div>
                  <div className="text-sm text-[#A0A0A0]">{data.founder.company}</div>
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">{data.founder.tag}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Outcome({ data }) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Kicker>The final outcome</Kicker>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1 }}
          className="mt-8 font-display text-[44px] md:text-[72px] lg:text-[104px] leading-[0.95] tracking-tighter max-w-6xl"
          dangerouslySetInnerHTML={{ __html: data.outcome.headline }} />
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-12 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#D4D4D4]">{data.outcome.body}</motion.p>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden border-t border-[rgba(255,255,255,0.08)]">
      <div className="orb bg-[#E11D2E] w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-25" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1 }}
          className="font-display text-[44px] md:text-[80px] lg:text-[112px] leading-[0.95] tracking-tighter max-w-6xl">
          Let&apos;s build something<br /><span className="text-[#F43F5E]">that grows.</span>
        </motion.h2>
        <p className="mt-10 max-w-xl text-[18px] md:text-[20px] text-[#D4D4D4] leading-relaxed">
          Growth isn&apos;t built through channels. It&apos;s built through systems.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-5 sm:items-center">
          <MagneticButton onClick={() => { const el = document.getElementById('cs-enquiry'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#E11D2E] hover:bg-[#F43F5E] text-white text-sm font-semibold transition-colors">
            Start a conversation<ArrowUpRight size={16} />
          </MagneticButton>
          <Link to="/case-studies" className="group inline-flex items-center gap-2 text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors">
            <span className="border-b border-[rgba(255,255,255,0.2)] group-hover:border-white pb-1 transition-colors">View more case studies</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function CaseStudyTemplate({ data }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        <Hero data={data} />
        <Thesis data={data} />
        <KPIs data={data} />
        <Work data={data} />
        <Journey data={data} />
        <Founder data={data} />
        <Outcome data={data} />
        <FinalCTA />
        <CaseStudiesEnquiry />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
