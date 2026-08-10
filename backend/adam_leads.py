"""ADAM leads — draft profile persistence + conversational discovery + summary + handover.

The ADAM workspace is a conversational growth strategist. It saves the lead progressively
into `adam_leads` (keyed by session_id) and, only on final handover, writes into the
existing `contacts` collection + sends a Resend email to the studio.
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import resend
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, EmailStr, Field

load_dotenv(Path(__file__).parent / ".env")
logger = logging.getLogger(__name__)

LEADS_INBOX = os.environ.get("LEADS_INBOX", "hello.adcommedia@gmail.com")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")


def _llm_key() -> Optional[str]:
    return os.environ.get("EMERGENT_LLM_KEY")


def _model_name() -> str:
    return os.environ.get("ADAM_LLM_MODEL", "gpt-5.6-sol")


PROFILE_FIELDS = [
    "name", "company", "industry", "business_type", "location", "market",
    "goal", "audience", "marketing_channels", "pain_points",
    "budget", "timeline", "website", "email", "phone", "preferred_contact",
]

STATUSES = ["DRAFT", "QUALIFIED", "ANALYSIS_STARTED", "ANALYSIS_COMPLETED", "CONTACT_REQUESTED", "CONVERTED"]


class LeadProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: Optional[str] = None
    company: Optional[str] = None
    industry: Optional[str] = None
    business_type: Optional[str] = None
    location: Optional[str] = None
    market: Optional[str] = None
    goal: Optional[str] = None
    audience: Optional[str] = None
    marketing_channels: Optional[str] = None
    pain_points: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    preferred_contact: Optional[str] = None


class TranscriptTurn(BaseModel):
    role: str  # "user" | "assistant"
    text: str


class UpsertRequest(BaseModel):
    session_id: str = Field(..., min_length=6, max_length=80)
    profile: LeadProfile = Field(default_factory=LeadProfile)
    transcript: List[TranscriptTurn] = Field(default_factory=list)
    status: Optional[str] = None


class DiscoverRequest(BaseModel):
    session_id: str
    message: str = Field(..., min_length=1, max_length=2000)
    profile: LeadProfile = Field(default_factory=LeadProfile)
    transcript: List[TranscriptTurn] = Field(default_factory=list)


class DiscoverResponse(BaseModel):
    reply: str
    suggestions: List[str] = Field(default_factory=list)
    extracted: Dict[str, Any] = Field(default_factory=dict)
    ready_for_summary: bool = False


class SummaryRequest(BaseModel):
    session_id: str
    profile: LeadProfile
    site_context: Optional[str] = None


class SummaryResponse(BaseModel):
    business: Dict[str, str]  # {business, primary_goal, current_challenge, opportunity}
    website: Optional[Dict[str, str]] = None  # {whats_working, needs_attention, biggest_opportunity, quick_win}


class HandoverRequest(BaseModel):
    session_id: str
    profile: LeadProfile
    transcript: List[TranscriptTurn] = Field(default_factory=list)
    summary: Optional[Dict[str, Any]] = None  # from /summary
    roadmap_markdown: Optional[str] = None
    site_context: Optional[str] = None


# ---------------- LLM helpers ---------------- #

DISCOVER_SYSTEM = """You are ADAM — Adcom Media's internal AI Growth Consultant. You are a senior marketing strategist having a natural conversation with a business owner. You are NOT a form. You are NOT a chatbot. You are the sharpest CMO they've ever spoken to.

RULES:
- Ask ONE question at a time. Keep replies short (1–3 sentences MAX).
- Never ask for more than one field at a time.
- Never ask for something already collected.
- Do NOT ask for their website in the first 3 turns. Do NOT demand it — it is always optional.
- Never invent details you weren't given.
- Never claim to have already "saved" or "submitted" anything.
- If the user seems ready or has answered ~5 substantive fields, set `ready_for_summary=true`.
- Tone: confident, warm, minimal fluff. Sound like a smart friend, not corporate.

Output STRICT JSON only (no markdown, no code fences), matching this schema:
{
  "reply": "<your next line to the user, 1–3 sentences>",
  "suggestions": ["<up to 4 short reply chips the user could tap, or []>"],
  "extracted": {
    "<field>": "<value>"   // ONLY include fields you learned from the LATEST user message
  },
  "ready_for_summary": false
}

Fields you may extract into `extracted`: name, company, industry, business_type, location, market, goal, audience, marketing_channels, pain_points, budget, timeline, website, email, phone, preferred_contact.

