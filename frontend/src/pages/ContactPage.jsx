import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Linkedin, Clock, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PrimaryContactEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';

/**
 * Non-form contact info strip — sits below the primary enquiry form.
 * Provides email, hours, WhatsApp and LinkedIn without introducing a second form.
 */
function ContactInfoStrip() {
  const items = [
    {
      Icon: Mail,
      label: 'Engagement inbox',
      value: 'hello.adcommedia@gmail.com',
      href: 'mailto:hello.adcommedia@gmail.com',
    },
    {
      Icon: MessageCircle,
      label: 'WhatsApp',
      value: '+91 83086 06641',
      href: 'https://wa.me/918308606641?text=Hi%20Adcom%20Media',
      accent: 'group-hover:text-[#25D366]',
    },
    {
      Icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/company/adcom-media',
      href: 'https://linkedin.com/company/adcom-media',
      accent: 'group-hover:text-[#0A66C2]',
    },
    {
      Icon: Clock,
      label: 'Business hours',
      value: 'Mon – Fri · 10 : 00 – 19 : 00 IST',
    },
  ];

  return (
    <section className="relative py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[rgba(255,255,255,0.08)]">
            {items.map((it) => {
              const Wrapper = it.href ? 'a' : 'div';
              const wrapperProps = it.href
                ? { href: it.href, target: it.href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' }
                : {};
              return (
                <Wrapper
                  key={it.label}
                  {...wrapperProps}
                  className="group p-6 md:p-8 flex flex-col justify-between min-h-[140px] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">
                      {it.label}
                    </div>
                    <it.Icon size={16} className={`text-white/40 ${it.accent || 'group-hover:text-white'} transition-colors`} />
                  </div>
                  <div className="mt-6 font-display text-[18px] md:text-[20px] leading-tight tracking-tight group-hover:text-white transition-colors">
                    {it.value}
                  </div>
                </Wrapper>
              );
            })}
          </div>
          <div className="border-t border-[rgba(255,255,255,0.08)] px-6 md:px-8 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] flex items-center gap-2">
              <MapPin size={12} /> Pune
            </div>
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">
              Independent · Performance-Led
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  return (
    <div className="App noise relative">
      <CustomCursor />
      <Header />
      <main>
        <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Adcom Media
            </Link>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0]">Contact</span>
          </div>
        </div>
        {/* Form first */}
        <PrimaryContactEnquiry />
        {/* Non-form contact info */}
        <ContactInfoStrip />
        {/* FAQ AFTER the form (per request) */}
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
