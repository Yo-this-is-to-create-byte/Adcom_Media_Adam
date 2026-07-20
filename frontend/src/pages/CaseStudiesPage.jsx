import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { CaseStudiesEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';

const studies = [
  {
    client: 'Sharma Furnituree', industry: 'Furniture Retail', tag: 'Local SEO + Growth',
    href: '/case-studies/sharma-furniture',
    story: 'A trusted Jamshedpur furniture house, taught to be discovered, trusted and chosen online weeks before a customer walks in.',
    metric: '+26%', m1: 'Qualified enquiries', metric2: '18+', m2: 'First-page rankings',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
  },
  {
    client: 'Prochem Turnkey Projects', industry: 'B2B · Engineering', tag: 'LinkedIn · Founder-led',
    href: '/case-studies/prochem',
    story: 'A twenty-year-old engineering house turned into the LinkedIn feed every plant head in India quietly follows, without a single paid campaign.',
    metric: '13k+', m1: 'Followers (from 4k)', metric2: '128k', m2: 'Impressions · 12 mo',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
  },
  {
    client: 'Maison Noir', industry: 'Luxury D2C', tag: 'Brand + Content',
    story: 'A wordless luxury brand world the internet recognises in a single frame, and a drop strategy that sells out in hours.',
    metric: '+340%', m1: 'AOV uplift', metric2: '92k', m2: 'Drop waitlist',
    image: 'https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=1600&q=80',
  },
  {
    client: 'Orbit', industry: 'B2B SaaS', tag: 'AI SEO + LinkedIn',
    story: 'Rewired Orbit\'s content engine for LLM retrieval. Pipeline now compounds without paid spend.',
    metric: '8.1x', m1: 'Inbound pipeline', metric2: '#1', m2: 'Cited in Perplexity',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80',
  },
  {
    client: 'Numa', industry: 'Wellness', tag: 'Performance + Lifecycle',
    story: 'A leaky subscription funnel rebuilt into a single revenue system, compounding every quarter since.',
    metric: '4.7x', m1: 'Customer LTV', metric2: '63%', m2: '12-mo retention',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80',
  },
  {
    client: 'Kavi Coffee', industry: 'F&B', tag: 'Brand + Content',
    story: 'Quiet specialty coffee turned into India\'s most shared coffee feed. Every frame shot in-house.',
    metric: '21M', m1: 'Organic views', metric2: '+540%', m2: 'DTC revenue',
    image: 'https://images.unsplash.com/photo-1559526324-c1f275fbfa32?auto=format&fit=crop&w=1600&q=80',
  },
  {
    client: 'Atlas Pay', industry: 'Fintech', tag: 'AI SEO',
    story: 'Default citation across the category\'s most-asked LLM prompts. AI surfaces became a real channel.',
    metric: '+340%', m1: 'AI-driven sessions', metric2: '12x', m2: 'Brand citations',
    image: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function CaseStudiesPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        <section className="relative min-h-[70vh] w-full flex flex-col justify-center overflow-hidden pt-24">
          <div className="orb bg-[#E11D2E] w-[500px] h-[500px] -top-40 -left-40 opacity-30" />
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-24">
            <div className="flex items-center gap-3 mb-8">
              <Link to="/" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Adcom Media
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Case Studies</span>
            </div>
            <h1 className="font-display text-[56px] sm:text-[80px] md:text-[100px] lg:text-[120px] leading-[0.9] tracking-tighter">
              <span className="block">Stories first.</span>
              <span className="block italic font-light text-white/40">Numbers</span>
              <span className="block text-[#F43F5E]">second.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]">
              A selection of recent engagements. Industries change, channels change,
              the operating model and the standard of work do not.
            </p>
          </div>
        </section>

        <section className="relative py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {studies.map((s, i) => {
                const CardWrapper = s.href ? Link : 'div';
                const wrapperProps = s.href ? { to: s.href } : {};
                return (
                  <motion.article
                    key={s.client}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, delay: (i % 2) * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="group relative aspect-[4/5] md:aspect-[5/6] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]"
                  >
                    <CardWrapper {...wrapperProps} className="block absolute inset-0">
                      <div className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.04] transition-transform duration-700" style={{ backgroundImage: `url(${s.image})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                        <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] uppercase tracking-[0.2em] border border-white/10">
                          {String(i + 1).padStart(2, '0')} · {s.industry}
                        </span>
                        <span className="px-3 py-1.5 rounded-full bg-[#E11D2E]/90 text-[11px] uppercase tracking-[0.2em]">{s.tag}</span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col gap-6">
                        <div>
                          <div className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#A0A0A0] mb-3">{s.client}</div>
                          <p className="font-display text-lg md:text-xl lg:text-2xl leading-snug tracking-tight max-w-md">{s.story}</p>
                        </div>
                        <div className="flex items-end justify-between gap-4">
                          <div className="flex gap-8">
                            <div>
                              <div className="font-display text-2xl md:text-3xl text-[#F43F5E]">{s.metric}</div>
                              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] mt-1">{s.m1}</div>
                            </div>
                            <div>
                              <div className="font-display text-2xl md:text-3xl">{s.metric2}</div>
                              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] mt-1">{s.m2}</div>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-[#F43F5E] group-hover:text-white transition-colors">
                            <ArrowUpRight size={20} />
                          </div>
                        </div>
                      </div>
                    </CardWrapper>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <CaseStudiesEnquiry />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
