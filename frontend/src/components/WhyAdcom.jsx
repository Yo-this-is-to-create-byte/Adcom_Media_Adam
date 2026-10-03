import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { isPrerenderSnapshot } from '@/lib/prerenderPass';

function useCounter(target, isVisible, duration = 2200) {
  const frozen = useState(() => isPrerenderSnapshot())[0];
  const [value, setValue] = useState(frozen ? target : 0);
  useEffect(() => {
    if (frozen || !isVisible) return undefined;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.floor(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [frozen, isVisible, target, duration]);
  return value;
}

function Metric({ value, suffix, label, prefix = '', isVisible }) {
  const n = useCounter(value, isVisible);
  return (
    <div className="border-t border-[rgba(255,255,255,0.08)] py-10 md:py-12">
      <div className="font-display text-[56px] md:text-[80px] lg:text-[96px] leading-none tracking-tighter">
        {prefix}{n.toLocaleString()}{suffix}
      </div>
      <div className="mt-4 text-sm uppercase tracking-[0.25em] text-[#A0A0A0]">{label}</div>
    </div>
  );
}

export default function WhyAdcom() {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <div className="text-xs md:text-sm uppercase tracking-[0.25em] text-[#A0A0A0] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#A0A0A0]" /> Why Adcom
            </div>
            <h2 className="font-display text-[40px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight">
              We don't sell hours.<br />
              <span className="text-white/40">We engineer outcomes.</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-6">
            <p className="text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]">
              Adcom Media is a performance-driven studio of growth strategists, performance marketers,
              storytellers and engineers. We partner with category-defining brands across India,
              the Middle East and the US, and we measure ourselves by the revenue we move.
            </p>
            <p className="text-[18px] md:text-[20px] leading-relaxed text-[#A0A0A0]">
              No pods. No trainees. No vanity dashboards. Just relentless execution and
              clean numbers in the only place that matters, your P&amp;L.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10">
          <Metric isVisible={isVisible} value={10} suffix="+" label="Brands Scaled" />
          <Metric isVisible={isVisible} value={4} suffix="+ yrs" label="In The Trenches" />
          <Metric isVisible={isVisible} value={120} suffix="Cr+" label="Revenue Generated" />
          <Metric isVisible={isVisible} value={48} suffix="k+" label="Leads Delivered" />
        </div>
      </div>
    </section>
  );
}
