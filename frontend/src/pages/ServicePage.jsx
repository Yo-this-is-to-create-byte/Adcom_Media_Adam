import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, Quote } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';
import MagneticButton from '@/components/MagneticButton';
import { ServiceEnquiry } from '@/components/enquiries';

/* Small primitives reused across service pages */

export const Kicker = ({ children }) => (
  <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] flex items-center gap-3">
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

/* ---------------- Sections ---------------- */

function Hero({ kicker, headline, sub, primaryCta = 'Start a Growth Conversation', secondaryCta = 'View results' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // headline: array of lines, each { text, italic?, accent? }
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
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Adcom Media
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">{kicker}</span>
        </motion.div>

        <h1 className="font-display text-[56px] sm:text-[80px] md:text-[100px] lg:text-[120px] leading-[0.9] tracking-tighter">
          {headline.map((line, li) => {
            let cursor = li === 0 ? 0 : headline.slice(0, li).reduce((a, l) => a + l.text.length, 0);
            return (
              <span key={li} className="block">
                {line.italic ? (
                  <span className="italic font-light text-white/40 align-baseline">
                    <CharReveal text={line.text} baseDelay={cursor} />
                  </span>
                ) : line.accent ? (
                  <span className="text-[#F43F5E]">
                    <CharReveal text={line.text} baseDelay={cursor} />
                  </span>
                ) : (
                  <CharReveal text={line.text} baseDelay={cursor} />
                )}
              </span>
            );
          })}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]"
        >
          {sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row gap-6 sm:items-center"
        >
          <MagneticButton
            data-testid="service-hero-primary"
            onClick={() => go('contact')}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#E11D2E] hover:bg-[#F43F5E] text-white text-sm font-semibold transition-colors duration-300"
          >
            {primaryCta}
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </MagneticButton>

          <button
            data-testid="service-hero-secondary"
            onClick={() => go('stories')}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
          >
            <span className="border-b border-[rgba(255,255,255,0.2)] group-hover:border-white pb-1 transition-colors">
              {secondaryCta}
            </span>
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Reality({ kicker = 'The reality', headline, body }) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3"><Kicker>{kicker}</Kicker></div>
          <div className="lg:col-span-9">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[40px] md:text-[64px] lg:text-[88px] leading-[0.98] tracking-tighter"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="mt-12 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]"
            >
              {body}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillars({ kicker, title, subtitle, pillars }) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <div className="mb-6"><Kicker>{kicker}</Kicker></div>
            <h2
              className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight max-w-3xl"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
          <p className="max-w-md text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              data-testid={`service-pillar-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-black hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-500 p-8 md:p-10 min-h-[280px] flex flex-col justify-between"
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

function Stories({ kicker = 'Selected growth stories', title, subtitle, stories }) {
  return (
    <section id="stories" className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-5">
            <div className="mb-6"><Kicker>{kicker}</Kicker></div>
            <h2
              className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {stories.map((s, i) => (
            <motion.article
              key={s.client}
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
                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight">{s.client}</h3>
                </div>
                <div className="lg:col-span-8 space-y-8">
                  <StoryBlock label="Challenge" body={s.challenge} />
                  <StoryBlock label="Approach" body={s.approach} />
                  <StoryBlock label="Outcome" body={s.outcome} />
                  <div className="pt-6 border-t border-[rgba(255,255,255,0.08)] grid grid-cols-3 gap-6">
                    {s.metrics.map((m) => (
                      <div key={m.l}>
                        <div className="font-display text-2xl md:text-3xl lg:text-4xl text-[#F43F5E] tracking-tight">{m.v}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] mt-1">{m.l}</div>
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
      <div className="col-span-12 md:col-span-3"><div className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">{label}</div></div>
      <p className="col-span-12 md:col-span-9 text-[16px] md:text-[18px] leading-relaxed text-white/85">{body}</p>
    </div>
  );
}

function PhaseRow({ s, i, total }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'start 20%'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [40, 0]);
  return (
    <motion.div ref={ref} style={{ opacity }} className="grid grid-cols-12 gap-6 md:gap-10 py-12 md:py-16 border-t border-[rgba(255,255,255,0.08)]">
      <div className="col-span-12 md:col-span-2">
        <div className="font-display text-[40px] md:text-[56px] text-[#F43F5E] leading-none">{s.n}</div>
        <div className="mt-3 text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">{s.tag}</div>
      </div>
      <motion.div style={{ x }} className="col-span-12 md:col-span-7">
        <h3 className="font-display text-[32px] md:text-[40px] lg:text-[48px] leading-tight tracking-tight">{s.title}</h3>
        <p className="mt-4 text-[16px] md:text-[18px] text-[#A0A0A0] leading-relaxed max-w-2xl">{s.desc}</p>
      </motion.div>
      <div className="hidden md:flex col-span-3 items-center justify-end">
        <div className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">{String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
      </div>
    </motion.div>
  );
}

function Framework({ kicker = 'Our framework', title, subtitle, phases }) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-20 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="mb-6"><Kicker>{kicker}</Kicker></div>
            <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight" dangerouslySetInnerHTML={{ __html: title }} />
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed">{subtitle}</p>
        </div>
        <div>
          {phases.map((s, i) => <PhaseRow key={s.n} s={s} i={i} total={phases.length} />)}
          <div className="border-t border-[rgba(255,255,255,0.08)]" />
        </div>
      </div>
    </section>
  );
}

function Principles({ kicker = "Why we're different", title, subtitle, items }) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <div className="mb-6"><Kicker>{kicker}</Kicker></div>
            <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight" dangerouslySetInnerHTML={{ __html: title }} />
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed">{subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-3xl overflow-hidden">
          {items.map((it, i) => (
            <motion.div key={it.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay: i * 0.1 }} className="bg-black p-8 md:p-10 min-h-[260px] flex flex-col justify-between">
              <div className="font-display text-[40px] md:text-[56px] text-white/15 leading-none">{String(i + 1).padStart(2, '0')}</div>
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

function Testimonial({ quote, name, role, avatar }) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12"><Kicker>Client perspective</Kicker></div>
        <motion.blockquote initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9 }} className="relative">
          <Quote className="text-[#E11D2E] mb-6" size={40} />
          <p className="font-display text-[28px] md:text-[44px] lg:text-[56px] leading-[1.15] tracking-tight max-w-5xl">&ldquo;{quote}&rdquo;</p>
          <div className="mt-12 flex items-center gap-5">
            <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover border border-[rgba(255,255,255,0.1)]" />
            <div>
              <div className="font-semibold">{name}</div>
              <div className="text-sm text-[#A0A0A0]">{role}</div>
            </div>
          </div>
        </motion.blockquote>
      </div>
    </section>
  );
}

function Closing({ headlineHtml, body }) {
  const go = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="orb bg-[#E11D2E] w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-25" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.h2 initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1 }} className="font-display text-[52px] md:text-[88px] lg:text-[120px] leading-[0.92] tracking-tighter max-w-6xl" dangerouslySetInnerHTML={{ __html: headlineHtml }} />
        <div className="mt-12 grid lg:grid-cols-12 gap-10 items-end">
          <p className="lg:col-span-7 text-[18px] md:text-[20px] text-[#A0A0A0] leading-relaxed max-w-2xl">{body}</p>
          <div className="lg:col-span-5 lg:text-right">
            <MagneticButton onClick={go} className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black hover:bg-[#F43F5E] hover:text-white text-sm font-semibold transition-colors duration-300">
              Start a Growth Conversation
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ServicePage wrapper ---------------- */

export default function ServicePage({ data }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        <Hero {...data.hero} />
        <Reality {...data.reality} />
        <Pillars {...data.pillars} />
        <Stories {...data.stories} />
        <Framework {...data.framework} />
        <Principles {...data.principles} />
        <Testimonial {...data.testimonial} />
        <Closing {...data.closing} />
        <ServiceEnquiry service={data.service || 'Growth'} />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
