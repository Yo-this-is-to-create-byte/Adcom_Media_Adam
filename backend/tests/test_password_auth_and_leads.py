"""Backend tests for iteration 5: password auth, brute force, lead by email."""
import os
import time
import pytest
import requests
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/") or \
    "https://adcom-vault.preview.emergentagent.com"

# Direct Mongo for cleanup / verification
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")
_mc = MongoClient(MONGO_URL)
_db = _mc[DB_NAME]

ADMIN_EMAIL = "hello.adcommedia@gmail.com"
ADMIN_PW = "@mitShukla03"


@pytest.fixture(autouse=True)
def _reset_lockouts():
    _db.login_attempts.delete_many({})
    yield
    _db.login_attempts.delete_many({})


# ---------------- Password login ---------------- #

class TestPasswordLogin:
    def test_login_success_sets_cookie_and_me_works(self):
        s = requests.Session()
        r = s.post(f"{BASE_URL}/api/auth/login",
                   json={"email": ADMIN_EMAIL, "password": ADMIN_PW}, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "chief"
        # cookie present
        assert "session_token" in s.cookies.get_dict(), s.cookies.get_dict()
        # /me works
        me = s.get(f"{BASE_URL}/api/auth/me", timeout=10)
        assert me.status_code == 200, me.text
        assert me.json()["email"] == ADMIN_EMAIL

    def test_login_wrong_password_401(self):
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": ADMIN_EMAIL, "password": "wrong-pw"}, timeout=15)
        assert r.status_code == 401
        assert r.json().get("detail") == "Invalid credentials"

    def test_login_unknown_email_same_401(self):
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": "nobody@example.com", "password": "whatever"}, timeout=15)
        assert r.status_code == 401
        assert r.json().get("detail") == "Invalid credentials"

    def test_login_non_allowlisted_same_401(self):
        # Seed a user directly with valid password_hash but not in allowlist
        import bcrypt
        email = "not_allowed@example.com"
        _db.users.delete_many({"email": email})
        _db.users.insert_one({
            "user_id": "user_TEST_notallow",
            "email": email,
            "name": "NA",
            "role": "admin",
            "password_hash": bcrypt.hashpw(b"pw12345", bcrypt.gensalt()).decode(),
            "created_at": "2024-01-01T00:00:00+00:00",
        })
        try:
            r = requests.post(f"{BASE_URL}/api/auth/login",
                              json={"email": email, "password": "pw12345"}, timeout=15)
            assert r.status_code == 401
            assert r.json().get("detail") == "Invalid credentials"
        finally:
            _db.users.delete_many({"email": email})

    def test_admin_seed_idempotent_bcrypt_hash(self):
        u = _db.users.find_one({"email": ADMIN_EMAIL})
        assert u is not None, "admin not seeded"
        assert u.get("password_hash", "").startswith("$2b$"), u.get("password_hash", "")[:10]
        assert u.get("role") == "chief"
        # count remains 1
        assert _db.users.count_documents({"email": ADMIN_EMAIL}) == 1

    def test_logout_clears_session(self):
        s = requests.Session()
        r = s.post(f"{BASE_URL}/api/auth/login",
                   json={"email": ADMIN_EMAIL, "password": ADMIN_PW}, timeout=15)
        assert r.status_code == 200
        tok = s.cookies.get("session_token")
        assert tok
        r2 = s.post(f"{BASE_URL}/api/auth/logout", timeout=10)
        assert r2.status_code == 200
        # session row removed
        assert _db.user_sessions.find_one({"session_token": tok}) is None
        # /me now 401
        me = s.get(f"{BASE_URL}/api/auth/me", timeout=10)
        assert me.status_code == 401


class TestBruteForce:
    def test_5_fails_then_429_and_success_clears(self):
        # 5 failed attempts
        for i in range(5):
            r = requests.post(f"{BASE_URL}/api/auth/login",
                              json={"email": ADMIN_EMAIL, "password": f"bad{i}"}, timeout=10)
            assert r.status_code == 401, (i, r.status_code, r.text)
        # 6th should be 429
        r6 = requests.post(f"{BASE_URL}/api/auth/login",
                           json={"email": ADMIN_EMAIL, "password": "bad_final"}, timeout=10)
        assert r6.status_code == 429, r6.text
        assert "Too many attempts" in r6.json().get("detail", "")

    def test_success_before_lockout_clears_counter(self):
        # 4 fails
        for i in range(4):
            requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": ADMIN_EMAIL, "password": f"bad{i}"}, timeout=10)
        # Success
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": ADMIN_EMAIL, "password": ADMIN_PW}, timeout=10)
        assert r.status_code == 200
        # Counter should be cleared - now 3 more fails should still 401 (not 429)
        for i in range(3):
            r = requests.post(f"{BASE_URL}/api/auth/login",
                              json={"email": ADMIN_EMAIL, "password": f"bad{i}"}, timeout=10)
            assert r.status_code == 401


# ---------------- Lead by email ---------------- #

class TestLeadByEmail:
    TEST_SID = "adam_test_return_visitor"
    TEST_EMAIL = "return_visitor_TEST@example.com"

    @classmethod
    def setup_class(cls):
        # Insert a lead directly
        _db.adam_leads.delete_many({"session_id": cls.TEST_SID})
        _db.adam_leads.insert_one({
            "lead_id": "lead_TEST_return",
            "session_id": cls.TEST_SID,
            "profile": {"email": cls.TEST_EMAIL, "name": "Return Visitor", "company": "Acme"},
            "transcript": [{"role": "user", "text": "hi"}],
            "status": "DRAFT",
            "lead_score": 20,
            "created_at": "2024-01-01T00:00:00+00:00",
            "updated_at": "2024-01-02T00:00:00+00:00",
        })

    @classmethod
    def teardown_class(cls):
        _db.adam_leads.delete_many({"session_id": cls.TEST_SID})

    def test_by_email_found(self):
        r = requests.get(f"{BASE_URL}/api/adam/lead/by-email/{self.TEST_EMAIL}", timeout=10)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["session_id"] == self.TEST_SID
        assert d["profile"]["email"].lower() == self.TEST_EMAIL.lower()

    def test_by_email_case_insensitive(self):
        r = requests.get(f"{BASE_URL}/api/adam/lead/by-email/{self.TEST_EMAIL.upper()}", timeout=10)
        assert r.status_code == 200

    def test_by_email_unknown_404(self):
        r = requests.get(f"{BASE_URL}/api/adam/lead/by-email/nobody-nowhere@example.com", timeout=10)
        assert r.status_code == 404

    def test_by_email_malformed_400(self):
        r = requests.get(f"{BASE_URL}/api/adam/lead/by-email/not-an-email", timeout=10)
        assert r.status_code == 400


# ---------------- Regression: existing endpoints still up ---------------- #

class TestRegression:
    def test_blogs_list(self):
        r = requests.get(f"{BASE_URL}/api/blogs", timeout=10)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_status_endpoint(self):
        r = requests.get(f"{BASE_URL}/api/status", timeout=10)
        assert r.status_code == 200

    def test_root(self):
        r = requests.get(f"{BASE_URL}/api/", timeout=10)
        assert r.status_code == 200

    def test_auth_me_unauthenticated_401(self):
        r = requests.get(f"{BASE_URL}/api/auth/me", timeout=10)
        assert r.status_code == 401

    def test_adam_lead_upsert_and_get(self):
        sid = "adam_TEST_regression"
        _db.adam_leads.delete_many({"session_id": sid})
        try:
            r = requests.post(f"{BASE_URL}/api/adam/lead/upsert", json={
                "session_id": sid,
                "profile": {"name": "R", "email": "r@example.com"},
                "transcript": [],
            }, timeout=10)
            assert r.status_code == 200, r.text
            r2 = requests.get(f"{BASE_URL}/api/adam/lead/{sid}", timeout=10)
            assert r2.status_code == 200
            assert r2.json()["profile"]["email"] == "r@example.com"
        finally:
            _db.adam_leads.delete_many({"session_id": sid})
