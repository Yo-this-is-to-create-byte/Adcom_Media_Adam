import React from 'react';
import EnquirySection from './EnquirySection';

// ---- Field sets ----
const BUDGET = ['Under ₹35K', '₹35K – 50K', '₹50K – 1L', '₹1L – 3L', 'Above ₹3L'];
const CHALLENGES = [
  'Need More Leads', 'Low ROAS', 'Poor SEO Rankings',
  'Website Not Converting', 'Brand Awareness', 'Starting From Scratch', 'Other',
];
const TIMELINES = ['Immediately', 'Within 30 Days', '1–3 Months', 'Just Exploring'];
const SERVICES_ALL = [
  'SEO', 'Performance Marketing', 'Growth Marketing', 'Brand Strategy',
  'AI SEO', 'Website Development', 'Creative Design', 'Social Media Marketing', 'Marketing Automation',
];

/* -------- WORK enquiry (homepage after case studies) -------- */
export const WorkEnquiry = () => (
  <EnquirySection
    id="work-enquiry"
    kicker="Start a project"
    headline={<>Loved what<br /><span className="text-[#F43F5E]">you saw?</span></>}
    description="Let's create something even better for your business."
    cta="Start My Project"
    source="work"
    fields={[
      { name: 'name', label: 'Full name', required: true },
      { name: 'company', label: 'Company name' },
      { name: 'email', label: 'Business email', type: 'email', required: true },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'project_type', label: 'Project type', type: 'select',
        options: ['New brand build', 'Growth engagement', 'Performance sprint', 'Website + funnel', 'Not sure yet'], col: 2 },
      { name: 'message', label: 'Tell us more', type: 'textarea', col: 2, required: true },
    ]}
  />
);

/* -------- SERVICE enquiry (parametrised per service) -------- */
export const ServiceEnquiry = ({ service }) => (
  <EnquirySection
    id="service-enquiry"
    kicker={`Engage · ${service}`}
    headline={<>Get a strategy for<br /><span className="text-[#F43F5E]">{service}.</span></>}
    description="Share your current state — we'll come back with a diagnostic and a proposed engagement shape."
    cta="Get My Strategy"
    source={`service-${service.toLowerCase().replace(/\s+/g, '-')}`}
    fields={[
      { name: 'name', label: 'Name', required: true },
      { name: 'company', label: 'Company' },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'services', label: 'Service required', type: 'multiselect', options: SERVICES_ALL, col: 2 },
      { name: 'budget', label: 'Monthly marketing budget', type: 'select', options: BUDGET, col: 2 },
      { name: 'challenge', label: 'Current challenge', type: 'select', options: CHALLENGES, col: 2 },
      { name: 'message', label: 'Anything else we should know', type: 'textarea', col: 2, required: true, rows: 3 },
    ]}
  />
);

/* -------- CASE STUDIES enquiry -------- */
export const CaseStudiesEnquiry = () => (
  <EnquirySection
    id="cs-enquiry"
    kicker="Similar results"
    headline={<>Want similar<br /><span className="text-[#F43F5E]">results?</span></>}
    description="Let's discuss how we can achieve similar results for your business."
    cta="Let's Talk"
    source="case-studies"
    fields={[
      { name: 'name', label: 'Name', required: true },
      { name: 'company', label: 'Company' },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'message', label: 'Which case study resonated?', type: 'textarea', col: 2, required: true, rows: 3 },
    ]}
  />
);

/* -------- ABOUT enquiry -------- */
export const AboutEnquiry = () => (
  <EnquirySection
    id="about-enquiry"
    kicker="Book a call"
    headline={<>Meet the team<br /><span className="text-[#F43F5E]">behind your growth.</span></>}
    description="Every successful campaign starts with understanding your business."
    cta="Book an Intro Call"
    source="about"
    fields={[
      { name: 'name', label: 'Name', required: true },
      { name: 'company', label: 'Company' },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'meeting_date', label: 'Preferred meeting date', type: 'date' },
      { name: 'message', label: 'Message', type: 'textarea', col: 2, required: true, rows: 3 },
    ]}
  />
);

