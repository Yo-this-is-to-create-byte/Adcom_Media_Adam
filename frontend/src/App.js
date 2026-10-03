import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { trackPageView } from '@/lib/analytics';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import CaseStudies from '@/components/CaseStudies';
import WhyAdcom from '@/components/WhyAdcom';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import FAQ from '@/components/FAQ';
import WhatsAppButton from '@/components/WhatsAppButton';
import SecretInfoButton from '@/components/SecretInfoButton';
import AdamProtocol from '@/components/adam/AdamProtocol';
import AdamBadge from '@/components/adam/AdamBadge';
import PerformanceMarketing from '@/pages/PerformanceMarketing';
import GrowthMarketing from '@/pages/GrowthMarketing';
import BrandStrategy from '@/pages/BrandStrategy';
import AISEO from '@/pages/AISEO';
import GoogleAds from '@/pages/GoogleAds';
import MetaAds from '@/pages/MetaAds';
import SEO from '@/pages/SEO';
import SocialMediaMarketing from '@/pages/SocialMediaMarketing';
import WebsiteDevelopment from '@/pages/WebsiteDevelopment';
import LinkedInMarketing from '@/pages/LinkedInMarketing';
import B2BMarketing from '@/pages/B2BMarketing';
import Industrial3D from '@/pages/Industrial3D';
import IndustryFurniture from '@/pages/IndustryFurniture';
import IndustryPharma from '@/pages/IndustryPharma';
import IndustryManufacturing from '@/pages/IndustryManufacturing';
import IndustryB2B from '@/pages/IndustryB2B';
import IndustryEcommerce from '@/pages/IndustryEcommerce';
import LocationPune from '@/pages/LocationPune';
import About from '@/pages/About';
import ProcessPage from '@/pages/Process';
import CaseStudiesPage from '@/pages/CaseStudiesPage';
import Careers from '@/pages/Careers';
import ContactPage from '@/pages/ContactPage';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import CaseStudySharmaFurniture from '@/pages/CaseStudySharmaFurniture';
import CaseStudyProchem from '@/pages/CaseStudyProchem';
import CaseStudyProfotech from '@/pages/CaseStudyProfotech';
import CaseStudyAusTyre from '@/pages/CaseStudyAusTyre';
import CaseStudySkylarr from '@/pages/CaseStudySkylarr';
import AdminPanel from '@/pages/admin/AdminPanel';
import Login from '@/pages/Login';
import GoogleAuthDone from '@/pages/GoogleAuthDone';
import Seo from '@/hooks/useSEO';
import PrerenderReady from '@/components/PrerenderReady';

function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  return null;
}

function Landing() {
  return (
    <div className="App noise relative">
      <Seo pageKey="home" />
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <CaseStudies />
        <WhyAdcom />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

function AppRouter() {
  return (
    <>
      <AnalyticsTracker />
      <WhatsAppButton />
      <SecretInfoButton />
      <AdamProtocol />
      <AdamBadge />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/services/performance-marketing" element={<PerformanceMarketing />} />
        <Route path="/services/growth-marketing" element={<GrowthMarketing />} />
        <Route path="/services/brand-strategy" element={<BrandStrategy />} />
        <Route path="/services/ai-seo" element={<AISEO />} />
        <Route path="/services/google-ads" element={<GoogleAds />} />
        <Route path="/services/meta-ads" element={<MetaAds />} />
        <Route path="/services/seo" element={<SEO />} />
        <Route path="/services/social-media-marketing" element={<SocialMediaMarketing />} />
        <Route path="/services/website-development" element={<WebsiteDevelopment />} />
        <Route path="/services/linkedin-marketing" element={<LinkedInMarketing />} />
        <Route path="/services/b2b-marketing" element={<B2BMarketing />} />
        <Route path="/services/industrial-3d" element={<Industrial3D />} />
        <Route path="/industries/furniture" element={<IndustryFurniture />} />
        <Route path="/industries/pharma" element={<IndustryPharma />} />
        <Route path="/industries/manufacturing" element={<IndustryManufacturing />} />
        <Route path="/industries/b2b" element={<IndustryB2B />} />
        <Route path="/industries/ecommerce" element={<IndustryEcommerce />} />
        <Route path="/locations/pune" element={<LocationPune />} />
        <Route path="/about" element={<About />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/case-studies/sharma-furniture" element={<CaseStudySharmaFurniture />} />
        <Route path="/case-studies/prochem" element={<CaseStudyProchem />} />
        <Route path="/case-studies/profotech" element={<CaseStudyProfotech />} />
        <Route path="/case-studies/aus-tyre" element={<CaseStudyAusTyre />} />
        <Route path="/case-studies/skylarr" element={<CaseStudySkylarr />} />
        <Route path="/adcom-admin" element={<AdminPanel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/done" element={<GoogleAuthDone />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <PrerenderReady />
    </BrowserRouter>
  );
}

export default App;
