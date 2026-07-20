import React from 'react';
import { Compass, Type, Eye, Wand2, Palette, Layers } from 'lucide-react';
import ServicePage from './ServicePage';

const data = {
  service: 'Brand Strategy',
  hero: {
    kicker: 'Service · Brand Strategy',
    headline: [
      { text: 'A brand is' },
      { text: 'an operating system,', italic: true },
      { text: 'not a logo.', accent: true },
    ],
    sub: 'Positioning, narrative and identity systems for category-defining brands, built to scale across product, marketing and culture.',
  },
  reality: {
    headline:
      'Most brands aren\'t <span class="text-white/40">misunderstood.</span><br />They\'re <span class="text-[#F43F5E]">unfocused.</span>',
    body:
      'A wordless brand world only happens when strategy, narrative and design are made by the same hands. We work small, expertly and obsessively, and the work shows.',
  },
  pillars: {
    kicker: 'How we work',
    title: 'Six disciplines.<br /><span class="text-white/40">One brand world.</span>',
    subtitle:
      'Strategy doesn\'t hand off to design here. The same expert team owns the entire arc from research to launch.',
    pillars: [
      { title: 'Brand Strategy', desc: 'Category framing, positioning and competitive geometry, the thesis everything else hangs from.', Icon: Compass },
      { title: 'Narrative & Voice', desc: 'Tone, messaging architecture and verbal identity that compounds across every touchpoint.', Icon: Type },
      { title: 'Visual Identity', desc: 'Logos, typography, colour and motion systems, built to scale, not to show off.', Icon: Palette },
      { title: 'Brand World', desc: 'Photography, art direction and brand worlds that look like nothing else in your category.', Icon: Eye },
      { title: 'Naming & Architecture', desc: 'Naming, sub-brands, product lines and the architecture that keeps it all coherent.', Icon: Wand2 },
      { title: 'Brand Systems', desc: 'Design systems, guidelines and tooling that let internal teams scale the work themselves.', Icon: Layers },
    ],
  },
  stories: {
    title: 'Brands built to be believed.<br /><span class="text-white/40">Not just seen.</span>',
    subtitle: 'Identity work is judged by what it makes possible, credibility, authority and demand that shows up before the first meeting.',
    stories: [
      {
        href: '/case-studies/profotech',
        client: 'Profotech Engineering',
        industry: 'Industrial Engineering',
        challenge: 'World-class engineering wrapped in a brand that looked like every other engineering house.',
        approach: 'Rebuilt the entire identity system, positioning, logo, website, company profile and print, so every surface spoke with one voice.',
        outcome: '20+ digital and print assets and a corporate website, and a B2B brand that finally reads as precisely as the engineering it represents.',
        metrics: [
          { v: '20+', l: 'Brand assets' },
          { v: '01', l: 'Corporate website' },
          { v: '100%', l: 'Brand consistency' },
        ],
      },
      {
        href: '/case-studies/prochem',
        client: 'Prochem Turnkey Projects',
        industry: 'B2B · Engineering',
        challenge: 'Two decades of engineering credibility that no buyer outside the room could actually see.',
        approach: 'Built a founder-led brand on LinkedIn, publishing a consistent point of view that turned quiet expertise into visible authority.',
        outcome: 'The founder became a recognised voice in the category, and the brand now carries weight long before the first meeting.',
        metrics: [
          { v: '13k+', l: 'Followers (from 4k)' },
          { v: '128k', l: 'Impressions · 12 mo' },
          { v: '0', l: 'Rupees on ads' },
        ],
      },
    ],
  },
  framework: {
    kicker: 'The Adcom Method · Brand',
    title: 'A four-phase<br /><span class="text-white/40">brand build.</span>',
    subtitle: 'Every brand engagement runs through the same operating system, calibrated to stage, ambition and category.',
    phases: [
      { n: '01', tag: 'Phase 01', title: 'Diagnose', desc: 'Founder interviews, category teardown, customer ethnography and a positioning audit. The hard look in the mirror.' },
      { n: '02', tag: 'Phase 02', title: 'Define', desc: 'Positioning, narrative architecture, voice and the one-sentence thesis everything else flows from.' },
      { n: '03', tag: 'Phase 03', title: 'Design & Build', desc: 'Identity system, brand world, photography, motion and the toolkit your team will live inside.' },
      { n: '04', tag: 'Phase 04', title: 'Deploy & Compound', desc: 'Launch, internal rollout, governance and the systems that keep the brand sharp long after we leave.' },
    ],
  },
  principles: {
    title: 'We don\'t sell logos.<br /><span class="text-white/40">We build brand systems.</span>',
    subtitle: 'Three principles run through every brand engagement. They are why our work survives ten launches, not one.',
    items: [
      { t: 'Strategy before aesthetic', d: 'A look without a thesis is decoration. We refuse to start in colour palettes.' },
      { t: 'Highly qualified hands only', d: 'No trainees near your brand. Strategy and design are made by the same operators.' },
      { t: 'Systems over assets', d: "We hand over a brand system, not a folder of logos." },
    ],
  },
  testimonial: {
    quote:
      'They wrote the strategy, designed the world, shot the campaigns and delivered a brand system our team has scaled on for two years. We have never worked with anyone better.',
    name: 'Rohan Mehta',
    role: 'Founder & CEO, Maison Noir',
    avatar: 'https://i.pravatar.cc/120?img=12',
  },
  closing: {
    headlineHtml: 'A brand is the most<br /><span class="text-[#F43F5E]">expensive thing</span><br />to get wrong.',
    body: 'We take on a small number of brand engagements each year. If you are building something with the ambition to lead a category, let\'s talk.',
  },
};

export default function BrandStrategy() {
  return <ServicePage data={data} />;
}
