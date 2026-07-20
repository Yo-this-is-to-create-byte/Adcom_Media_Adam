import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import { PrimaryContactEnquiry } from '@/components/enquiries';
import FAQ from '@/components/FAQ';
import CustomCursor from '@/components/CustomCursor';

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
        <FAQ />
        <PrimaryContactEnquiry />
        <Contact variant="page" headline={`Let's build\nsomething\nthat grows.`} kicker="Engagement intake · Q1 open" />
      </main>
      <Footer />
    </div>
  );
}
