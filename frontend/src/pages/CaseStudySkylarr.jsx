import React from 'react';
import CaseStudyTemplate from './CaseStudyTemplate';

const data = {
  hero: {
    eyebrow: 'CASE STUDY · 05 / PCD Pharma Franchise',
    headline: `The website<br /><span class="italic font-light text-white/40">was the</span><br /><span class="text-[#F43F5E]">sales team.</span>`,
    sub: "Skylarr Labs is a PCD pharma franchise scaling across eastern India. Distributors research online before they call. We rebuilt the website and the SEO engine so the site closes the room before Skylarr enters it.",
    location: 'Pune · Eastern India rollout',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1800&q=80',
    meta: [
      { l: 'Client', v: 'Skylarr Labs' },
      { l: 'Industry', v: 'PCD Pharma Franchise' },
      { l: 'Channel', v: 'Website · Organic Search' },
      { l: 'Engagement', v: 'Redesign + SEO' },
    ],
  },
  thesis: {
    kicker: 'Our thesis',
    title: 'Distributors don&apos;t<br /><span class="text-white/40">respond to ads.</span><br />They <span class="text-[#F43F5E]">search.</span>',
    body: 'In PCD pharma, every franchise partner researches quietly, months before the first call. We built the digital surface they research on, and made sure Skylarr owned it.',
    pillars: [
      { t: 'Website Redesign',   d: 'A modern site engineered for the pharma distributor journey.' },
      { t: 'Technical SEO',      d: 'Site architecture, speed, schema and crawl paths cleaned end-to-end.' },
      { t: 'On-page SEO',        d: 'Product, monograph and franchise pages rebuilt for intent-led queries.' },
      { t: 'Content Strategy',   d: 'A content engine mapped to distributor questions, category by category.' },
      { t: 'Lead Generation',    d: 'Enquiry flows, WhatsApp handoff and CRM routing built into every page.' },
      { t: 'SEO Reporting',      d: 'A measurement layer built for the founder, not for the agency.' },
    ],
  },
  kpis: {
    kicker: 'The organic engine',
    title: 'A quieter channel.<br /><span class="text-[#F43F5E]">A compounding one.</span>',
    body: 'Every metric moved in the same direction. No paid boosts. Fully organic.',
    items: [
      { v: 4, suffix: 'x', l: 'Increase in organic traffic' },
      { v: 4, suffix: 'x', l: 'Growth in SEO enquiries' },
      { v: 57, suffix: '%', l: 'Growth in organic page views' },
      { v: 61, suffix: '%', l: 'Higher average session duration' },
      { v: 34, suffix: '%', l: 'Lower bounce rate' },
      { custom: 'East', l: 'Rollout expanded across eastern India' },
      { custom: '01', l: 'Corporate website · rebuilt end-to-end' },
      { custom: '100%', l: 'Distributor journey mapped to content' },
    ],
  },
  work: {
    kicker: 'What actually shipped',
    title: 'Website first.<br /><span class="text-white/40">Then the engine around it.</span>',
    body: 'A redesign and an SEO engine, delivered as one system — because in PCD pharma, the site is the sales team.',
    items: [
      { t: 'Website rebuild', d: 'Redesigned around the distributor journey, from monograph to enquiry.' },
      { t: 'Technical SEO', d: 'Speed, crawl, schema, site architecture — every fundamental cleaned.' },
      { t: 'On-page SEO', d: 'Product, therapy-area and franchise pages rebuilt for intent-led queries.' },
      { t: 'Content strategy', d: 'A content plan mapped to the questions distributors actually type.' },
      { t: 'Lead generation', d: 'Enquiry flows, WhatsApp handoff, CRM routing — the pipeline behind the SEO.' },
      { t: 'Measurement layer', d: 'A monthly business review the founder actually reads.' },
    ],
  },
  journey: {
    kicker: 'The distributor arc',
    title: 'From <span class="text-white/40">unfindable</span> to<br /><span class="text-[#F43F5E]">the first search result.</span>',
    steps: [
      { t: 'A distributor searches a therapy area', d: 'Skylarr shows up on page one.' },
      { t: 'Lands on a rebuilt product page', d: 'Clean, credible, monograph-first.' },
      { t: 'Reads the content library', d: 'Franchise economics, category expertise, compliance.' },
      { t: 'Enquires through the new flow', d: 'WhatsApp handoff to a real person, not a form.' },
      { t: 'Books a franchise call', d: 'Already half-decided.' },
      { t: 'Signs the franchise', d: 'And refers the next distributor in.' },
    ],
  },
  founder: {
    role: 'Leadership',
    name: 'Skylarr Labs',
    company: 'Skylarr Labs · Pune',
    tag: 'Eastern India rollout',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
    headline: 'The site is now<br /><span class="text-[#F43F5E]">closing calls.</span>',
    quote: 'Our distributors used to call us cold. Now they call us already convinced, because they have read the website. Adcom rebuilt the entire top of our funnel.',
  },
  outcome: {
    headline: '4x traffic.<br /><span class="text-white/40">4x enquiries.</span><br /><span class="text-[#F43F5E]">Zero paid spend.</span>',
    body: 'A rebuilt website, a working SEO engine and a distributor pipeline that now runs on organic search. Eastern India rollout underway, on the back of a channel that keeps compounding.',
  },
};

export default function CaseStudySkylarr() { return <CaseStudyTemplate data={data} />; }
