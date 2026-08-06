import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';
import { FOOTER } from '@/constants/testIds';

const cols = [
  {
    title: 'Studio',
    links: [
      { label: 'Work', href: '#work' },
      { label: 'Services', href: '#services' },
      { label: 'Process', href: '/process' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Growth Marketing', href: '/services/growth-marketing' },
      { label: 'Performance', href: '/services/performance-marketing' },
      { label: 'Brand Strategy', href: '/services/brand-strategy' },
      { label: 'AI SEO', href: '/services/ai-seo' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'hello.adcommedia@gmail.com', href: 'mailto:hello.adcommedia@gmail.com' },
      { label: 'Book a call', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '#press' },
    ],
  },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const adamClicks = useRef(0);
  const adamTimer = useRef(null);

  // Mobile easter-egg trigger: 11 taps on the copyright wordmark opens ADAM
  const handleAdamTaps = () => {
    adamClicks.current += 1;
    clearTimeout(adamTimer.current);
    adamTimer.current = setTimeout(() => { adamClicks.current = 0; }, 3000);
    if (adamClicks.current >= 11) {
      adamClicks.current = 0;
      window.dispatchEvent(new Event('adam:open'));
    }
  };

  const handleClick = (e, href) => {
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
    e.preventDefault();
    if (href.startsWith('/')) {
      if (location.pathname === href) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(href);
      }
      return;
    }
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (location.pathname !== '/') {
        navigate(`/#${id}`);
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="relative pt-32 pb-12 border-t border-[rgba(255,255,255,0.08)] overflow-hidden bg-black">
      {/* Architectural line details */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E11D2E]/50 to-transparent" />
      <div className="absolute inset-y-0 left-1/4 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent hidden md:block" />
      <div className="absolute inset-y-0 right-1/4 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent hidden md:block" />

      {/* Subtle red lighting from below */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at bottom, rgba(225,29,46,0.18) 0%, transparent 65%)',
        }}
      />

      {/* Three columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top kicker bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-16 border-b border-[rgba(255,255,255,0.08)]">
          <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0] flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] animate-pulse" />
            Independent · Performance-Led · Built in India
          </div>
          <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#A0A0A0]">
            EST · 2025, Pune
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 py-20">
          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#A0A0A0] mb-8">
                {col.title}
              </div>
              <ul className="space-y-5 md:space-y-7">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={(e) => handleClick(e, l.href)}
                      className="group inline-flex items-center gap-2 text-[18px] md:text-[20px] font-display tracking-tight text-white/85 hover:text-white transition-colors"
                    >
                      {l.label}
                      <ArrowUpRight
                        size={16}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#F43F5E]"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Giant outlined ADCOM MEDIA, full viewport width, fits on one line */}
      <div className="relative pt-16 pb-8 overflow-hidden w-full">
        <div
          data-testid={FOOTER.logo}
          aria-label="Adcom Media"
          className="font-display tracking-tighter leading-[0.85] select-none text-center whitespace-nowrap px-2"
          style={{
            fontSize: 'clamp(28px, 11vw, 220px)',
            letterSpacing: '-0.04em',
            WebkitTextStroke: '1px rgba(255,255,255,0.85)',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            textShadow: '0 0 80px rgba(225,29,46,0.2)',
          }}
        >
          ADCOM&nbsp;MEDIA
        </div>
        {/* Soft red underline glow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-[#E11D2E]/70 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Mobile-only ADAM activation button — discreet, on-brand */}
        <div className="md:hidden flex justify-center mt-10">
          <button
            type="button"
            data-testid="footer-adam-mobile-activate"
            onClick={() => window.dispatchEvent(new Event('adam:open'))}
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.14)] bg-white/[0.02] backdrop-blur-sm active:scale-[0.97] transition-transform"
          >
            <span className="relative flex items-center justify-center w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D2E]" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/70 group-active:text-white">
              Activate ADAM
            </span>
          </button>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)]">
          <div
            className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0] cursor-default select-none"
            onClick={handleAdamTaps}
            data-testid="footer-adam-trigger"
          >
            © {new Date().getFullYear()} Adcom Media. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <SocialLink testid={FOOTER.socialTwitter} href="https://twitter.com" label="Twitter">
              <Twitter size={15} />
            </SocialLink>
            <SocialLink testid={FOOTER.socialLinkedin} href="https://linkedin.com" label="LinkedIn">
              <Linkedin size={15} />
            </SocialLink>
            <SocialLink testid={FOOTER.socialInstagram} href="https://instagram.com" label="Instagram">
              <Instagram size={15} />
            </SocialLink>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0]">
            Crafted with intent · Pune
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ testid, href, label, children }) {
  return (
    <a
      data-testid={testid}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center hover:bg-white hover:text-black transition-colors"
    >
      {children}
    </a>
  );
}
