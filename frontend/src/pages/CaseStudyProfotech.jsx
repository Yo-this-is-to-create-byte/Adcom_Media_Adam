import React from 'react';
import CaseStudyTemplate from './CaseStudyTemplate';

const data = {
  hero: {
    eyebrow: 'CASE STUDY · 03 / Industrial Engineering',
    headline: `An engineering house<br /><span class="italic font-light text-white/40">that finally looked</span><br />as <span class="text-[#F43F5E]">precise</span> as its work.`,
    sub: "Profotech Engineering delivers industrial precision. Their brand didn't. We rebuilt every touchpoint, digital and print, so the identity finally matched the engineering.",
    location: 'Pune, India',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=80',
    meta: [
      { l: 'Client', v: 'Profotech Engineering' },
      { l: 'Industry', v: 'Industrial Engineering' },
      { l: 'Scope', v: 'Brand · Digital · Print' },
      { l: 'Engagement', v: 'Full identity build' },
    ],
  },
  thesis: {
    kicker: 'Our thesis',
    title: 'A brand is not a logo.<br /><span class="text-white/40">It&apos;s a system.</span>',
    body: 'In B2B engineering, credibility is earned in the details, on the letterhead, in the deck, on the site, on the shop-floor signage. We built the system, then every asset.',
    pillars: [
      { t: 'Brand Strategy',   d: 'Positioning, narrative and a single-line thesis every asset flows from.' },
      { t: 'Logo & Identity',  d: 'A modern engineering mark and the visual system it lives inside.' },
      { t: 'Website',          d: 'A corporate site engineered for procurement and plant heads.' },
      { t: 'Company Profile',  d: 'A profile document that closes tenders before the meeting starts.' },
      { t: 'Print Marketing',  d: 'Brochures, catalogues and campaign print built to the same standard.' },
      { t: 'Corporate Kit',    d: 'Stationery, decks, signage, kits, every surface, one voice.' },
    ],
  },
  kpis: {
    kicker: 'The output',
    title: 'One brand.<br /><span class="text-[#F43F5E]">Every surface.</span>',
    body: 'A complete identity system, delivered end-to-end, ready to scale.',
    items: [
      { v: 20, suffix: '+', l: 'Brand assets designed across digital &amp; print' },
      { custom: '01', l: 'Corporate website delivered · engineered for procurement' },
      { v: 15, suffix: '+', l: 'Print marketing deliverables · brochures, decks, kits' },
      { custom: '100%', l: 'Brand consistency across every touchpoint' },
    ],
  },
  work: {
    kicker: 'What actually shipped',
    title: 'The full identity build.<br /><span class="text-white/40">End-to-end.</span>',
    body: 'Six workstreams, one operating rhythm, delivered in a single engagement.',
    items: [
      { t: 'Positioning & strategy', d: 'A defensible thesis for a category where every competitor sounds the same.' },
      { t: 'Logo &amp; visual identity', d: 'Mark, typography, colour, motion, and the guardrails that keep it consistent.' },
      { t: 'Corporate website', d: 'Fast, credible, procurement-friendly. Built to convert enquiries, not to win awards.' },
      { t: 'Company profile &amp; brochures', d: 'Editorial-grade documents that do the closing work between meetings.' },
      { t: 'Print marketing', d: 'Campaign print, exhibition collateral and product literature to a single standard.' },
      { t: 'Corporate stationery', d: 'Letterheads, decks, signage, kits — the details a plant head silently notices.' },
    ],
  },
  journey: {
    kicker: 'The arc',
    title: 'From <span class="text-white/40">inconsistent</span><br /><span class="text-[#F43F5E]">to unmistakable.</span>',
    steps: [
      { t: 'Diagnosed the identity gap', d: 'Legacy assets audited across digital and print.' },
      { t: 'Repositioned the brand', d: 'Narrative sharpened for the B2B engineering buyer.' },
      { t: 'Rebuilt the identity system', d: 'Mark, type, colour and motion, unified.' },
      { t: 'Shipped the website', d: 'Corporate site tuned for procurement.' },
      { t: 'Delivered the print system', d: '15+ deliverables to a single standard.' },
      { t: 'Rolled out corporate kit', d: 'Every surface, quietly consistent.' },
    ],
  },
  founder: {
    role: 'Leadership',
    name: 'Profotech Leadership',
    company: 'Profotech Engineering',
    tag: 'B2B · Industrial',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    headline: 'Precision.<br /><span class="text-[#F43F5E]">Finally visible.</span>',
    quote: 'We were an engineering house that looked like every other engineering house. Adcom rebuilt the entire brand so the identity finally matched the standard of our work.',
  },
  outcome: {
    headline: 'The engineering was already precise.<br /><span class="text-white/40">Now the brand is too.</span>',
    body: 'A complete identity transformation, 20+ digital and print assets, one corporate website, and a B2B brand that finally reads as credibly as the engineering it represents.',
  },
};

export default function CaseStudyProfotech() { return <CaseStudyTemplate data={data} />; }
