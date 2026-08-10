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
- **2026-07 (this run)** — Added `auth.py` (Emergent Google Auth + session_token cookie), `blogs.py` (Blog CRUD + view analytics + seed migration), `adam_intel.py` (website scraper via BeautifulSoup + GPT-5.6-sol streaming chat + 90-day roadmap). Frontend: `/adcom-admin` route with login/dashboard/markdown editor, ADAM Intelligence Workspace (`AdamWorkspace.jsx`) replaces static "explore" phase, Blog.jsx / BlogPost.jsx now fetch from `/api/blogs` (hardcoded `blogPosts.js` deleted).
- **2026-07 (earlier)** — Added mobile-only "Activate ADAM" pill button in footer.
- **2026-07** — ADAM easter egg (Konami + 11-tap), ElevenLabs voice sync, shareable badge.

## Architecture
- `/app/frontend/src/` — React (Tailwind, framer-motion, react-router-dom)
- `/app/frontend/src/pages/admin/` — Admin panel (login, dashboard, markdown editor)
- `/app/frontend/src/components/adam/AdamWorkspace.jsx` — AI CMO workspace
- `/app/frontend/src/lib/api.js` — Central API client with SSE streaming
- `/app/backend/` — FastAPI split into `server.py` + `auth.py` + `blogs.py` + `adam_intel.py`
- `/app/memory/test_credentials.md` — Admin session injection playbook for testing

## DB Schema
- `contacts`: `{name, email, company, website, message, source, ...}` (source='adam-workspace' for ADAM leads)
- `blogs`: `{id, slug, title, excerpt, category, read_time, date, cover, author:{name,role,avatar}, body:[str], views, published, created_at, updated_at}`
- `users`: `{user_id, email, name, picture, role, created_at, last_login}` (role: 'chief' | 'admin')
- `user_sessions`: `{user_id, session_token, expires_at, created_at}`

## Key API Endpoints
- **Auth**: `POST /api/auth/session`, `GET /api/auth/me`, `POST /api/auth/logout`
- **Blogs (public)**: `GET /api/blogs`, `GET /api/blogs/{slug}` (increments views)
- **Blogs (admin)**: `POST /api/admin/blogs`, `PATCH /api/admin/blogs/{id}`, `DELETE /api/admin/blogs/{id}`, `GET /api/admin/analytics`
- **ADAM**: `GET /api/adam/status`, `POST /api/adam/scrape`, `POST /api/adam/chat` (SSE), `POST /api/adam/roadmap`, `POST /api/adam/voice` (ElevenLabs TTS)
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
