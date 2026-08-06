import React, { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlogEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';
import { apiGet } from '@/lib/api';

function renderParagraph(line, i) {
  if (line.startsWith('## ')) {
    return (
      <h2 key={i} className="font-display text-[28px] md:text-[36px] lg:text-[40px] leading-tight tracking-tight mt-12 mb-4">
        {line.slice(3)}
      </h2>
    );
  }
  const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
    /^\*\*[^*]+\*\*$/.test(p)
      ? <strong key={j} className="text-white font-semibold">{p.slice(2, -2)}</strong>
      : <React.Fragment key={j}>{p}</React.Fragment>
  );
  return (
    <p key={i} className="text-[17px] md:text-[19px] leading-[1.7] text-[#D4D4D4] mb-6">
      {parts}
    </p>
  );
}

function normalize(p) {
  return { ...p, readTime: p.read_time || p.readTime };
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    let live = true;
    (async () => {
      try {
        const [p, all] = await Promise.all([
          apiGet(`/blogs/${slug}`),
          apiGet('/blogs'),
        ]);
        if (!live) return;
        setPost(normalize(p));
        setRelated(all.filter((x) => x.slug !== p.slug).slice(0, 2).map(normalize));
        setStatus('ok');
      } catch {
        if (!live) return;
        setStatus('notfound');
      }
    })();
    return () => { live = false; };
  }, [slug]);

  if (status === 'notfound') return <Navigate to="/blog" replace />;
  if (status === 'loading' || !post) {
    return (
      <div className="App noise relative min-h-screen bg-black">
        <CustomCursor />
        <Header />
        <div className="pt-40 text-center text-white/40 text-sm">Loading essay…</div>
      </div>
    );
  }

  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        <article>
          <header className="relative pt-32 pb-12 md:pt-40 md:pb-16">
            <div className="orb bg-[#E11D2E] w-[500px] h-[500px] -top-40 -right-40 opacity-25" />
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <Link to="/blog" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Back to journal
                </Link>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0] mb-6">
                <span className="text-[#F43F5E]">{post.category}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>{post.readTime}</span>
              </div>
              <h1 className="font-display text-[40px] sm:text-[56px] md:text-[68px] lg:text-[80px] leading-[1.02] tracking-tighter">
                {post.title}
              </h1>
              <div className="mt-10 flex items-center gap-4">
                <img src={post.author.avatar} alt="" className="w-12 h-12 rounded-full object-cover border border-[rgba(255,255,255,0.1)]" />
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-[#A0A0A0]">{post.author.role}</div>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-[16/9] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] relative"
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${post.cover})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          </div>

          <div className="relative py-16 md:py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-[19px] md:text-[21px] leading-[1.5] tracking-tight text-white/95 mb-10 font-display">
                {post.excerpt}
              </div>
              {(post.body || []).map(renderParagraph)}
            </div>
          </div>
        </article>

        {related.length > 0 && (
        <section className="relative py-16 md:py-24 border-t border-[rgba(255,255,255,0.08)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] mb-10 flex items-center gap-3">
              <span className="w-8 h-px bg-[#A0A0A0]" /> More to read
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {related.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
                  <article className="rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                    <div className="aspect-[16/10] overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center group-hover:scale-[1.04] transition-transform duration-700" style={{ backgroundImage: `url(${p.cover})` }} />
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0] mb-3">
                        <span className="text-[#F43F5E]">{p.category}</span>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span>{p.readTime}</span>
                      </div>
                      <h3 className="font-display text-[22px] md:text-[26px] leading-[1.1] tracking-tight group-hover:text-[#F43F5E] transition-colors">
                        {p.title}
                      </h3>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/80 group-hover:text-white">
                        Read essay <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
        )}

        <BlogEnquiry />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
