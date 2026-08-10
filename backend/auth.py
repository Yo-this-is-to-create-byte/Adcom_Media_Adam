"""Emergent-managed Google Auth + secure email/password login for Adcom Media admin panel.

REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
"""
import os
import logging
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import httpx
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, EmailStr, Field

logger = logging.getLogger(__name__)

EMERGENT_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
SESSION_TTL_DAYS = 7
BRUTE_FORCE_MAX = 5
BRUTE_FORCE_WINDOW_MIN = 15


def _admin_allowlist() -> set:
    raw = os.environ.get("ADMIN_ALLOWLIST", "")
    return {e.strip().lower() for e in raw.split(",") if e.strip()}


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


class AuthSessionRequest(BaseModel):
    session_id: str = Field(..., min_length=8)


class PasswordLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=200)


class AuthUser(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "admin"


async def seed_admin(db):
    """Seed the bootstrap admin from env vars. Rehashes password if env changes."""
    email = (os.environ.get("ADMIN_EMAIL") or "").strip().lower()
    password = os.environ.get("ADMIN_PASSWORD") or ""
    if not email or not password:
        logger.info("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping seed")
        return
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    now = datetime.now(timezone.utc).isoformat()
    if not existing:
        user_id = f"user_{secrets.token_hex(6)}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": "Chief Admin",
            "picture": None,
            "role": "chief",
            "password_hash": _hash_password(password),
            "created_at": now,
            "last_login": None,
        })
        logger.info("Seeded admin %s", email)
    else:
        # keep hash in sync with env
        existing_hash = existing.get("password_hash") or ""
        if not existing_hash or not _verify_password(password, existing_hash):
            await db.users.update_one(
                {"email": email},
                {"$set": {"password_hash": _hash_password(password), "role": existing.get("role") or "chief"}},
            )
            logger.info("Refreshed admin password hash for %s", email)


