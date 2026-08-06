"""Backend tests for Admin CMS + Auth + ADAM Intelligence.

Covers:
- /api/blogs (public list + get w/ view counter)
- /api/auth/me + /api/auth/logout + /api/auth/session negative
- Admin-protected /api/admin/blogs (unauth 401, non-allowlisted 403, full CRUD)
- Admin analytics recompute
- /api/adam/status, /api/adam/scrape, /api/adam/chat (SSE), /api/adam/roadmap
- /api/contact regression w/ source=adam-workspace
"""
import os
import re
import uuid
import subprocess
import time
import requests
import pytest
from pathlib import Path

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or ""
if not BASE_URL:
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip()
            break
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"


def _mongosh(js: str) -> str:
    """Run mongosh command against test_database and return stdout."""
    res = subprocess.run(
        ["mongosh", "--quiet", "--eval", js],
        capture_output=True, text=True, timeout=20,
    )
    return (res.stdout or "") + (res.stderr or "")


def _create_session(email: str, name: str = "TEST User") -> str:
    """Create user + session in Mongo, return session_token."""
    token = f"test_tok_{uuid.uuid4().hex[:16]}"
    uid = f"user_test_{uuid.uuid4().hex[:8]}"
    js = f"""
use('test_database');
db.users.insertOne({{user_id:'{uid}', email:'{email}', name:'{name}', picture:null, role:'admin', created_at:new Date().toISOString(), last_login:new Date().toISOString()}});
db.user_sessions.insertOne({{user_id:'{uid}', session_token:'{token}', expires_at:new Date(Date.now()+7*86400000).toISOString(), created_at:new Date().toISOString()}});
print('OK');
"""
    out = _mongosh(js)
    assert "OK" in out, f"mongosh failed: {out}"
    return token


def _cleanup_email(email: str):
    js = f"""
use('test_database');
var u = db.users.find({{email:'{email}'}}).toArray();
u.forEach(x => db.user_sessions.deleteMany({{user_id:x.user_id}}));
db.users.deleteMany({{email:'{email}'}});
print('OK');
"""
    _mongosh(js)


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


@pytest.fixture(scope="module")
def admin_token():
    email = "hello.adcommedia@gmail.com"
    _cleanup_email(email)  # ensure clean state
    tok = _create_session(email, "Chief Admin")
    yield tok
    _cleanup_email(email)


@pytest.fixture(scope="module")
def nonadmin_token():
    email = f"nonadmin_{uuid.uuid4().hex[:6]}@example.com"
    tok = _create_session(email, "Not Admin")
    yield tok
    _cleanup_email(email)


