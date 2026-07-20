import React from 'react';
import { TrendingUp, Map, Layers, Rocket, BarChart3, Repeat } from 'lucide-react';
import ServicePage from './ServicePage';

const data = {
  service: 'Growth Marketing',
  hero: {
    kicker: 'Service · Growth Marketing',
    headline: [
      { text: 'Growth' },
      { text: "isn't a tactic.", italic: true },
      { text: "It's a system.", accent: true },
    ],
    sub: (
      <>
        Full-funnel growth marketing for ambitious brands, strategy, creative,
        media, lifecycle and analytics, operating as one compounding system.
      </>
    ),
  },
  reality: {
    headline:
      'Most growth plateaus aren\'t a <span class="text-white/40">channel problem.</span><br />They\'re a <span class="text-[#F43F5E]">model problem.</span>',
    body:
      'Brands hit a ceiling when they treat acquisition, retention and creative as separate teams chasing separate KPIs. We rebuild growth as a single operating model where every input ties back to one number: contribution profit.',
  },
  pillars: {
    kicker: 'How we operate',
    title: 'Six disciplines.<br /><span class="text-white/40">One growth engine.</span>',
    subtitle:
      'No silos, no platform tribalism. Expert operators run strategy, creative, media and lifecycle as one team, and one P&L.',
    pillars: [
      { title: 'Growth Strategy', desc: 'The thesis behind every rupee, channels, segments, unit economics and the model that ties them together.', Icon: Map },
      { title: 'Creative Engine', desc: 'Concept-led, modular creative built to compound, not creative that burns out in a week.', Icon: Layers },
      { title: 'Paid Acquisition', desc: 'Expert-led media buying across Meta, Google, YouTube and emerging surfaces, run for incrementality.', Icon: Rocket },
      { title: 'Lifecycle & Retention', desc: 'Email, SMS, CRM and onboarding flows that turn first purchases into a compounding LTV curve.', Icon: Repeat },
      { title: 'Analytics & Measurement', desc: 'An attribution model your CFO trusts and your media buyer can act on. No dashboard theatre.', Icon: BarChart3 },
      { title: 'Experimentation OS', desc: 'A weekly testing cadence across creative, audience, funnel and offer, with disciplined readouts.', Icon: TrendingUp },
    ],
  },
  stories: {
    title: 'Stories first.<br /><span class="text-white/40">Numbers second.</span>',
    subtitle: 'A handful of recent growth engagements. Categories change, the operating model does not.',
    stories: [
      {
        href: '/case-studies/sharma-furniture',
        client: 'Sharma Furnituree',
        industry: 'Furniture Retail',
        challenge: 'A trusted local furniture house that was invisible online, chosen in-store but never found before the visit.',
        approach: 'Rebuilt local discovery, search visibility and the on-site experience so customers arrive already trusting the brand.',
        outcome: 'Qualified enquiries climbed and the brand now gets discovered, trusted and shortlisted weeks before a customer walks in.',
        metrics: [
          { v: '+26%', l: 'Qualified enquiries' },
          { v: '18+', l: 'First-page rankings' },
          { v: '100%', l: 'Local intent captured' },
        ],
      },
      {
        href: '/case-studies/aus-tyre',
        client: 'Australian Tyre Brand',
        industry: 'E-commerce · Automotive',
        challenge: '$6K a month of paid spend that wasn\'t paying. Thin margins, brutal competition, buyers searching by exact spec.',
        approach: 'Rebuilt acquisition around feed quality and intent, restructured Search and Shopping, and rebuilt the funnel end-to-end.',
        outcome: 'Spend held flat while everything compounded. Paid became the most predictable source of new customers in the business.',
        metrics: [
          { v: '7.5x', l: 'Blended ROAS' },
          { v: '100x', l: 'Business growth' },
          { v: '150+', l: 'Attributable purchases' },
        ],
      },
      {
        href: '/case-studies/prochem',
        client: 'Prochem Turnkey Projects',
        industry: 'B2B · Engineering',
        challenge: 'A twenty-year-old engineering house with deep expertise and no digital presence in front of the buyers who mattered.',
        approach: 'Built a founder-led LinkedIn engine publishing category expertise that plant heads and procurement actually follow. No paid campaigns.',
        outcome: 'Became the feed every plant head in India quietly follows, generating inbound conversations no cold outreach could buy.',
        metrics: [
          { v: '13k+', l: 'Followers (from 4k)' },
          { v: '128k', l: 'Impressions · 12 mo' },
          { v: '0', l: 'Rupees on ads' },
        ],
      },
    ],
  },
  framework: {
    kicker: 'The Adcom Method · Growth',
    title: 'A four-phase<br /><span class="text-white/40">growth engine.</span>',
    subtitle:
      'Every engagement runs through the same proprietary system, calibrated to your category, stage and ambition.',
    phases: [
      { n: '01', tag: 'Phase 01', title: 'Diagnose', desc: 'Customer interviews, data audits, model teardown and a brutally honest growth diagnostic. The truth before the plan.' },
      { n: '02', tag: 'Phase 02', title: 'Define', desc: 'Positioning, channel mix, unit economics and a 90-day growth model, defensible to your board.' },
      { n: '03', tag: 'Phase 03', title: 'Design & Build', desc: 'Creative systems, lifecycle journeys, landing experiences and measurement infrastructure, built in-house.' },
      { n: '04', tag: 'Phase 04', title: 'Deploy & Compound', desc: 'Weekly experimentation, monthly business reviews, quarterly model updates. The system that compounds.' },
    ],
  },
  principles: {
    title: 'We don\'t sell tactics.<br /><span class="text-white/40">We engineer outcomes.</span>',
    subtitle: 'Three principles run through every growth engagement. They are not slogans, they are why our work outlasts the retainer.',
    items: [
      { t: 'Model before money', d: 'No budget moves until we can explain, in your numbers, why it will compound.' },
      { t: 'Creative before optimisation', d: "You can't optimise your way out of a creative problem. We start there." },
      { t: 'Systems before scaling', d: 'We scale what we can measure, and we measure what actually drives contribution profit.' },
    ],
  },
  testimonial: {
    quote:
      'We hired Adcom to fix paid. They quietly rebuilt our entire growth model, and eighteen months on, the operating system they left behind is the reason our growth is still compounding.',
    name: 'Anika Sharma',
    role: 'VP Growth, Finova',
    avatar: 'https://i.pravatar.cc/120?img=47',
  },
  closing: {
    headlineHtml: 'Growth isn\'t a campaign.<br /><span class="text-[#F43F5E]">It\'s a commitment.</span>',
    body: 'We open a small number of high-impact growth engagements each quarter. If you are building something serious, let\'s talk.',
  },
};

export default function GrowthMarketing() {
  return <ServicePage data={data} />;
}
