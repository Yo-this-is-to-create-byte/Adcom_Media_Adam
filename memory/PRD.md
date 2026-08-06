# Adcom Media — Product Requirements Doc

## Original Problem Statement
Build a world-class, premium digital marketing agency website for **Adcom Media** with a bold, dark-themed (#000000) Awwwards-level cinematic UI (Framer Motion). Scope evolved to include:
- Hidden interactive AI easter egg ("ADAM Protocol")
- Fully functional Admin Panel for CMS (Task 3)
- Real AI Growth Intelligence workspace behind ADAM that acts like a CMO (Task 2)

## Current State (July 2026)
- Polished React SPA + FastAPI + MongoDB
- 5 real case studies wired across homepage & service pages
- ADAM Protocol easter egg: Konami code (desktop), 11-tap footer AND **new mobile "Activate ADAM" button** (July 2026 fix)
- Cinematic boot sequence, Web Audio API sound design, ElevenLabs TTS synced to UI, shareable unlock badge

## Recent Changes
- **2026-07-XX** — Added visible mobile-only "Activate ADAM" pill button in footer (replaces unreliable 11-tap on mobile). Desktop Konami + 11-tap still function.

## Architecture
- `/app/frontend/src/` — React (Tailwind, framer-motion, react-router-dom)
- `/app/backend/` — FastAPI + motor (async MongoDB)
- `/app/frontend/src/components/adam/*` — ADAM Protocol modular UI + audio
- `/app/frontend/src/components/Footer.jsx` — 11-tap + new mobile activate button

## DB Schema
- `contacts`: `{name, email, company, website, message, source, budget, challenge, industry, team_size, services, timeline, hear_about, project_type, position, linkedin, portfolio, resume_url, meeting_date}`
- **[Pending]** `blogs`: TBD for Task 3 CMS

## Key API Endpoints
- `POST /api/contacts` — Lead capture → DB + Resend email
- `POST /api/adam/voice/generate` — ElevenLabs TTS

## Integrations
- Resend (emails) — user API key
- ElevenLabs (TTS) — user API key
- **[Pending]** Emergent-managed Google Auth — playbook saved at `/app/auth_testing.md`
- **[Pending]** OpenAI GPT-5.6 via Emergent LLM key

## Prioritized Backlog

### 🟠 P0 — Task 3: Admin Panel (CMS)
- Emergent Google Auth (chief admin: `hello.adcommedia@gmail.com`) per `/app/auth_testing.md`
- MongoDB `blogs` collection + CRUD API
- Migrate hardcoded blogs from `Blog.jsx` / `BlogPost.jsx` into DB
- Protected `/admin` route with list/create/edit/delete UI

### 🟡 P1 — Task 2: ADAM Intelligence Layer
- Transition ADAM intro → real AI workspace UI
- Python lightweight web scraper endpoint
- GPT-5.6 via `integration_playbook_expert_v2` as marketing strategist
- Multi-mode chat (SEO / Strategy / Growth), 90-day roadmap export
- Soft lead capture → existing `contacts` collection + Resend

### 🟢 P2 — Backlog
- Admin analytics (page views, blog reads)
- Rich text / image upload for blog editor
- Public blog RSS feed

## Test Credentials
- Lead/Admin target: `hello.adcommedia@gmail.com`
