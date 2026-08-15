# Adcom Media — Product Requirements Doc

## Original Problem Statement
Build a world-class, premium digital marketing agency website for **Adcom Media** with a bold, dark-themed (#000000) Awwwards-level cinematic UI (Framer Motion). Scope now includes:
- Hidden interactive AI easter egg ("ADAM Protocol") — DONE
- Fully functional Admin Panel for CMS (Task 3) — **DONE (Jul 2026)**
- Real AI Growth Intelligence workspace behind ADAM that acts like a CMO (Task 2) — **DONE (Jul 2026)**
- Blog Analytics — **DONE (Jul 2026)**

## Current State (July 2026)
- Polished React SPA + FastAPI + MongoDB
- 5 real case studies wired across homepage & service pages
- ADAM Protocol easter egg: Konami code (desktop), 11-tap footer, mobile "Activate ADAM" button
- ADAM Intelligence Workspace (post-narrative): URL scraper + GPT-5.6-sol strategist streaming chat + 90-day roadmap export + soft lead capture
- Admin CMS at `/adcom-admin` with Emergent-managed Google Auth (whitelist: `hello.adcommedia@gmail.com`)
- Blog posts migrated to MongoDB with view counters + popular-post analytics dashboard

## Recent Changes
- **2026-08 (this run)** — **Lead Inbox at `/adcom-admin`**: new "Lead inbox" tab shows every ADAM lead with status badge + score + transcript preview + one-click "Convert" button. Detail modal shows full profile, ADAM business summary, website snapshot, 90-day roadmap and complete transcript. Filter chips per status (Draft/Qualified/Analysis Started/Analysis Completed/Contact Requested/Converted) + search across company/email/name. Backend endpoints: `GET /api/admin/leads` (list + filter + search), `GET /api/admin/leads/stats`, `GET /api/admin/leads/{lead_id}`, `PATCH /api/admin/leads/{lead_id}/status`, `DELETE /api/admin/leads/{lead_id}` — all admin-protected.
- **2026-08 earlier** — Secure `/login` (email+password with bcrypt + brute-force + no user-enumeration), Google OAuth kept as secondary. sessionStorage intro replay. Secret ⓘ button + Konami discovery card. Return Visitor Continuity.
- **2026-07** — ADAM v2 conversational workspace, `adam_leads` collection, /discover, /summary, /handover.
- **2026-07** — Blog CMS + admin panel, view analytics, mobile ADAM activation.

## Architecture
- `/app/frontend/src/pages/Login.jsx` — internal password login (with Google as secondary)
- `/app/frontend/src/pages/admin/AdminPanel.jsx` — protected, redirects to `/login`
- `/app/frontend/src/components/SecretInfoButton.jsx` — 60s desktop reveal + Konami discovery card
- `/app/frontend/src/components/adam/AdamProtocol.jsx` — sessionStorage intro-replay counter + Skip button
- `/app/frontend/src/components/adam/AdamWorkspace.jsx` — Return Visitor Continuity banner + resume flow
- `/app/backend/auth.py` — password login (bcrypt) + seed_admin + brute-force
- `/app/backend/adam_leads.py` — full lead lifecycle + by-email lookup + Resend handover email
- `/app/backend/adam_intel.py` — scraper + streaming chat + roadmap
- `/app/backend/blogs.py` — CMS CRUD + view analytics
- `/app/backend/server.py` — router wiring + seeds + indexes

## DB Schema
- `contacts`: `{name, email, company, website, message, source, ...}` (source='adam-workspace' for ADAM leads mirrored on handover)
- `adam_leads` **(new)**: `{lead_id, session_id, profile:{name,company,industry,business_type,location,market,goal,audience,marketing_channels,pain_points,budget,timeline,website,email,phone,preferred_contact}, transcript:[{role,text}], status:DRAFT|QUALIFIED|ANALYSIS_STARTED|ANALYSIS_COMPLETED|CONTACT_REQUESTED|CONVERTED, lead_score, business_summary, website_summary, roadmap_markdown, created_at, updated_at}`
- `blogs`: `{id, slug, title, excerpt, category, read_time, date, cover, author:{name,role,avatar}, body:[str], views, published, created_at, updated_at}`
- `users`: `{user_id, email, name, picture, role, created_at, last_login}` (role: 'chief' | 'admin')
- `user_sessions`: `{user_id, session_token, expires_at, created_at}`

## Key API Endpoints
- **Auth**: `POST /api/auth/session`, `GET /api/auth/me`, `POST /api/auth/logout`
- **Blogs (public)**: `GET /api/blogs`, `GET /api/blogs/{slug}` (increments views)
- **Blogs (admin)**: `POST /api/admin/blogs`, `PATCH /api/admin/blogs/{id}`, `DELETE /api/admin/blogs/{id}`, `GET /api/admin/analytics`
- **ADAM Intel**: `GET /api/adam/status`, `POST /api/adam/scrape`, `POST /api/adam/chat` (SSE), `POST /api/adam/roadmap`, `POST /api/adam/voice` (ElevenLabs TTS)
- **ADAM Conversational (new)**: `POST /api/adam/discover`, `POST /api/adam/lead/upsert`, `GET /api/adam/lead/{session_id}`, `POST /api/adam/summary`, `POST /api/adam/handover`
- **Contact**: `POST /api/contact` (Resend email → `hello.adcommedia@gmail.com`)

## Integrations
- **Resend** (emails) — user API key configured
- **ElevenLabs** (TTS) — user API key configured
- **Emergent-managed Google Auth** — no API keys required, uses `auth.emergentagent.com`
- **OpenAI GPT-5.6-sol** — via Emergent LLM key (`EMERGENT_LLM_KEY`) — universal key

## Testing
- Backend: 18/18 pytest tests pass — `/app/backend/tests/test_admin_and_adam.py`, `/app/backend/tests/test_contact_api.py`
- Frontend: Playwright covering blog rendering, admin CRUD, ADAM easter egg → workspace flow, lead capture
- Test report: `/app/test_reports/iteration_3.json`
- Admin testing playbook: `/app/memory/test_credentials.md`

## Prioritized Backlog

### ✅ DONE
- Task 3 — Admin Panel
- Task 2 — ADAM Intelligence Layer
- Blog Analytics
- Blog migration to DB

### 🟢 P2 — Backlog / Future
- Rich text (TipTap) editor with image upload for admin
- Public blog RSS feed
- Admin-side lead inbox (view submissions from `/api/contact`)
- Analytics: page views (not just blog reads)
- Persist ADAM chat history per lead-email so the studio can review conversations before calling
- Replace `window.confirm()` with shadcn `AlertDialog` in admin delete flow
