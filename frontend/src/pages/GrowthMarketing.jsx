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
        client: 'Halo D2C',
        industry: 'Beauty',
        challenge: 'Spend had tripled, revenue had not. The team couldn\'t separate creative fatigue from channel saturation.',
        approach: 'Rebuilt the creative system around problem-led concepts, re-modelled media against incrementality, and rewired post-click experiences by intent stage.',
        outcome: 'Repeatable growth without ROAS decay, and a creative pipeline that compounds learning instead of burning it.',
        metrics: [
          { v: '+240%', l: 'Revenue growth' },
          { v: '3.6x', l: 'Blended ROAS' },
          { v: '−31%', l: 'Blended CAC' },
        ],
      },
      {
        client: 'Ondine Wellness',
        industry: 'Subscription DTC',
        challenge: 'A leaky funnel and a fragile retention curve. New customer acquisition was outrunning lifecycle.',
        approach: 'Re-architected onboarding, built a lifecycle journey by RFM segment and ran weekly experiments on offer and creative.',
        outcome: 'LTV compounded quarter over quarter and the team finally had a forecast they could defend.',
        metrics: [
          { v: '4.7x', l: 'Customer LTV' },
          { v: '63%', l: '12-mo retention' },
          { v: '+92%', l: 'Subscription rev' },
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
