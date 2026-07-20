import React from 'react';
import CaseStudyTemplate from './CaseStudyTemplate';

const data = {
  hero: {
    eyebrow: 'CASE STUDY · 04 / E-commerce · Australia',
    headline: `Six thousand dollars<br />in.<br /><span class="text-[#F43F5E]">Forty-five thousand out.</span>`,
    sub: "A specialist Australian tyre e-commerce brand needed paid to actually pay. In twelve months we turned $6K/mo of ad spend into a 7.5x ROAS engine and 100x business growth.",
    location: 'Australia',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1800&q=80',
    meta: [
      { l: 'Client', v: 'Australian tyre brand · anonymous' },
      { l: 'Industry', v: 'E-commerce · Automotive' },
      { l: 'Channel', v: 'Meta · Google · Shopping' },
      { l: 'Engagement', v: '365 days' },
    ],
  },
  thesis: {
    kicker: 'Our thesis',
    title: 'Performance is<br /><span class="text-white/40">a system,</span><br />not <span class="text-[#F43F5E]">a spend.</span>',
    body: 'Category is competitive, margins are thin, buyers are searching by exact spec. We rebuilt the entire acquisition system around feed quality, intent and conversion, not budget.',
    pillars: [
      { t: 'Meta Ads',            d: 'Prospecting and retargeting rebuilt around creative rotation and audience intent.' },
      { t: 'Google Ads',          d: 'Search restructured by tyre-spec taxonomy. High-intent, high-margin queries only.' },
      { t: 'Google Shopping',     d: 'Feed cleaned, structured and optimised for AU tyre-size search behaviour.' },
      { t: 'Performance Ops',     d: 'Weekly experimentation, disciplined budget allocation, monthly business review.' },
      { t: 'CRO',                 d: 'Product pages, cart, checkout — every step in the funnel rebuilt for conversion.' },
      { t: 'Analytics',           d: 'Attribution model your team can trust. No dashboard theatre.' },
    ],
  },
  kpis: {
    kicker: '365 days on paid',
    title: 'Small budget.<br /><span class="text-[#F43F5E]">Serious return.</span>',
    body: 'Ad spend held flat. Everything else compounded.',
    items: [
      { custom: '100x', l: 'Business growth · year on year' },
      { v: 7.5, suffix: 'x', decimals: 1, l: 'Blended ROAS · Meta + Google + Shopping' },
      { custom: '$300', l: 'Average order value · AUD' },
      { v: 150, suffix: '+', l: 'Purchases · attributable to paid' },
    ],
  },
  work: {
    kicker: 'What actually shipped',
    title: 'Feed. Funnel.<br /><span class="text-white/40">Weekly iteration.</span>',
    body: 'Six workstreams, one performance rhythm, sustained across the full year.',
    items: [
      { t: 'Meta prospecting & retargeting', d: 'Concept-led creative, weekly rotation, incrementality-tested audiences.' },
      { t: 'Google Search restructure', d: 'Taxonomy rebuilt around tyre-size intent. Wasted spend eliminated.' },
      { t: 'Google Shopping feed', d: 'Titles, attributes, GTINs — every field engineered for match quality.' },
      { t: 'Landing &amp; funnel CRO', d: 'PDPs, cart flow and checkout rebuilt for AU mobile behaviour.' },
      { t: 'Attribution model', d: 'A measurement layer the founder actually reads before Monday.' },
      { t: 'Weekly experiments', d: 'Creative, audience, offer, funnel — one test lens applied every week for a year.' },
    ],
  },
  journey: {
    kicker: 'The arc',
    title: 'From <span class="text-white/40">stuck</span> to a<br /><span class="text-[#F43F5E]">7.5x engine.</span>',
    steps: [
      { t: 'Diagnosed paid + funnel', d: 'Found the leaks. Prioritised the ones that moved contribution.' },
      { t: 'Rebuilt the Shopping feed', d: 'Where the majority of tyre buyers actually start.' },
      { t: 'Restructured Search', d: 'By intent, not by keyword volume.' },
      { t: 'Layered Meta correctly', d: 'Prospecting → mid-funnel → retargeting, each earning its budget.' },
      { t: 'CRO across the funnel', d: 'PDP, cart and checkout rebuilt for mobile.' },
      { t: 'Compounded for 365 days', d: 'Weekly tests, monthly reviews, quarterly model updates.' },
    ],
  },
  outcome: {
    headline: '$6K in.<br /><span class="text-white/40">$45K out. Every month.</span><br /><span class="text-[#F43F5E]">And still compounding.</span>',
    body: 'One year, one operating model, one ad account transformed from a cost centre into the single most predictable source of new customers in the business.',
  },
  founder: null,
};

export default function CaseStudyAusTyre() { return <CaseStudyTemplate data={data} />; }
