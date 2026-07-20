import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CASE_STUDIES } from '@/constants/testIds';

const studies = [
  {
    slug: 'sharma-furniture',
    href: '/case-studies/sharma-furniture',
    client: 'Sharma Furnituree',
    industry: 'Furniture Retail',
    tag: 'Local SEO + Growth',
    story:
      'A trusted Jamshedpur furniture house, taught to be discovered, trusted and chosen online, weeks before a customer ever walks in.',
    metric: '+26%',
    metricLabel: 'Qualified enquiries',
    metric2: '18+',
    metric2Label: 'First-page rankings',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'prochem',
    href: '/case-studies/prochem',
    client: 'Prochem Turnkey Projects',
    industry: 'B2B · Engineering',
    tag: 'LinkedIn · Founder-led',
    story:
      'A twenty-year-old engineering house turned into the LinkedIn feed every plant head in India quietly follows, without ever running a campaign.',
    metric: '13k+',
    metricLabel: 'Followers (from 4k)',
    metric2: '128k',
    metric2Label: 'Impressions · 12 mo',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'profotech',
    href: '/case-studies/profotech',
    client: 'Profotech Engineering',
    industry: 'Industrial Engineering',
    tag: 'Brand · Digital · Print',
    story:
      'An industrial engineering house rebuilt end-to-end, so the brand finally reads as precisely as the work it represents.',
    metric: '20+',
    metricLabel: 'Brand assets designed',
    metric2: '01',
    metric2Label: 'Corporate website',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'aus-tyre',
    href: '/case-studies/aus-tyre',
    client: 'Australian Tyre Brand',
    industry: 'E-commerce · Automotive',
    tag: 'Meta · Google · Shopping',
    story:
      '$6K a month of ad spend turned into a 7.5x ROAS engine and 100x business growth in a single year.',
    metric: '7.5x',
    metricLabel: 'Blended ROAS',
    metric2: '100x',
    metric2Label: 'Business growth',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'skylarr',
    href: '/case-studies/skylarr',
    client: 'Skylarr Labs',
    industry: 'PCD Pharma Franchise',
    tag: 'Website · SEO',
    story:
      'A PCD pharma site rebuilt into the sales team. 4x organic traffic, 4x enquiries, on zero paid spend.',
    metric: '4x',
    metricLabel: 'Organic traffic',
    metric2: '4x',
    metric2Label: 'SEO enquiries',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'maison-noir',
    client: 'Maison Noir',
    industry: 'Luxury D2C',
    tag: 'Brand + Content',
    story:
      'A wordless brand world for a luxury house that refused to look like anyone else. Cinematic content, an editorial site and a drop strategy that now sells out in hours.',
    metric: '+340%',
    metricLabel: 'AOV uplift',
    metric2: '92k',
    metric2Label: 'Drop waitlist',
    image: 'https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'orbit-saas',
    client: 'Orbit',
    industry: 'B2B SaaS',
    tag: 'AI SEO + LinkedIn',
    story:
      'Orbit was invisible in the AI answer layer. We rebuilt their content engine for LLM retrieval and founder-led LinkedIn, pipeline now compounds without paid spend.',
    metric: '8.1x',
    metricLabel: 'Inbound pipeline',
    metric2: '#1',
    metric2Label: 'Cited in Perplexity',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'numa-wellness',
    client: 'Numa',
    industry: 'Wellness',
    tag: 'Performance + Lifecycle',
    story:
      'A subscription wellness brand stuck on a leaky funnel. We rebuilt acquisition, onboarding and retention into a single revenue system, and it has compounded every quarter since.',
    metric: '4.7x',
    metricLabel: 'Customer LTV',
    metric2: '63%',
    metric2Label: '12-mo retention',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function CaseStudies() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // total cards width, translate to show all
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-80%']);

  return (
    <section
      id="case-studies"
      data-testid={CASE_STUDIES.section}
      ref={ref}
      className="relative"
      style={{ height: `${studies.length * 80}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-8 flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#A0A0A0] mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-[#A0A0A0]" /> Selected Work
            </div>
            <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight">
              Case studies that read like<br /><span className="text-white/40">growth thrillers.</span>
            </h2>
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hidden md:block">
            Scroll to explore →
          </span>
        </div>

        <div className="flex-1 flex items-center">
          <motion.div style={{ x }} className="flex gap-6 md:gap-8 pl-4 sm:pl-6 lg:pl-8">
            {studies.map((s, i) => {
              const CardWrapper = s.href ? Link : 'div';
              const wrapperProps = s.href ? { to: s.href } : {};
              return (
                <motion.article
                  key={s.slug}
                  data-testid={CASE_STUDIES.card(s.slug)}
                  data-cursor="hover"
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className="group relative shrink-0 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-[42vw] aspect-[4/5] md:aspect-[16/11] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]"
                >
                  <CardWrapper {...wrapperProps} className="block absolute inset-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${s.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Top label */}
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                      <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] uppercase tracking-[0.2em] border border-white/10">
                        {String(i + 1).padStart(2, '0')} · {s.industry}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-[#E11D2E]/90 text-[11px] uppercase tracking-[0.2em]">
                        {s.tag}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col gap-6">
                      <div>
                        <div className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#A0A0A0] mb-3">
                          {s.client}
                        </div>
                        <p className="font-display text-lg md:text-xl lg:text-2xl leading-snug tracking-tight text-white/95 max-w-lg">
                          {s.story}
                        </p>
                      </div>

                      <div className="flex items-end justify-between gap-4">
                        <div className="flex gap-8">
                          <div>
                            <div className="font-display text-2xl md:text-3xl text-[#F43F5E]">{s.metric}</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] mt-1">{s.metricLabel}</div>
                          </div>
                          <div>
                            <div className="font-display text-2xl md:text-3xl">{s.metric2}</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] mt-1">{s.metric2Label}</div>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-[#F43F5E] group-hover:text-white transition-colors duration-500">
                          <ArrowUpRight size={20} />
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                </motion.article>
              );
            })}
            <div className="shrink-0 w-[20vw] h-1" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