Do not put anything outside `extracted` that isn't one of those fields."""


def _extract_json(text: str) -> dict:
    """Robustly pull a JSON object out of a possibly-messy LLM reply."""
    # Strip code fences
    cleaned = re.sub(r"```(?:json)?", "", text or "").replace("```", "").strip()
    # Fast path
    try:
        return json.loads(cleaned)
    except Exception:
        pass
    # Find first { ... last }
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start >= 0 and end > start:
        chunk = cleaned[start:end + 1]
        try:
            return json.loads(chunk)
        except Exception:
            return {}
    return {}


def _profile_snapshot(profile: LeadProfile) -> str:
    d = profile.model_dump(exclude_none=True)
    if not d:
        return "(nothing collected yet)"
    return "\n".join(f"- {k}: {v}" for k, v in d.items())


def _transcript_snippet(transcript: List[TranscriptTurn], last_n: int = 8) -> str:
    tail = transcript[-last_n:]
    return "\n".join(f"{t.role.upper()}: {t.text}" for t in tail) or "(no prior turns)"


# ---------------- Router ---------------- #

def build_adam_leads_router(db) -> APIRouter:
    router = APIRouter(prefix="/api/adam", tags=["adam-leads"])

    async def _load_lead(session_id: str) -> Optional[dict]:
        return await db.adam_leads.find_one({"session_id": session_id}, {"_id": 0})

    def _lead_score(profile: LeadProfile, transcript_len: int) -> int:
        weights = {
            "email": 25, "phone": 20, "name": 10, "company": 10,
            "goal": 8, "industry": 6, "budget": 8, "timeline": 5, "website": 5, "location": 3,
        }
        score = 0
        d = profile.model_dump()
        for k, w in weights.items():
            if d.get(k):
                score += w
        # small bonus for engagement
        score += min(transcript_len, 20)
        return min(score, 100)

    async def _upsert_lead(session_id: str, profile: LeadProfile, transcript: List[TranscriptTurn], status: Optional[str] = None) -> dict:
        now = datetime.now(timezone.utc).isoformat()
        existing = await _load_lead(session_id)
        merged_profile = {}
        if existing:
            merged_profile.update(existing.get("profile", {}))
        for k, v in profile.model_dump(exclude_none=True).items():
            if v is not None and v != "":
                merged_profile[k] = v

        score = _lead_score(LeadProfile(**merged_profile), len(transcript))
        new_status = status or (existing.get("status") if existing else None) or "DRAFT"
        # Auto-promote to QUALIFIED once we have contact + business context
        p = merged_profile
        if new_status == "DRAFT" and (p.get("email") or p.get("phone")) and (p.get("company") or p.get("name")) and (p.get("goal") or p.get("industry")):
            new_status = "QUALIFIED"

        doc = {
            "lead_id": existing.get("lead_id") if existing else f"lead_{uuid.uuid4().hex[:12]}",
            "session_id": session_id,
            "profile": merged_profile,
            "transcript": [t.model_dump() for t in transcript],
            "status": new_status,
            "lead_score": score,
            "created_at": existing.get("created_at") if existing else now,
            "updated_at": now,
        }
        await db.adam_leads.update_one(
            {"session_id": session_id},
            {"$set": doc},
            upsert=True,
        )
        return doc

    @router.post("/lead/upsert")
    async def upsert_lead(payload: UpsertRequest):
        doc = await _upsert_lead(payload.session_id, payload.profile, payload.transcript, payload.status)
        return {"lead_id": doc["lead_id"], "status": doc["status"], "lead_score": doc["lead_score"]}

    @router.get("/lead/{session_id}")
    async def get_lead(session_id: str):
        doc = await _load_lead(session_id)
        if not doc:
            raise HTTPException(status_code=404, detail="No lead for this session")
        return doc

    @router.post("/discover", response_model=DiscoverResponse)
    async def discover(payload: DiscoverRequest):
        key = _llm_key()
        if not key:
            raise HTTPException(status_code=503, detail="AI engine not configured")
        try:
            from emergentintegrations.llm.chat import LlmChat, UserMessage
        except Exception:
            logger.exception("emergentintegrations import failed")
            raise HTTPException(status_code=503, detail="AI engine unavailable")

        system = (
            DISCOVER_SYSTEM
            + "\n\n---\nWHAT ADAM ALREADY KNOWS ABOUT THIS LEAD:\n"
            + _profile_snapshot(payload.profile)
            + "\n\nRECENT CONVERSATION (last 8 turns):\n"
            + _transcript_snippet(payload.transcript, 8)
        )

        chat = LlmChat(
            api_key=key,
            session_id=payload.session_id + ":discover",
            system_message=system,
        ).with_model("openai", _model_name())

        try:
            raw = await chat.send_message(UserMessage(text=payload.message))
        except Exception:
            logger.exception("ADAM discover LLM call failed")
            raise HTTPException(status_code=502, detail="ADAM is unavailable, try again in a moment")

        parsed = _extract_json(raw)
        reply = (parsed.get("reply") or "").strip() or (raw or "").strip()[:500]
        suggestions = parsed.get("suggestions") or []
        if not isinstance(suggestions, list):
            suggestions = []
        suggestions = [str(s)[:80] for s in suggestions][:5]
        extracted_raw = parsed.get("extracted") or {}
        extracted = {}
        if isinstance(extracted_raw, dict):
            for k, v in extracted_raw.items():
                if k in PROFILE_FIELDS and v not in (None, "", []):
                    extracted[k] = v if isinstance(v, str) else str(v)
        ready = bool(parsed.get("ready_for_summary"))

        # Silently persist the extraction alongside the transcript we already have
        try:
            merged = payload.profile.model_dump(exclude_none=True)
            merged.update(extracted)
            new_transcript = list(payload.transcript) + [
                TranscriptTurn(role="user", text=payload.message),
                TranscriptTurn(role="assistant", text=reply),
            ]
            await _upsert_lead(
                payload.session_id,
                LeadProfile(**merged),
                new_transcript,
            )
        except Exception:
            logger.exception("Lead upsert failed inside /discover")

        return DiscoverResponse(reply=reply, suggestions=suggestions, extracted=extracted, ready_for_summary=ready)

    SUMMARY_SYSTEM = (
        "You are ADAM, Adcom Media's growth strategist. Produce two short strategic summaries in STRICT JSON — no code fences, no prose outside JSON. Base every sentence ONLY on the profile & site context provided. Never invent."
        "\n\nSchema:"
        "\n{"
        '\n  "business": {'
        '\n    "business": "<one line describing what the business is>",'
        '\n    "primary_goal": "<one line stating their goal>",'
        '\n    "current_challenge": "<one line diagnosing their real bottleneck>",'
        '\n    "opportunity": "<one strong sentence naming the biggest unlock>"'
        "\n  },"
        '\n  "website": {   // include this key ONLY if site_context provided; otherwise omit'
        '\n    "whats_working": "<one line>",'
        '\n    "needs_attention": "<one line>",'
        '\n    "biggest_opportunity": "<one line>",'
        '\n    "quick_win": "<one concrete quick win they can do this week>"'
        "\n  }"
        "\n}"
    )

    @router.post("/summary")
    async def summary(payload: SummaryRequest):
        key = _llm_key()
        if not key:
            raise HTTPException(status_code=503, detail="AI engine not configured")
        try:
            from emergentintegrations.llm.chat import LlmChat, UserMessage
        except Exception:
            raise HTTPException(status_code=503, detail="AI engine unavailable")

        context = "PROFILE:\n" + _profile_snapshot(payload.profile)
        if payload.site_context:
            context += "\n\nSITE CONTEXT:\n" + payload.site_context[:3000]

        chat = LlmChat(
            api_key=key,
            session_id=payload.session_id + ":summary",
            system_message=SUMMARY_SYSTEM,
        ).with_model("openai", _model_name())

        try:
            raw = await chat.send_message(UserMessage(text=context))
        except Exception:
            logger.exception("ADAM summary LLM call failed")
            raise HTTPException(status_code=502, detail="Summary generation failed")

        parsed = _extract_json(raw)
        business = parsed.get("business") if isinstance(parsed.get("business"), dict) else {}
        website = parsed.get("website") if isinstance(parsed.get("website"), dict) else None
        # Filter to expected keys only
        biz = {k: str(business.get(k, "")) for k in ("business", "primary_goal", "current_challenge", "opportunity")}
        web = None
        if website and payload.site_context:
            web = {k: str(website.get(k, "")) for k in ("whats_working", "needs_attention", "biggest_opportunity", "quick_win")}

        # Update status → ANALYSIS_COMPLETED
        try:
            await db.adam_leads.update_one(
                {"session_id": payload.session_id},
                {"$set": {"status": "ANALYSIS_COMPLETED", "updated_at": datetime.now(timezone.utc).isoformat(), "business_summary": biz, "website_summary": web}},
            )
        except Exception:
            pass

        return {"business": biz, "website": web}

    def _brief_html(profile: dict, summary: Optional[dict], roadmap_md: Optional[str], transcript: List[dict], lead_score: int, session_id: str) -> str:
        def row(label, value):
            v = value or "—"
            return f'<tr><td style="color:#A0A0A0;padding:6px 0;vertical-align:top;width:180px;">{label}</td><td style="padding:6px 0;color:#ECECEC;">{v}</td></tr>'

        biz = (summary or {}).get("business", {}) if summary else {}
        web = (summary or {}).get("website", {}) if summary else None
        transcript_html = "".join(
            f'<div style="margin-bottom:8px;"><span style="color:#F43F5E;font-family:monospace;font-size:11px;letter-spacing:.15em;text-transform:uppercase;">{t.get("role","")}</span><div style="color:#ECECEC;font-size:13px;line-height:1.55;">{t.get("text","")}</div></div>'
            for t in transcript[-30:]
        )
        return f"""
        <div style="font-family:Inter,Arial,sans-serif;background:#000;color:#fff;padding:24px;">
          <table width="720" cellpadding="0" cellspacing="0" style="margin:0 auto;max-width:720px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <tr><td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#F43F5E;font-family:monospace;">ADAM · Handover Brief</div>
              <div style="font-size:26px;font-weight:900;margin-top:8px;letter-spacing:-0.02em;">{profile.get('company') or profile.get('name') or 'New lead'}</div>
              <div style="font-size:12px;color:#A0A0A0;margin-top:6px;font-family:monospace;">Score {lead_score}/100 · Session {session_id}</div>
            </td></tr>
            <tr><td style="padding:24px 32px;">
              <div style="font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#F43F5E;font-family:monospace;margin-bottom:10px;">Lead</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.55;">
                {row('Name', profile.get('name'))}
                {row('Company', profile.get('company'))}
                {row('Email', profile.get('email'))}
                {row('Phone', profile.get('phone'))}
                {row('Website', profile.get('website'))}
                {row('Industry', profile.get('industry'))}
                {row('Business type', profile.get('business_type'))}
                {row('Location / Market', ' · '.join([x for x in [profile.get('location'), profile.get('market')] if x]))}
              </table>
            </td></tr>
            <tr><td style="padding:0 32px 24px 32px;">
              <div style="font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#F43F5E;font-family:monospace;margin-bottom:10px;">Business</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.55;">
                {row('Goal', profile.get('goal'))}
                {row('Audience', profile.get('audience'))}
                {row('Pain points', profile.get('pain_points'))}
                {row('Current marketing', profile.get('marketing_channels'))}
                {row('Budget', profile.get('budget'))}
                {row('Timeline', profile.get('timeline'))}
              </table>
            </td></tr>
            {("<tr><td style='padding:0 32px 24px 32px;'>"
              "<div style='font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#F43F5E;font-family:monospace;margin-bottom:10px;'>ADAM Summary</div>"
              f"<div style='font-size:14px;color:#ECECEC;line-height:1.7;'>"
              f"<div><strong>Business:</strong> {biz.get('business','')}</div>"
              f"<div><strong>Goal:</strong> {biz.get('primary_goal','')}</div>"
              f"<div><strong>Challenge:</strong> {biz.get('current_challenge','')}</div>"
              f"<div><strong>Opportunity:</strong> {biz.get('opportunity','')}</div>"
              f"</div></td></tr>") if biz else ""}
            {("<tr><td style='padding:0 32px 24px 32px;'>"
              "<div style='font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#F43F5E;font-family:monospace;margin-bottom:10px;'>Website snapshot</div>"
              "<div style='font-size:14px;color:#ECECEC;line-height:1.7;'>"
              f"<div><strong>Working:</strong> {web.get('whats_working','')}</div>"
              f"<div><strong>Attention:</strong> {web.get('needs_attention','')}</div>"
              f"<div><strong>Opportunity:</strong> {web.get('biggest_opportunity','')}</div>"
              f"<div><strong>Quick win:</strong> {web.get('quick_win','')}</div>"
              "</div></td></tr>") if web else ""}
            {("<tr><td style='padding:0 32px 24px 32px;'>"
              "<div style='font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#F43F5E;font-family:monospace;margin-bottom:10px;'>90-day roadmap</div>"
              f"<pre style='white-space:pre-wrap;font-family:ui-monospace,monospace;font-size:12.5px;color:#ECECEC;line-height:1.55;background:rgba(255,255,255,0.03);padding:14px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);'>{(roadmap_md or '').replace('<','&lt;')}</pre>"
              "</td></tr>") if roadmap_md else ""}
            <tr><td style="padding:0 32px 28px 32px;">
              <div style="font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#F43F5E;font-family:monospace;margin-bottom:10px;">Conversation transcript</div>
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px;max-height:420px;overflow:auto;">{transcript_html}</div>
            </td></tr>
          </table>
        </div>
        """

    @router.post("/handover")
    async def handover(payload: HandoverRequest):
        # 1. Update the adam_leads doc
        now = datetime.now(timezone.utc).isoformat()
        existing = await _load_lead(payload.session_id)
        merged_profile = (existing or {}).get("profile", {})
        merged_profile.update(payload.profile.model_dump(exclude_none=True))
        lead_id = (existing or {}).get("lead_id") or f"lead_{uuid.uuid4().hex[:12]}"
        transcript_dicts = [t.model_dump() for t in payload.transcript]
        score = _lead_score(LeadProfile(**merged_profile), len(transcript_dicts))
        lead_doc = {
            "lead_id": lead_id,
            "session_id": payload.session_id,
            "profile": merged_profile,
            "transcript": transcript_dicts,
            "status": "CONTACT_REQUESTED",
            "lead_score": score,
            "business_summary": (payload.summary or {}).get("business") if payload.summary else (existing or {}).get("business_summary"),
            "website_summary": (payload.summary or {}).get("website") if payload.summary else (existing or {}).get("website_summary"),
            "roadmap_markdown": payload.roadmap_markdown or (existing or {}).get("roadmap_markdown"),
            "created_at": (existing or {}).get("created_at") or now,
            "updated_at": now,
        }
        await db.adam_leads.update_one({"session_id": payload.session_id}, {"$set": lead_doc}, upsert=True)

        # 2. Mirror into existing `contacts` (single canonical lead sink) — never blocks
        contact_doc = {
            "id": str(uuid.uuid4()),
            "name": merged_profile.get("name") or (merged_profile.get("email") or "ADAM lead").split("@")[0],
            "email": merged_profile.get("email") or "no-reply@adam.local",
            "company": merged_profile.get("company"),
            "website": merged_profile.get("website"),
            "phone": merged_profile.get("phone"),
            "industry": merged_profile.get("industry"),
            "budget": merged_profile.get("budget"),
            "timeline": merged_profile.get("timeline"),
            "message": (
                f"[ADAM handover · score {score}/100]\n\n"
                f"Goal: {merged_profile.get('goal') or '—'}\n"
                f"Audience: {merged_profile.get('audience') or '—'}\n"
                f"Pain points: {merged_profile.get('pain_points') or '—'}\n"
                f"Current marketing: {merged_profile.get('marketing_channels') or '—'}\n"
                f"Session id: {payload.session_id}"
            ),
            "source": "adam-workspace",
            "services": [],
            "created_at": now,
        }
        try:
            await db.contacts.insert_one(contact_doc)
        except Exception:
            logger.exception("Failed to mirror ADAM lead into contacts")

        # 3. Fire off the Resend team brief (fire and forget)
        html = _brief_html(merged_profile, payload.summary, payload.roadmap_markdown, transcript_dicts, score, payload.session_id)

        async def _send():
            if not RESEND_API_KEY:
                return
            try:
                resend.api_key = RESEND_API_KEY
                subject = f"ADAM lead · {merged_profile.get('company') or merged_profile.get('name') or 'New lead'} · score {score}"
                params = {
                    "from": SENDER_EMAIL,
                    "to": [LEADS_INBOX],
                    "reply_to": [merged_profile.get("email")] if merged_profile.get("email") else None,
                    "subject": subject,
                    "html": html,
                }
                # remove None keys
                params = {k: v for k, v in params.items() if v is not None}
                await asyncio.to_thread(resend.Emails.send, params)
            except Exception:
                logger.exception("Failed to send ADAM brief email")

        asyncio.create_task(_send())

        return {"lead_id": lead_id, "status": "CONTACT_REQUESTED", "lead_score": score}

    return router