/* -------- PROCESS enquiry -------- */
export const ProcessEnquiry = () => (
  <EnquirySection
    id="process-enquiry"
    kicker="Discovery session"
    headline={<>Ready<br /><span className="text-[#F43F5E]">to start?</span></>}
    description="Let's begin with a discovery session and build your roadmap."
    cta="Start My Project"
    source="process"
    fields={[
      { name: 'name', label: 'Name', required: true },
      { name: 'company', label: 'Business name' },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'message', label: 'Biggest marketing challenge', type: 'textarea', col: 2, required: true, rows: 3 },
    ]}
  />
);

/* -------- BLOG mini enquiry (post-article) -------- */
export const BlogEnquiry = () => (
  <EnquirySection
    id="blog-enquiry"
    variant="compact"
    kicker="Talk to an expert"
    headline={<>Need help<br /><span className="text-[#F43F5E]">implementing this?</span></>}
    description="Our experts can help you turn ideas into measurable growth."
    cta="Talk to an Expert"
    source="blog"
    fields={[
      { name: 'name', label: 'Name', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'website', label: 'Website', type: 'url', col: 2 },
      { name: 'message', label: 'Which piece did you read?', type: 'textarea', col: 2, required: true, rows: 3 },
    ]}
  />
);

/* -------- CAREERS application (uses same base with resume URL field) -------- */
export const CareersEnquiry = ({ position = 'Any' }) => (
  <EnquirySection
    id="careers-enquiry"
    kicker="Apply now"
    headline={<>Join<br /><span className="text-[#F43F5E]">Adcom Media.</span></>}
    description="We're always looking for talented marketers, strategists, designers, developers and creators."
    cta="Apply Now"
    microcopy="Applications reviewed by the founding team. Response within 5 business days."
    source="careers"
    fields={[
      { name: 'name', label: 'Full name', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone number', type: 'tel' },
      { name: 'position', label: 'Position applying for',
        type: 'select', required: true,
        options: [
          'Lead Growth Strategist', 'Performance Marketing Lead',
          'Brand Designer (Lead)', 'AI SEO Editor',
          'Creative Producer', 'Marketing Engineer', 'Open Application',
        ], col: 2 },
      { name: 'linkedin', label: 'LinkedIn profile', type: 'url' },
      { name: 'portfolio', label: 'Portfolio URL', type: 'url' },
      { name: 'resume_url', label: 'Resume link (Drive / Dropbox)', type: 'url', col: 2 },
      { name: 'message', label: 'A short note', type: 'textarea', col: 2, required: true, rows: 4 },
    ]}
  />
);

/* -------- CONTACT primary form (full) -------- */
export const PrimaryContactEnquiry = () => (
  <EnquirySection
    id="contact-primary"
    kicker="Primary enquiry"
    headline={<>Let&apos;s build something<br /><span className="text-[#F43F5E]">great together.</span></>}
    description="Tell us about your business and where you want to grow."
    cta="Let's Grow Together"
    source="contact"
    fields={[
      { name: 'name', label: 'Full name', required: true },
      { name: 'company', label: 'Company name' },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone number', type: 'tel' },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'industry', label: 'Industry' },
      { name: 'team_size', label: 'Team size', type: 'select',
        options: ['1–10', '11–50', '51–200', '200+'], col: 2 },
      { name: 'services', label: 'Services interested in', type: 'multiselect', options: SERVICES_ALL, col: 2 },
      { name: 'budget', label: 'Marketing budget', type: 'select', options: BUDGET, col: 2 },
      { name: 'timeline', label: 'Project timeline', type: 'select', options: TIMELINES, col: 2 },
      { name: 'hear_about', label: 'How did you hear about us?' },
      { name: 'message', label: 'Additional project details', type: 'textarea', col: 2, required: true, rows: 4 },
    ]}
  />
);
