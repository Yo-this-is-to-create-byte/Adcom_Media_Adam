"""Tests for ADAM leads/discover/summary/handover flows (iteration 4)."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture()
def session_id():
    return f"adam_test_{uuid.uuid4().hex[:10]}"


def _mongo_find_lead(sid):
    import subprocess, json
    out = subprocess.check_output([
        "mongosh", "--quiet", "--eval",
        f"use('test_database'); JSON.stringify(db.adam_leads.findOne({{session_id:'{sid}'}}) || null)"
    ], text=True).strip()
    # first line is "test_database" from use()
    line = [ln for ln in out.splitlines() if ln.strip().startswith(("{", "null"))]
    return json.loads(line[-1]) if line else None


def _mongo_find_contact(sid):
    import subprocess, json
    out = subprocess.check_output([
        "mongosh", "--quiet", "--eval",
        f"use('test_database'); JSON.stringify(db.contacts.findOne({{source:'adam-workspace', message:{{$regex:'{sid}'}}}}) || null)"
    ], text=True).strip()
    line = [ln for ln in out.splitlines() if ln.strip().startswith(("{", "null"))]
    return json.loads(line[-1]) if line else None


def _cleanup(sid):
    import subprocess
    subprocess.run([
        "mongosh", "--quiet", "--eval",
        f"use('test_database'); db.adam_leads.deleteMany({{session_id:'{sid}'}}); db.contacts.deleteMany({{source:'adam-workspace', message:{{$regex:'{sid}'}}}});"
    ], check=False, capture_output=True)


# ---------- /discover ----------

class TestDiscover:
    def test_discover_first_turn_more_leads(self, api, session_id):
        try:
            r = api.post(f"{BASE_URL}/api/adam/discover", json={
                "session_id": session_id,
                "message": "More Leads",
                "profile": {},
                "transcript": [],
            }, timeout=30)
            assert r.status_code == 200, r.text
            data = r.json()
            assert isinstance(data.get("reply"), str) and len(data["reply"]) > 0
            assert isinstance(data.get("suggestions"), list)
            # goal likely extracted
            extracted = data.get("extracted", {})
            assert isinstance(extracted, dict)
            # Not necessarily strictly present, but extremely likely - allow either
            # Assert schema
            assert "ready_for_summary" in data
            assert data["ready_for_summary"] in (True, False)
        finally:
            _cleanup(session_id)

    def test_discover_two_turns_persist_and_extract(self, api, session_id):
        try:
            r1 = api.post(f"{BASE_URL}/api/adam/discover", json={
                "session_id": session_id, "message": "More Leads",
                "profile": {}, "transcript": [],
            }, timeout=30)
            assert r1.status_code == 200
            d1 = r1.json()
            transcript = [
                {"role": "user", "text": "More Leads"},
                {"role": "assistant", "text": d1["reply"]},
            ]
            # merge extracted into profile
            profile = d1.get("extracted", {})

            r2 = api.post(f"{BASE_URL}/api/adam/discover", json={
                "session_id": session_id,
                "message": "Furniture showroom in Pune",
                "profile": profile,
                "transcript": transcript,
            }, timeout=30)
            assert r2.status_code == 200
            d2 = r2.json()
            extracted2 = d2.get("extracted", {})
            # At least one of these should have been captured
            hit = any(k in extracted2 for k in ("industry", "business_type", "location"))
            assert hit, f"expected industry/business_type/location, got {extracted2}"

            # Mongo doc
            doc = _mongo_find_lead(session_id)
            assert doc, "adam_leads doc missing"
            assert doc["status"] == "DRAFT"
            assert doc["lead_score"] > 0
            assert len(doc.get("transcript", [])) >= 4
            # merged profile has at least a value from second call
            merged = doc.get("profile", {})
            assert any(merged.get(k) for k in ("industry", "business_type", "location", "goal"))
        finally:
            _cleanup(session_id)


# ---------- /lead/upsert + auto-qualify ----------

class TestLeadUpsert:
    def test_upsert_merges_and_qualifies(self, api, session_id):
        try:
            # first partial
            r1 = api.post(f"{BASE_URL}/api/adam/lead/upsert", json={
                "session_id": session_id,
                "profile": {"name": "TEST_John", "goal": "More leads"},
                "transcript": [],
            }, timeout=15)
            assert r1.status_code == 200
            d1 = r1.json()
            assert d1["status"] == "DRAFT"
            assert d1["lead_score"] > 0

            # second call adds email — should promote to QUALIFIED
            r2 = api.post(f"{BASE_URL}/api/adam/lead/upsert", json={
                "session_id": session_id,
                "profile": {"email": "test_qualified@example.com", "company": "TEST_Co"},
                "transcript": [],
            }, timeout=15)
            assert r2.status_code == 200
            d2 = r2.json()
            assert d2["status"] == "QUALIFIED", d2
            assert d2["lead_id"] == d1["lead_id"]  # same lead

            # verify merge — first fields still present
            g = api.get(f"{BASE_URL}/api/adam/lead/{session_id}", timeout=10)
            assert g.status_code == 200
            doc = g.json()
            assert doc["profile"]["name"] == "TEST_John"
            assert doc["profile"]["email"] == "test_qualified@example.com"
            assert doc["profile"]["company"] == "TEST_Co"
            assert doc["profile"]["goal"] == "More leads"
        finally:
            _cleanup(session_id)

    def test_get_lead_404(self, api):
        r = api.get(f"{BASE_URL}/api/adam/lead/nonexistent_sid_xyz", timeout=10)
        assert r.status_code == 404


# ---------- /summary ----------

class TestSummary:
    def test_summary_business_only(self, api, session_id):
        try:
            # seed lead
            api.post(f"{BASE_URL}/api/adam/lead/upsert", json={
                "session_id": session_id,
                "profile": {"name": "TEST_Ada", "company": "TEST_Furniture", "goal": "More leads", "industry": "Furniture retail", "location": "Pune"},
                "transcript": [],
            }, timeout=15)
            r = api.post(f"{BASE_URL}/api/adam/summary", json={
                "session_id": session_id,
                "profile": {"name": "TEST_Ada", "company": "TEST_Furniture", "goal": "More leads", "industry": "Furniture retail", "location": "Pune"},
                "site_context": None,
            }, timeout=60)
            assert r.status_code == 200, r.text
            data = r.json()
            biz = data["business"]
            for k in ("business", "primary_goal", "current_challenge", "opportunity"):
                assert k in biz
            assert data["website"] in (None, {})
            # mongo status update
            doc = _mongo_find_lead(session_id)
            assert doc and doc.get("status") == "ANALYSIS_COMPLETED"
            assert doc.get("business_summary")
        finally:
            _cleanup(session_id)

    def test_summary_with_site_context(self, api, session_id):
        try:
            r = api.post(f"{BASE_URL}/api/adam/summary", json={
                "session_id": session_id,
                "profile": {"company": "TEST_Site", "goal": "More sales", "industry": "Ecommerce"},
                "site_context": "Homepage: TEST_Site sells handmade furniture. Weak call-to-action. No pricing page. Product photos are excellent. Slow to load on mobile.",
            }, timeout=60)
            assert r.status_code == 200, r.text
            data = r.json()
            assert isinstance(data["website"], dict)
            for k in ("whats_working", "needs_attention", "biggest_opportunity", "quick_win"):
                assert k in data["website"]
        finally:
            _cleanup(session_id)


# ---------- /handover ----------

class TestHandover:
    def test_handover_marks_lead_and_mirrors_contact(self, api, session_id):
        try:
            payload = {
                "session_id": session_id,
                "profile": {
                    "name": "TEST_Handover",
                    "email": "test_handover@example.com",
                    "company": "TEST_HandoverCo",
                    "goal": "More leads",
                    "industry": "Furniture",
                },
                "transcript": [
                    {"role": "user", "text": "More Leads"},
                    {"role": "assistant", "text": "Got it. Tell me about your business."},
                ],
                "summary": {"business": {"business": "b", "primary_goal": "g", "current_challenge": "c", "opportunity": "o"}},
            }
            r = api.post(f"{BASE_URL}/api/adam/handover", json=payload, timeout=20)
            assert r.status_code == 200, r.text
            data = r.json()
            assert data["status"] == "CONTACT_REQUESTED"
            assert data["lead_score"] > 0
            assert data["lead_id"]

            # adam_leads updated
            lead = _mongo_find_lead(session_id)
            assert lead and lead["status"] == "CONTACT_REQUESTED"

            # contacts row inserted
            time.sleep(0.5)
            contact = _mongo_find_contact(session_id)
            assert contact, "contacts row not inserted"
            assert contact["source"] == "adam-workspace"
            assert contact["name"] == "TEST_Handover"
            assert contact["email"] == "test_handover@example.com"
        finally:
            _cleanup(session_id)


# ---------- Regressions ----------

class TestRegression:
    def test_roadmap_still_works(self, api):
        r = api.post(f"{BASE_URL}/api/adam/roadmap", json={
            "session_id": f"reg_{uuid.uuid4().hex[:8]}",
            "mode": "growth",
            "goal": "More leads for a furniture showroom in Pune",
            "site_context": "Furniture showroom in Pune wants more walk-ins and online leads.",
        }, timeout=90)
        assert r.status_code == 200, r.text
        md = r.json().get("markdown", "")
        assert "Days 1" in md or "Phase 01" in md or "Days 1-30" in md, md[:400]

    def test_status(self, api):
        r = api.get(f"{BASE_URL}/api/adam/status", timeout=10)
        assert r.status_code == 200
        d = r.json()
        assert d.get("llm_enabled") is True

    def test_scrape(self, api):
        r = api.post(f"{BASE_URL}/api/adam/scrape", json={"url": "https://example.com"}, timeout=30)
        assert r.status_code == 200
        assert "content" in r.json() or "text" in r.json() or "title" in r.json()

    def test_blogs_public(self, api):
        r = api.get(f"{BASE_URL}/api/blogs", timeout=10)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_contact_regression(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_regression",
            "email": "test_reg@example.com",
            "message": "regression check",
            "source": "test-suite",
        }, timeout=15)
        assert r.status_code == 200
        # cleanup
        import subprocess
        subprocess.run(["mongosh", "--quiet", "--eval",
                        "use('test_database'); db.contacts.deleteMany({name:'TEST_regression'});"],
                       check=False, capture_output=True)
