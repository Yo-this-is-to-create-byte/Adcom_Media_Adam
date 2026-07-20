import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { BlogEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';
import { posts } from './blogPosts';

export default function Blog() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const [feature, ...rest] = posts;

  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        {/* HERO */}
        <section className="relative min-h-[70vh] w-full flex flex-col justify-center overflow-hidden pt-24">
          <div className="orb bg-[#E11D2E] w-[500px] h-[500px] -top-40 -left-40 opacity-30" />
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-16">
            <div className="flex items-center gap-3 mb-8">
              <Link to="/" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Adcom Media
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Journal</span>
            </div>
            <h1 className="font-display text-[56px] sm:text-[80px] md:text-[100px] lg:text-[120px] leading-[0.9] tracking-tighter">
              <span className="block">Notes from</span>
              <span className="block italic font-light text-white/40">the studio.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]">
              Essays on growth, brand, performance and the operating models behind the work. Written by the same hands that ship the work.
            </p>
          </div>
        </section>

        {/* FEATURED POST */}
        <section className="relative pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to={`/blog/${feature.slug}`} data-testid={`blog-card-${feature.slug}`} className="group block">
              <article className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                <div className="lg:col-span-7 aspect-[4/3] lg:aspect-auto rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] relative">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.04] transition-transform duration-700"
                       style={{ backgroundImage: `url(${feature.cover})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-6 left-6 right-6 flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-[#E11D2E]/90 text-[11px] uppercase tracking-[0.2em]">
                      Featured · {feature.category}
                    </span>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col justify-end">
                  <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0] mb-4">
                    <span>{feature.date}</span>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span>{feature.readTime}</span>
                  </div>
                  <h2 className="font-display text-[36px] md:text-[44px] lg:text-[52px] leading-[1.05] tracking-tight group-hover:text-[#F43F5E] transition-colors">
                    {feature.title}
                  </h2>
                  <p className="mt-6 text-[16px] md:text-[18px] text-[#A0A0A0] leading-relaxed max-w-md">
                    {feature.excerpt}
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <img src={feature.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-[rgba(255,255,255,0.1)]" />
                    <div>
                      <div className="text-sm font-medium">{feature.author.name}</div>
                      <div className="text-xs text-[#A0A0A0]">{feature.author.role}</div>
                    </div>
                    <ArrowUpRight size={20} className="ml-auto text-white/40 group-hover:text-[#F43F5E] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>

        {/* MORE POSTS */}
        <section className="relative py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-10 flex items-center gap-3">
              <span className="w-8 h-px bg-[#A0A0A0]" /> More essays
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {rest.map((p, i) => (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                >
                  <Link to={`/blog/${p.slug}`} data-testid={`blog-card-${p.slug}`} className="group block">
                    <article className="rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                      <div className="aspect-[16/10] overflow-hidden">
                        <div className="w-full h-full bg-cover bg-center group-hover:scale-[1.04] transition-transform duration-700"
                             style={{ backgroundImage: `url(${p.cover})` }} />
                      </div>
                      <div className="p-6 md:p-8">
                        <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0] mb-4">
                          <span className="text-[#F43F5E]">{p.category}</span>
                          <span className="w-1 h-1 rounded-full bg-white/30" />
                          <span>{p.date}</span>
                          <span className="w-1 h-1 rounded-full bg-white/30" />
                          <span>{p.readTime}</span>
                        </div>
                        <h3 className="font-display text-[24px] md:text-[28px] lg:text-[32px] leading-[1.1] tracking-tight group-hover:text-[#F43F5E] transition-colors">
                          {p.title}
                        </h3>
                        <p className="mt-4 text-[15px] text-[#A0A0A0] leading-relaxed">
                          {p.excerpt}
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                          <img src={p.author.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-[rgba(255,255,255,0.1)]" />
                          <div className="text-sm">{p.author.name}</div>
                          <ArrowUpRight size={18} className="ml-auto text-white/40 group-hover:text-[#F43F5E] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <BlogEnquiry />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