def build_auth_router(db) -> APIRouter:
    router = APIRouter(prefix="/api/auth", tags=["auth"])

    async def get_current_user(request: Request) -> AuthUser:
        # Cookie first, Authorization: Bearer fallback (per playbook)
        token = request.cookies.get("session_token")
        if not token:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header[len("Bearer "):].strip()
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")

        session_doc = await db.user_sessions.find_one(
            {"session_token": token}, {"_id": 0}
        )
        if not session_doc:
            raise HTTPException(status_code=401, detail="Invalid session")

        expires_at = session_doc.get("expires_at")
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at)
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=401, detail="Session expired")

        user_doc = await db.users.find_one(
            {"user_id": session_doc["user_id"]}, {"_id": 0}
        )
        if not user_doc:
            raise HTTPException(status_code=401, detail="User not found")
        return AuthUser(**user_doc)

    async def require_admin(user: AuthUser = Depends(get_current_user)) -> AuthUser:
        allowlist = _admin_allowlist()
        if allowlist and user.email.lower() not in allowlist:
            raise HTTPException(status_code=403, detail="Not authorized")
        return user

    @router.post("/session")
    async def exchange_session(payload: AuthSessionRequest, response: Response):
        """Exchange the OAuth session_id (from URL fragment) for a persistent session cookie."""
        try:
            async with httpx.AsyncClient(timeout=15) as http:
                r = await http.get(
                    EMERGENT_SESSION_URL,
                    headers={"X-Session-ID": payload.session_id},
                )
            if r.status_code != 200:
                logger.warning("Emergent auth session-data failed: %s %s", r.status_code, r.text[:200])
                raise HTTPException(status_code=401, detail="Google authentication failed")
            data = r.json()
        except HTTPException:
            raise
        except Exception:
            logger.exception("Emergent auth exchange error")
            raise HTTPException(status_code=502, detail="Auth service unreachable")

        email = (data.get("email") or "").lower()
        name = data.get("name") or email.split("@")[0]
        picture = data.get("picture")
        session_token = data.get("session_token")
        if not email or not session_token:
            raise HTTPException(status_code=401, detail="Invalid Google response")

        allowlist = _admin_allowlist()
        if allowlist and email not in allowlist:
            # Do not create a session for non-admins
            raise HTTPException(status_code=403, detail="This account is not authorized for the admin panel.")

        # Upsert user (custom user_id, never expose _id)
        existing = await db.users.find_one({"email": email}, {"_id": 0})
        now = datetime.now(timezone.utc)
        if existing:
            user_id = existing["user_id"]
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {"name": name, "picture": picture, "last_login": now.isoformat()}},
            )
        else:
            user_id = f"user_{os.urandom(6).hex()}"
            await db.users.insert_one({
                "user_id": user_id,
                "email": email,
                "name": name,
                "picture": picture,
                "role": "chief" if email == "hello.adcommedia@gmail.com" else "admin",
                "created_at": now.isoformat(),
                "last_login": now.isoformat(),
            })

        # Store session
        expires = now + timedelta(days=SESSION_TTL_DAYS)
        await db.user_sessions.insert_one({
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": expires.isoformat(),
            "created_at": now.isoformat(),
        })

        # Set HttpOnly cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            max_age=SESSION_TTL_DAYS * 24 * 60 * 60,
        )
        return {
            "user": {
                "user_id": user_id,
                "email": email,
                "name": name,
                "picture": picture,
                "role": "chief" if email == "hello.adcommedia@gmail.com" else "admin",
            }
        }

    @router.get("/me", response_model=AuthUser)
    async def me(user: AuthUser = Depends(get_current_user)):
        return user

    @router.post("/login")
    async def password_login(payload: PasswordLoginRequest, request: Request, response: Response):
        """Secure email + password login. Uniform error to avoid user enumeration."""
        email = payload.email.lower().strip()
        client_ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown").split(",")[0].strip()
        attempt_key = f"{client_ip}:{email}"

        # Brute force lockout
        now = datetime.now(timezone.utc)
        window_start = now - timedelta(minutes=BRUTE_FORCE_WINDOW_MIN)
        recent_fails = await db.login_attempts.count_documents({
            "identifier": attempt_key,
            "success": False,
            "ts": {"$gte": window_start.isoformat()},
        })
        if recent_fails >= BRUTE_FORCE_MAX:
            raise HTTPException(status_code=429, detail="Too many attempts. Try again in 15 minutes.")

        user_doc = await db.users.find_one({"email": email}, {"_id": 0})
        allowlist = _admin_allowlist()
        allowed = (not allowlist) or (email in allowlist)
        ok = False
        if user_doc and user_doc.get("password_hash") and allowed:
            ok = _verify_password(payload.password, user_doc["password_hash"])

        if not ok:
            await db.login_attempts.insert_one({
                "identifier": attempt_key,
                "email": email,
                "ip": client_ip,
                "success": False,
                "ts": now.isoformat(),
            })
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Clear failed attempts for this identifier on success
        await db.login_attempts.delete_many({"identifier": attempt_key})

        # Issue an opaque session token stored in db.user_sessions (same mechanism as Google flow)
        token = f"pwd_{secrets.token_urlsafe(48)}"
        expires = now + timedelta(days=SESSION_TTL_DAYS)
        await db.user_sessions.insert_one({
            "user_id": user_doc["user_id"],
            "session_token": token,
            "expires_at": expires.isoformat(),
            "created_at": now.isoformat(),
            "kind": "password",
        })
        await db.users.update_one({"user_id": user_doc["user_id"]}, {"$set": {"last_login": now.isoformat()}})

        response.set_cookie(
            key="session_token",
            value=token,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            max_age=SESSION_TTL_DAYS * 24 * 60 * 60,
        )
        return {
            "user": {
                "user_id": user_doc["user_id"],
                "email": user_doc["email"],
                "name": user_doc.get("name") or user_doc["email"].split("@")[0],
                "picture": user_doc.get("picture"),
                "role": user_doc.get("role") or "admin",
            }
        }

    @router.post("/logout")
    async def logout(request: Request, response: Response):
        token = request.cookies.get("session_token")
        if token:
            await db.user_sessions.delete_one({"session_token": token})
        response.delete_cookie("session_token", path="/", samesite="none", secure=True)
        return {"ok": True}

    return router, get_current_user, require_admin
