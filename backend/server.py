from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import base64
import logging
import resend
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup (only used if RESEND_API_KEY is configured)
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
LEADS_INBOX = os.environ.get('LEADS_INBOX', 'hello.adcommedia@gmail.com')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# ElevenLabs (ADAM Protocol voice) — optional, only if key configured
ELEVENLABS_API_KEY = os.environ.get('ELEVENLABS_API_KEY')
ELEVENLABS_VOICE_ID = os.environ.get('ELEVENLABS_VOICE_ID', 'pNInz6obpgDQGcFmaJgB')
_el_client = None
_voice_cache = {}
if ELEVENLABS_API_KEY:
    try:
        from elevenlabs.client import ElevenLabs
        _el_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
    except Exception as _e:  # pragma: no cover
        logging.getLogger(__name__).warning(f"ElevenLabs init failed: {_e}")

app = FastAPI(title="Adcom Media API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=160)
    website: Optional[str] = Field(default=None, max_length=200)
    phone: Optional[str] = Field(default=None, max_length=40)
    industry: Optional[str] = Field(default=None, max_length=120)
    team_size: Optional[str] = Field(default=None, max_length=40)
    budget: Optional[str] = Field(default=None, max_length=60)
    services: Optional[List[str]] = Field(default_factory=list)
    challenge: Optional[str] = Field(default=None, max_length=120)
    timeline: Optional[str] = Field(default=None, max_length=60)
    hear_about: Optional[str] = Field(default=None, max_length=200)
    project_type: Optional[str] = Field(default=None, max_length=120)
    position: Optional[str] = Field(default=None, max_length=120)
    linkedin: Optional[str] = Field(default=None, max_length=200)
    portfolio: Optional[str] = Field(default=None, max_length=200)
    resume_url: Optional[str] = Field(default=None, max_length=500)
    meeting_date: Optional[str] = Field(default=None, max_length=40)
    source: Optional[str] = Field(default=None, max_length=80)
    message: str = Field(..., min_length=1, max_length=4000)


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    industry: Optional[str] = None
    team_size: Optional[str] = None
    budget: Optional[str] = None
    services: List[str] = Field(default_factory=list)
    challenge: Optional[str] = None
    timeline: Optional[str] = None
    hear_about: Optional[str] = None
    project_type: Optional[str] = None
    position: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    resume_url: Optional[str] = None
    meeting_date: Optional[str] = None
    source: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Adcom Media API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    try:
        contact = Contact(**payload.model_dump())
        doc = contact.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.contacts.insert_one(doc)
        # Fire-and-forget lead notification email (do not block the response)
        asyncio.create_task(_send_lead_email(contact))
        return contact
    except Exception as e:
        logger.exception("Failed to save contact")
        raise HTTPException(status_code=500, detail="Could not save your message")


async def _send_lead_email(contact: 'Contact') -> None:
    """Send a formatted lead notification to LEADS_INBOX via Resend.
    Silently no-ops if RESEND_API_KEY is not set."""
    if not RESEND_API_KEY:
        logger.info("RESEND_API_KEY not set, skipping email notification.")
        return
    try:
        services_html = ''.join(
            f'<li style="margin:0 0 4px 0;">{s}</li>' for s in (contact.services or [])
        ) or '<li style="color:#777;">None selected</li>'

        html = f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Inter,Arial,sans-serif;background:#000;color:#fff;padding:0;margin:0;">
          <tr><td align="center" style="padding:32px 16px;">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
              <tr><td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#E11D2E;font-family:monospace;">New Engagement Brief</div>
                <div style="font-size:28px;font-weight:900;margin-top:8px;letter-spacing:-0.02em;">Adcom Media · Lead</div>
              </td></tr>
              <tr><td style="padding:28px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
                  <tr><td width="140" style="color:#A0A0A0;padding:8px 0;vertical-align:top;">Name</td><td style="padding:8px 0;">{contact.name}</td></tr>
                  <tr><td style="color:#A0A0A0;padding:8px 0;vertical-align:top;">Email</td><td style="padding:8px 0;"><a href="mailto:{contact.email}" style="color:#F43F5E;text-decoration:none;">{contact.email}</a></td></tr>
                  <tr><td style="color:#A0A0A0;padding:8px 0;vertical-align:top;">Company</td><td style="padding:8px 0;">{contact.company or ''}</td></tr>
                  <tr><td style="color:#A0A0A0;padding:8px 0;vertical-align:top;">Website</td><td style="padding:8px 0;">{contact.website or ''}</td></tr>
                  <tr><td style="color:#A0A0A0;padding:8px 0;vertical-align:top;">Budget</td><td style="padding:8px 0;">{contact.budget or ''}</td></tr>
                  <tr><td style="color:#A0A0A0;padding:8px 0;vertical-align:top;">Capabilities</td><td style="padding:8px 0;"><ul style="margin:0;padding-left:18px;">{services_html}</ul></td></tr>
                </table>
              </td></tr>
              <tr><td style="padding:0 32px 28px 32px;">
                <div style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#A0A0A0;font-family:monospace;margin-bottom:10px;">Strategic objectives</div>
                <div style="font-size:15px;line-height:1.65;color:#ECECEC;white-space:pre-wrap;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;">{contact.message}</div>
              </td></tr>
              <tr><td style="padding:18px 32px;background:#000;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#A0A0A0;font-family:monospace;">
                Submitted · {contact.created_at.strftime('%d %b %Y · %H:%M UTC')}
              </td></tr>
            </table>
          </td></tr>
        </table>
        """

        params = {
            "from": SENDER_EMAIL,
            "to": [LEADS_INBOX],
            "reply_to": [contact.email],
            "subject": f"New Adcom lead · {contact.name}" + (f" · {contact.company}" if contact.company else ""),
            "html": html,
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info("Lead email sent: %s", result.get('id') if isinstance(result, dict) else result)
    except Exception:
        logger.exception("Failed to send lead notification email")


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts():
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for it in items:
        if isinstance(it.get('created_at'), str):
            it['created_at'] = datetime.fromisoformat(it['created_at'])
    return items


class VoiceRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=400)


def _generate_voice(text: str) -> bytes:
    from elevenlabs import VoiceSettings
    audio = _el_client.text_to_speech.convert(
        voice_id=ELEVENLABS_VOICE_ID,
        model_id="eleven_multilingual_v2",
        text=text,
        output_format="mp3_44100_128",
        voice_settings=VoiceSettings(
            stability=0.55, similarity_boost=0.8, style=0.12, use_speaker_boost=True
        ),
    )
    return b"".join(audio)


@api_router.get("/adam/voice/status")
async def adam_voice_status():
    return {"enabled": bool(_el_client)}


@api_router.post("/adam/voice")
async def adam_voice(req: VoiceRequest):
    if not _el_client:
        raise HTTPException(status_code=503, detail="Voice engine not configured")
    cache_key = f"{ELEVENLABS_VOICE_ID}:{req.text}"
    if cache_key in _voice_cache:
        return {"audio": _voice_cache[cache_key]}
    try:
        audio_bytes = await asyncio.to_thread(_generate_voice, req.text)
        data_url = "data:audio/mpeg;base64," + base64.b64encode(audio_bytes).decode("utf-8")
        _voice_cache[cache_key] = data_url
        return {"audio": data_url}
    except Exception as e:
        logger.error(f"ElevenLabs TTS error: {e}")
        raise HTTPException(status_code=502, detail="Voice generation failed")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
