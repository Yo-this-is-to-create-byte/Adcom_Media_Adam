import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { NAV } from '@/constants/testIds';

const navLinks = [
  { label: 'Work', id: 'work', testid: NAV.workLink, type: 'anchor' },
  { label: 'Services', id: 'services', testid: NAV.servicesLink, type: 'anchor' },
  { label: 'Case Studies', href: '/case-studies', testid: NAV.caseStudiesLink, type: 'route' },
  { label: 'About', href: '/about', testid: NAV.aboutLink, type: 'route' },
  { label: 'Process', href: '/process', testid: 'nav-process-link', type: 'route' },
  { label: 'Blog', href: '/blog', testid: 'nav-blog-link', type: 'route' },
  { label: 'Careers', href: '/careers', testid: 'nav-careers-link', type: 'route' },
  { label: 'Contact', href: '/contact', testid: NAV.contactLink, type: 'route' },
];

const servicePages = [
  { label: 'Growth Marketing', href: '/services/growth-marketing' },
  { label: 'Performance Marketing', href: '/services/performance-marketing' },
  { label: 'Brand Strategy', href: '/services/brand-strategy' },
  { label: 'AI SEO', href: '/services/ai-seo' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock body scroll when overlay open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goRoute = (href) => {
    setOpen(false);
    if (location.pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? 'backdrop-blur-xl bg-black/60 border-b border-[rgba(255,255,255,0.08)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a
            href="/"
            data-testid={NAV.logoLink}
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              if (location.pathname !== '/') {
                navigate('/');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center group"
            aria-label="Adcom Media, home"
          >
            <img
              src="https://customer-assets.emergentagent.com/job_adcom-vault/artifacts/4bimeq2z_Adcom%20Logo-03.png"
              alt="Adcom Media"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              data-testid={NAV.ctaButton}
              onClick={() => goRoute('/contact')}
              className="text-sm md:text-[15px] font-medium text-white/85 hover:text-white transition-colors"
            >
              Contact Us
            </button>

            <span className="h-5 w-px bg-white/20" aria-hidden="true" />

            <button
              data-testid={NAV.mobileToggle}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="group inline-flex items-center gap-3 text-sm md:text-[15px] font-medium text-white hover:text-[#F43F5E] transition-colors"
            >
              <span>{open ? 'Close' : 'Menu'}</span>
              <span className="relative w-5 h-4 flex flex-col justify-between items-end" aria-hidden="true">
                <span
                  className={`block h-[2px] bg-current transition-all duration-300 ${
                    open ? 'w-5 translate-y-[7px] rotate-45' : 'w-5'
                  }`}
                />
                <span
                  className={`block h-[2px] bg-current transition-all duration-300 ${
                    open ? 'w-0 opacity-0' : 'w-3'
                  }`}
                />
                <span
                  className={`block h-[2px] bg-current transition-all duration-300 ${
                    open ? 'w-5 -translate-y-[7px] -rotate-45' : 'w-4'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MenuOverlay
        open={open}
        onClose={() => setOpen(false)}
        go={go}
        goRoute={goRoute}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Full-screen Menu Overlay                                          */
/* ------------------------------------------------------------------ */

const linkVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.15 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { y: 30, opacity: 0, transition: { duration: 0.3 } },
};

function MenuOverlay({ open, onClose, go, goRoute }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl"
        >
          {/* Decorative orbs */}
          <div className="orb bg-[#E11D2E] w-[600px] h-[600px] -top-40 -right-40 opacity-25" />
          <div className="orb bg-[#7f1d1d] w-[500px] h-[500px] -bottom-40 -left-40 opacity-20" />

          <div className="relative h-full overflow-y-auto pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-20">
                {/* Primary nav */}
                <nav className="lg:col-span-7">
                  <div className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0] mb-8">
                    Navigate
                  </div>
                  <ul className="space-y-1">
                    {navLinks.map((l, i) => (
                      <motion.li
                        key={l.label}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={linkVariants}
                      >
                        <button
                          data-testid={`overlay-${l.testid}`}
                          onClick={() => (l.type === 'route' ? goRoute(l.href) : go(l.id))}
                          className="group flex items-baseline gap-4 py-3 text-left w-full"
                        >
                          <span className="text-xs font-mono text-[#A0A0A0] w-8 group-hover:text-[#F43F5E] transition-colors">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-display text-[40px] sm:text-[56px] md:text-[68px] lg:text-[80px] leading-[1.02] tracking-tighter text-white/85 group-hover:text-white transition-colors">
                            {l.label}
                          </span>
                          <ArrowUpRight
                            size={28}
                            className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#F43F5E] hidden md:block"
                          />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Right column, Services + contact */}
                <div className="lg:col-span-5 flex flex-col gap-12">
                  <motion.div
                    custom={navLinks.length}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={linkVariants}
                  >
                    <div className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0] mb-6">
                      Service Pages
                    </div>
                    <ul className="space-y-3">
                      {servicePages.map((s) => (
                        <li key={s.href}>
                          <button
                            data-testid={`overlay-service-${s.href.split('/').pop()}`}
                            onClick={() => goRoute(s.href)}
                            className="group inline-flex items-center gap-2 text-[20px] md:text-[22px] font-medium text-white/85 hover:text-white transition-colors"
                          >
                            <span className="border-b border-white/20 group-hover:border-[#F43F5E] pb-1 transition-colors">
                              {s.label}
                            </span>
                            <ArrowUpRight size={16} className="text-[#F43F5E] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </button>
                        </li>
                      ))}
                      <li className="text-sm text-[#A0A0A0] italic pt-1">
                        Six other capabilities by request.
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    custom={navLinks.length + 1}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={linkVariants}
                  >
                    <div className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0] mb-6">
                      Get in touch
                    </div>
                    <div className="space-y-3 text-[15px]">
                      <a href="mailto:hello.adcommedia@gmail.com" className="block text-white hover:text-[#F43F5E] transition-colors">
                        hello.adcommedia@gmail.com
                      </a>
                      <div className="text-[#A0A0A0]">Pune</div>
                    </div>
                    <button
                      onClick={() => goRoute('/contact')}
                      className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E11D2E] hover:bg-[#F43F5E] text-white text-sm font-semibold transition-colors"
                    >
                      Book a strategy call
                      <ArrowUpRight size={16} />
                    </button>
                  </motion.div>
                </div>
              </div>

              <motion.div
                custom={navLinks.length + 2}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={linkVariants}
                className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[#A0A0A0]"
              >
                <span>© {new Date().getFullYear()} Adcom Media</span>
                <span>Independent · Performance-Led · Pune</span>
              </motion.div>
            </div>
          </div>

          {/* Background close-on-click backdrop (clicking outside content closes) */}
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 -z-10 cursor-default"
            tabIndex={-1}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
