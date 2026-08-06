"""Emergent-managed Google Auth for Adcom Media admin panel.

REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
"""
import os
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

EMERGENT_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
SESSION_TTL_DAYS = 7


def _admin_allowlist() -> set:
    raw = os.environ.get("ADMIN_ALLOWLIST", "")
    return {e.strip().lower() for e in raw.split(",") if e.strip()}


class AuthSessionRequest(BaseModel):
    session_id: str = Field(..., min_length=8)


class AuthUser(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "admin"


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

    @router.post("/logout")
    async def logout(request: Request, response: Response):
        token = request.cookies.get("session_token")
        if token:
            await db.user_sessions.delete_one({"session_token": token})
        response.delete_cookie("session_token", path="/", samesite="none", secure=True)
        return {"ok": True}

    return router, get_current_user, require_admin
