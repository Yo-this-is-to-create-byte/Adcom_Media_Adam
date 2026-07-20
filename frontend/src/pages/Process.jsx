import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { ProcessEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';

const phases = [
  {
    n: '01',
    tag: 'Week 01–02',
    title: 'Discovery',
    desc: 'Customer interviews, data audits, competitive teardown and a brutally honest growth diagnostic. The truth before the plan.',
    deliverables: ['Growth diagnostic', 'Funnel & data audit', 'Competitor & narrative teardown', 'Hypothesis dossier'],
  },
  {
    n: '02',
    tag: 'Week 03–04',
    title: 'Strategy',
    desc: 'Narrative, positioning, channel mix and a 90-day growth model with assumptions you can defend in front of your board.',
    deliverables: ['Positioning & narrative', '90-day growth model', 'Channel architecture', 'Roadmap & rituals'],
  },
  {
    n: '03',
    tag: 'Week 05–08',
    title: 'Creation',
    desc: 'Brand systems, content, campaigns, landing pages and creative built in-house, at the velocity modern growth demands.',
    deliverables: ['Creative system', 'Landing & lifecycle build', 'Tracking & attribution', 'Launch plan'],
  },
  {
    n: '04',
    tag: 'Ongoing',
    title: 'Growth',
    desc: 'Live campaigns, weekly experimentation, lifecycle automations and monthly business reviews tied to revenue, not impressions.',
    deliverables: ['Weekly experiments', 'Monthly business review', 'Quarterly model refresh', 'Lead strategist on call'],
  },
];

function Row({ s, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'start 20%'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [40, 0]);
  return (
    <motion.div ref={ref} style={{ opacity }} className="grid grid-cols-12 gap-6 md:gap-10 py-16 md:py-24 border-t border-[rgba(255,255,255,0.08)]">
      <div className="col-span-12 md:col-span-3">
        <div className="font-display text-[64px] md:text-[96px] text-[#F43F5E] leading-none">{s.n}</div>
        <div className="mt-3 text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0]">{s.tag}</div>
      </div>
      <motion.div style={{ x }} className="col-span-12 md:col-span-6">
        <h3 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-tight tracking-tight">{s.title}</h3>
        <p className="mt-5 text-[18px] text-[#A0A0A0] leading-relaxed max-w-xl">{s.desc}</p>
      </motion.div>
      <div className="col-span-12 md:col-span-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0] mb-3">Deliverables</div>
        <ul className="space-y-2 text-[15px] text-white/85">
          {s.deliverables.map((d) => <li key={d} className="flex items-start gap-2"><span className="text-[#F43F5E] mt-1">·</span>{d}</li>)}
        </ul>
      </div>
    </motion.div>
  );
}

export default function ProcessPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        <section className="relative min-h-[80vh] w-full flex flex-col justify-center overflow-hidden pt-24">
          <div className="orb bg-[#E11D2E] w-[500px] h-[500px] -top-40 -right-40 opacity-30" />
          <div className="orb bg-[#7f1d1d] w-[600px] h-[600px] bottom-0 left-1/3 opacity-25" />

          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-32">
            <div className="flex items-center gap-3 mb-8">
              <Link to="/" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Adcom Media
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">The Adcom Method</span>
            </div>
            <h1 className="font-display text-[56px] sm:text-[80px] md:text-[100px] lg:text-[120px] leading-[0.9] tracking-tighter">
              <span className="block">A method,</span>
              <span className="block italic font-light text-white/40">not a</span>
              <span className="block text-[#F43F5E]">moodboard.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]">
              Every engagement at Adcom runs through the same proprietary four-phase
              operating system, calibrated to your stage, ambition and category.
              It is the reason our work compounds long after the retainer ends.
            </p>
          </div>
        </section>

        <section className="relative py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {phases.map((s, i) => <Row key={s.n} s={s} i={i} />)}
            <div className="border-t border-[rgba(255,255,255,0.08)]" />
          </div>
        </section>

        <ProcessEnquiry />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