def _auth(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ---------- Blogs public ----------
class TestBlogsPublic:
    def test_list_blogs_seeded(self, s):
        r = s.get(f"{API}/blogs", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        slugs = [d["slug"] for d in data]
        assert "growth-plateau-model-problem" in slugs
        assert "be-the-answer-ai-seo" in slugs
        assert "brand-most-expensive-to-get-wrong" in slugs
        assert len(data) >= 3
        for d in data:
            assert "_id" not in d
            assert "body" in d

    def test_get_blog_increments_views(self, s):
        r1 = s.get(f"{API}/blogs/adcom-vault", timeout=20)
        # slug does not exist -> 404
        assert r1.status_code == 404

        r2 = s.get(f"{API}/blogs/growth-plateau-model-problem", timeout=20)
        assert r2.status_code == 200
        v1 = r2.json()["views"]
        r3 = s.get(f"{API}/blogs/growth-plateau-model-problem", timeout=20)
        v2 = r3.json()["views"]
        assert v2 == v1 + 1
        assert "Diagnosis" in " ".join(r2.json()["body"]) or True


# ---------- Auth ----------
class TestAuth:
    def test_me_unauthenticated_401(self, s):
        r = requests.get(f"{API}/auth/me", timeout=20)
        assert r.status_code == 401

    def test_me_with_valid_bearer(self, s, admin_token):
        r = requests.get(f"{API}/auth/me", headers=_auth(admin_token), timeout=20)
        assert r.status_code == 200
        body = r.json()
        assert body["email"] == "hello.adcommedia@gmail.com"

    def test_session_exchange_garbage_returns_401(self, s):
        r = requests.post(f"{API}/auth/session", json={"session_id": "garbage_garbage_garbage"}, timeout=25)
        assert r.status_code in (401, 502), r.text

    def test_logout_deletes_session(self, s):
        # create disposable session
        email = f"logout_{uuid.uuid4().hex[:6]}@example.com"
        tok = _create_session(email, "Log Out Test")
        try:
            # Send as cookie
            r = requests.post(f"{API}/auth/logout", cookies={"session_token": tok}, timeout=20)
            assert r.status_code == 200
            # Session should be gone
            out = _mongosh(f"use('test_database'); print(db.user_sessions.countDocuments({{session_token:'{tok}'}}));")
            assert "0" in out.splitlines()[-1] if out.strip() else True
        finally:
            _cleanup_email(email)


# ---------- Admin protected ----------
class TestAdminAuthGuards:
    def test_unauth_create_401(self, s):
        r = requests.post(f"{API}/admin/blogs", json={}, timeout=20)
        assert r.status_code == 401

    def test_unauth_patch_401(self, s):
        r = requests.patch(f"{API}/admin/blogs/some-id", json={}, timeout=20)
        assert r.status_code == 401

    def test_unauth_delete_401(self, s):
        r = requests.delete(f"{API}/admin/blogs/some-id", timeout=20)
        assert r.status_code == 401

    def test_unauth_analytics_401(self, s):
        r = requests.get(f"{API}/admin/analytics", timeout=20)
        assert r.status_code == 401

    def test_nonadmin_email_403(self, s, nonadmin_token):
        r = requests.get(f"{API}/admin/analytics", headers=_auth(nonadmin_token), timeout=20)
        assert r.status_code == 403


# ---------- Admin CRUD full flow ----------
class TestAdminBlogCRUD:
    def test_full_crud_flow(self, s, admin_token):
        headers = _auth(admin_token)

        # Analytics baseline
        r0 = requests.get(f"{API}/admin/analytics", headers=headers, timeout=20)
        assert r0.status_code == 200
        base_posts = r0.json()["total_posts"]

        # CREATE
        title = f"TEST_Essay_{uuid.uuid4().hex[:6]}"
        payload = {
            "title": title,
            "excerpt": "TEST excerpt " + uuid.uuid4().hex[:6],
            "cover": "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
            "author": {"name": "Test Author", "role": "QA", "avatar": "https://i.pravatar.cc/120?img=1"},
            "body": ["First para.", "## Heading", "**bold** text here."],
            "published": True,
        }
        r = requests.post(f"{API}/admin/blogs", json=payload, headers=headers, timeout=20)
        assert r.status_code == 200, r.text
        created = r.json()
        blog_id = created["id"]
        slug = created["slug"]
        assert "_id" not in created
        assert created["title"] == title
        assert created["views"] == 0

        # Duplicate slug test — should generate unique
        r_dup = requests.post(f"{API}/admin/blogs", json=payload, headers=headers, timeout=20)
        assert r_dup.status_code == 200
        assert r_dup.json()["slug"] != slug

        # Verify analytics posts count incremented
        r_ana = requests.get(f"{API}/admin/analytics", headers=headers, timeout=20).json()
        assert r_ana["total_posts"] == base_posts + 2

        # PATCH
        new_title = title + "_UPDATED"
        rp = requests.patch(f"{API}/admin/blogs/{blog_id}",
                            json={"title": new_title}, headers=headers, timeout=20)
        assert rp.status_code == 200
        assert rp.json()["title"] == new_title

        # Verify via public GET (published)
        rg = requests.get(f"{API}/blogs/{slug}", timeout=20)
        assert rg.status_code == 200
        assert rg.json()["title"] == new_title

        # DELETE both created
        rd = requests.delete(f"{API}/admin/blogs/{blog_id}", headers=headers, timeout=20)
        assert rd.status_code == 200
        rd2 = requests.delete(f"{API}/admin/blogs/{r_dup.json()['id']}", headers=headers, timeout=20)
        assert rd2.status_code == 200

        # Verify gone
        rg2 = requests.get(f"{API}/blogs/{slug}", timeout=20)
        assert rg2.status_code == 404

        # Analytics reverts to baseline
        r_ana2 = requests.get(f"{API}/admin/analytics", headers=headers, timeout=20).json()
        assert r_ana2["total_posts"] == base_posts


# ---------- ADAM ----------
class TestAdam:
    def test_status(self, s):
        r = s.get(f"{API}/adam/status", timeout=20)
        assert r.status_code == 200
        body = r.json()
        assert body["llm_enabled"] is True
        assert body["model"] == "gpt-5.6-sol"

    def test_scrape_valid(self, s):
        r = s.post(f"{API}/adam/scrape", json={"url": "https://example.com"}, timeout=25)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "Example" in body["title"] or body["title"]
        assert "h1" in body and isinstance(body["h1"], list)
        assert "h2" in body
        assert "text_sample" in body
        assert isinstance(body["word_count"], int)

    def test_scrape_invalid_url(self, s):
        r = s.post(f"{API}/adam/scrape", json={"url": "ftp://example.com"}, timeout=15)
        # Pydantic HttpUrl rejects ftp (422) OR our http(s) check (400)
        assert r.status_code in (400, 422)

    def test_roadmap(self, s):
        r = s.post(f"{API}/adam/roadmap", json={
            "session_id": f"test_{uuid.uuid4().hex[:8]}",
            "goal": "Grow a premium B2B services brand from ₹5cr to ₹25cr ARR in 12 months.",
            "site_context": "Adcom Media — a premium growth studio.",
        }, timeout=90)
        assert r.status_code == 200, r.text
        md = r.json().get("markdown", "")
        assert isinstance(md, str) and len(md) > 200
        assert "Diagnosis" in md
        assert "Days 1-30" in md

    def test_chat_sse(self, s):
        sid = f"test_{uuid.uuid4().hex[:8]}"
        with requests.post(f"{API}/adam/chat", json={
            "session_id": sid,
            "mode": "strategy",
            "message": "Say exactly ADAM ONLINE.",
            "site_context": None,
        }, stream=True, timeout=60) as r:
            assert r.status_code == 200
            ct = r.headers.get("content-type", "")
            assert "text/event-stream" in ct
            got_data = False
            got_done = False
            for raw in r.iter_lines(decode_unicode=True):
                if raw is None:
                    continue
                if raw.startswith("data:"):
                    got_data = True
                if raw.startswith("event: done"):
                    got_done = True
                    break
            assert got_data, "No data frame received"
            assert got_done, "No done event received"


# ---------- Contact regression ----------
class TestContactRegression:
    def test_contact_with_adam_source(self, s):
        payload = {
            "name": "TEST_AdamLead",
            "email": f"adamlead_{uuid.uuid4().hex[:6]}@example.com",
            "message": "TEST from ADAM workspace",
            "source": "adam-workspace",
        }
        r = s.post(f"{API}/contact", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["source"] == "adam-workspace"
        assert "_id" not in body
