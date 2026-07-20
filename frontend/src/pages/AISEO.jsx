import React from 'react';
import { Bot, BookOpen, Database, Search, Sparkles, BarChart3 } from 'lucide-react';
import ServicePage from './ServicePage';

const data = {
  service: 'AI SEO',
  hero: {
    kicker: 'Service · AI SEO',
    headline: [
      { text: 'Be the answer,' },
      { text: 'not just', italic: true },
      { text: 'a result.', accent: true },
    ],
    sub: 'AI SEO and answer-engine optimisation for brands that want to be cited inside ChatGPT, Perplexity, Gemini, Claude and Google\'s AI Overviews.',
  },
  reality: {
    headline:
      'Search isn\'t a <span class="text-white/40">page anymore.</span><br />It\'s an <span class="text-[#F43F5E]">answer.</span>',
    body:
      'LLMs are quietly rewriting where traffic comes from. The brands that win the next decade are the ones cited inside the answer, not the ones fighting for rank ten on a fading SERP.',
  },
  pillars: {
    kicker: 'How we operate',
    title: 'Six disciplines.<br /><span class="text-white/40">One answer engine.</span>',
    subtitle: 'AI SEO is not classic SEO with prompts taped on. It is a different operating model, and expert operators run all of it.',
    pillars: [
      { title: 'Answer Engine Strategy', desc: 'Map the queries and prompts your buyers are actually asking inside LLMs, not just Google.', Icon: Bot },
      { title: 'Editorial Authority', desc: 'Long-form, original, citable editorial that LLMs retrieve and credit, not commodity blog content.', Icon: BookOpen },
      { title: 'Knowledge Graph & Schema', desc: 'Structured data, entity hygiene and schema that makes your brand machine-legible.', Icon: Database },
      { title: 'Classic SEO', desc: 'Technical SEO, topical authority and link relevance, the foundation answer engines still respect.', Icon: Search },
      { title: 'Generative Content Ops', desc: 'In-house content engines that pair AI velocity with expert editorial judgement.', Icon: Sparkles },
      { title: 'Answer-Layer Analytics', desc: 'Measurement for citations, retrievals and AI-driven traffic, built before everyone realises it matters.', Icon: BarChart3 },
    ],
  },
  stories: {
    title: 'Cited inside the answer.<br /><span class="text-white/40">Quoted by the agent.</span>',
    subtitle: 'A handful of recent AI SEO engagements. Across categories, the operating model holds.',
    stories: [
      {
        client: 'Orbit',
        industry: 'B2B SaaS',
        challenge: 'Invisible in AI answers. Pipeline depended entirely on paid, and a slowly fading SERP.',
        approach: 'Rebuilt the content engine for LLM retrieval, restructured entity & schema, founder-led LinkedIn for source authority.',
        outcome: 'Now cited inside the answer across Perplexity, ChatGPT and Gemini. Inbound pipeline compounds without paid spend.',
        metrics: [
          { v: '8.1x', l: 'Inbound pipeline' },
          { v: '#1', l: 'Cited in Perplexity' },
          { v: '−54%', l: 'Cost per SQL' },
        ],
      },
      {
        client: 'Atlas Pay',
        industry: 'Fintech',
        challenge: 'A regulated category where trust is the moat, and LLMs were citing competitors as defaults.',
        approach: 'Built a citable editorial library, programmatic answer pages and a schema layer that made the product machine-legible.',
        outcome: 'Default citation across the category\'s most-asked LLM prompts, and demonstrable inbound from AI surfaces.',
        metrics: [
          { v: '+340%', l: 'AI-driven sessions' },
          { v: '12x', l: 'Brand citations' },
          { v: '#1', l: 'Category answer' },
        ],
      },
    ],
  },
  framework: {
    kicker: 'The Adcom Method · AI SEO',
    title: 'A four-phase<br /><span class="text-white/40">answer engine.</span>',
    subtitle: 'A proprietary operating model for the post-Google search world, calibrated to your category and buyer.',
    phases: [
      { n: '01', tag: 'Phase 01', title: 'Diagnose', desc: 'Audit LLM citations, prompt landscape, schema and editorial authority. Find the gaps the SERP can\'t see.' },
      { n: '02', tag: 'Phase 02', title: 'Define', desc: 'Prompt strategy, content thesis, entity model and the queries we will win, across both Google and LLMs.' },
      { n: '03', tag: 'Phase 03', title: 'Design & Build', desc: 'Editorial production, schema, programmatic answer pages and the measurement layer that proves it works.' },
      { n: '04', tag: 'Phase 04', title: 'Deploy & Compound', desc: 'Continuous publishing, prompt monitoring and citation tracking, week after week.' },
    ],
  },
  principles: {
    title: 'We don\'t chase rankings.<br /><span class="text-white/40">We engineer citations.</span>',
    subtitle: 'Three principles run through every AI SEO engagement, and they are why our work survives every model update.',
    items: [
      { t: 'Editorial > volume', d: 'One citable piece beats fifty forgettable ones. LLMs reward authority, not output.' },
      { t: 'Entities > keywords', d: 'Your brand needs to be a thing the machine understands, not a string it crawls.' },
      { t: 'Both engines, one model', d: 'Classic SEO and AI SEO are not separate teams here. They run as one system.' },
    ],
  },
  testimonial: {
    quote:
      'Adcom understood the answer layer before any other agency we spoke to. Eighteen months in, Perplexity is now a real channel for us, not a science experiment.',
    name: 'Priya Kapoor',
    role: 'CMO, Orbit',
    avatar: 'https://i.pravatar.cc/120?img=32',
  },
  closing: {
    headlineHtml: 'The next decade of search<br /><span class="text-[#F43F5E]">is already here.</span>',
    body: 'We take on a small number of AI SEO engagements each quarter. If you want to be cited inside the answer, let\'s talk.',
  },
};

export default function AISEO() {
  return <ServicePage data={data} />;
}
