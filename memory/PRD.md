# Adcom Media — Premium Digital Marketing Agency Website

## Original Problem Statement
Build a world-class, premium digital marketing agency website for "Adcom Media". Must feel expensive, bold, confident — dark theme (#000000), white text, red accents (#E11D2E / #F43F5E), Inter font (900-weight headings), smooth Framer Motion animations. A high-converting growth engine with service pages, case studies, blog, dynamic enquiry forms, and email lead generation.

## Architecture
- **Frontend**: React (CRA) SPA, `react-router-dom`, Tailwind + shadcn/ui, Framer Motion animations.
- **Backend**: FastAPI + `motor` (async MongoDB) + `resend` (transactional email).
- **DB**: MongoDB. `contacts` collection stores dynamic lead data.
- **Location**: Agency location is strictly "Pune".

## Design System (STRICT)
Dark theme, red accents, Inter (900 headings), specific spacing, Framer Motion. Do NOT introduce new UI patterns, colors, or generic components. One form per page via wrappers in `src/components/enquiries.jsx`.

## Key Pages
Homepage, Service pages (Performance/Growth/Brand Strategy/AI-SEO), Case Studies (index + deep-dives), About, Process, Blog, Careers, Contact.

## Case Studies (portfolio)
Deep-dive pages (real clients): Sharma Furnituree, Prochem, **Profotech**, **Australian Tyre Brand (aus-tyre)**, **Skylarr Labs**.
Aspirational/illustrative (no dedicated page): Maison Noir, Orbit, Numa.
All deep-dives use `CaseStudyTemplate.jsx` (data-driven). `founder` can be `null`.

## Key API
- `POST /api/contacts`: saves dynamic lead to MongoDB, triggers Resend email to `hello.adcommedia@gmail.com`.

## 3rd-Party Integrations
- Resend (email notifications) — API key configured in backend `.env`.

## Changelog
- 2026-02: Wired 3 new case studies (Profotech, Aus Tyre, Skylarr) into routing + homepage scroller + index page. Removed Kavi Coffee and Atlas Pay from the portfolio. Verified all pages render (screenshot smoke test, no console errors).
- 2026-02: Homepage "Selected Work" trimmed to 5 real case studies (Sharma, Prochem, Profotech, Aus Tyre, Skylarr); removed brand-name label from cards; tuned horizontal scroll transform.
- 2026-02: Replaced fictional "Selected growth stories" on all 4 service pages with real case studies + "Read the case study" deep links. Performance: Aus Tyre, Skylarr, Sharma. Growth: Sharma, Aus Tyre, Prochem. Brand: Profotech, Prochem. AI-SEO: Skylarr, Sharma. Aligned Brand/AI-SEO section headings to the real work. (Testimonial/quote sections still use fictional names — intentionally, to avoid fabricating quotes for real clients.)

## Backlog / Future
- (Optional) Add smooth momentum scrolling (lenis) + on-load masked hero reveal for award-level polish — pending user go-ahead.
- (Optional) Individual dedicated pages for aspirational studies if converted to real clients.
