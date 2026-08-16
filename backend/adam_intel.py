"""ADAM Intelligence Layer — website scraper + streaming GPT strategist chat."""
import asyncio
import logging
import os
import re
from pathlib import Path
from typing import List, Optional
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, HttpUrl
from openai import AsyncOpenAI

load_dotenv(Path(__file__).parent / ".env")
logger = logging.getLogger(__name__)


def _llm_key() -> Optional[str]:
    # Support for standard OPENAI_API_KEY as well as the old EMERGENT_LLM_KEY
    return os.environ.get("OPENAI_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")


def _model_name() -> str:
    # Use standard OpenAI models by default if old custom name is found
    model = os.environ.get("ADAM_LLM_MODEL", "gpt-4o")
    if "sol" in model:
        return "gpt-4-turbo"
    return model

MODE_PROMPTS = {
    "strategy": (
        "You are ADAM — the AI Chief Marketing Officer at Adcom Media, a premium Awwwards-caliber "
        "growth studio based in Pune, India. You are opinionated, senior, and brutally clear. "
        "Behave like a top-tier CMO advising a founder. Combine sharp diagnostics with concrete tactics. "
        "Structure every reply with short punchy sections, using bold H3 headings (### like this) and tight bullets. "
        "Never generic — always tie recommendations back to the brand's website context you were shown."
    ),
    "seo": (
        "You are ADAM — Adcom Media's AI SEO strategist. You specialise in AI-SEO (LLM citation), technical SEO, "
        "topical authority, and answer-engine optimisation for Perplexity, ChatGPT, Gemini. Diagnose specifically: "
        "what to fix on-page, what schema is missing, what content gaps exist, which entities to own. "
        "Structure with clear ### section headings and tight bullets. Always end with a prioritised 3-item action list."
    ),
    "growth": (
        "You are ADAM — Adcom Media's AI Growth strategist. You think in terms of unit economics, CAC:LTV, "
        "channel diversification, creative iteration, and lifecycle. Reference the brand's actual site content. "
        "Diagnose the growth model, not just channels. Use ### section headings. End with a 90-day sprint plan."
    ),
    "brand": (
        "You are ADAM — Adcom Media's brand strategist. You believe brand is infrastructure, not decoration. "
        "Diagnose the brand's positioning, voice, and category ownership from the site copy. "
        "Use ### section headings. End with a 3-move brand plan (positioning, voice, visual system) they can execute this quarter."
    ),
}


class ScrapeRequest(BaseModel):
    url: HttpUrl


class ScrapeResponse(BaseModel):
    url: str
    title: str
    description: str
    h1: List[str]
    h2: List[str]
    text_sample: str
    word_count: int
    language: Optional[str] = None


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    text: str


class ChatRequest(BaseModel):
    session_id: str = Field(..., min_length=6, max_length=80)
    mode: str = "strategy"
    message: str = Field(..., min_length=1, max_length=4000)
    site_context: Optional[str] = None  # scraped summary the frontend passed
    history: List[ChatMessage] = Field(default_factory=list)


class RoadmapRequest(BaseModel):
    session_id: str
    site_context: Optional[str] = None
    goal: str = Field(..., min_length=3, max_length=1000)


async def _fetch_html(url: str) -> str:
    async with httpx.AsyncClient(
        timeout=12,
        follow_redirects=True,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"},
    ) as http:
        r = await http.get(url)
        r.raise_for_status()
        return r.text


def _parse_html(url: str, html: str) -> ScrapeResponse:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    title = (soup.title.string or "").strip() if soup.title else ""
    desc = ""
    md = soup.find("meta", attrs={"name": "description"})
    if md and md.get("content"):
        desc = md["content"].strip()
    else:
        og = soup.find("meta", attrs={"property": "og:description"})
        if og and og.get("content"):
            desc = og["content"].strip()
    h1s = [h.get_text(strip=True) for h in soup.find_all("h1")][:5]
    h2s = [h.get_text(strip=True) for h in soup.find_all("h2")][:10]
    body_text = " ".join(soup.get_text(" ", strip=True).split())
    lang = None
    html_tag = soup.find("html")
    if html_tag and html_tag.get("lang"):
        lang = html_tag["lang"]
    return ScrapeResponse(
        url=url,
        title=title[:250],
        description=desc[:400],
        h1=h1s,
        h2=h2s,
        text_sample=body_text[:3500],
        word_count=len(body_text.split()),
        language=lang,
    )


def build_adam_router() -> APIRouter:
    router = APIRouter(prefix="/api/adam", tags=["adam"])

    @router.get("/status")
    async def status():
        return {
            "llm_enabled": bool(_llm_key()),
            "model": _model_name(),
        }

    @router.post("/scrape", response_model=ScrapeResponse)
    async def scrape(payload: ScrapeRequest):
        url = str(payload.url)
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            raise HTTPException(status_code=400, detail="Only http(s) URLs are supported")
        try:
            html = await _fetch_html(url)
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=400, detail=f"Site returned {e.response.status_code}")
        except Exception as e:
            logger.warning("Scrape failed for %s: %s", url, e)
            raise HTTPException(status_code=400, detail="Could not reach that URL")
        return _parse_html(url, html)

    def _build_system_message(mode: str, site_context: Optional[str]) -> str:
        base = MODE_PROMPTS.get(mode, MODE_PROMPTS["strategy"])
        if site_context:
            base += (
                "\n\n---\nBRAND CONTEXT (from their live website):\n"
                + site_context[:3500]
                + "\n---"
            )
        base += (
            "\n\nFormat rules: Never write walls of text. Use ### headings, bullets, and short paragraphs. "
            "If the user asks something outside marketing/brand/growth/SEO, gently redirect."
        )
        return base

    @router.post("/chat")
    async def chat(payload: ChatRequest):
        key = _llm_key()
        if not key:
            raise HTTPException(status_code=503, detail="AI engine not configured")

        system_msg = _build_system_message(payload.mode, payload.site_context)
        client = AsyncOpenAI(api_key=key)

        messages = [{"role": "system", "content": system_msg}]
        for msg in payload.history[-10:]:  # Keep last 10 messages for context
            messages.append({"role": msg.role, "content": msg.text})
        messages.append({"role": "user", "content": payload.message})

        async def token_stream():
            try:
                stream = await client.chat.completions.create(
                    model=_model_name(),
                    messages=messages,
                    stream=True,
                )
                async for chunk in stream:
                    content = chunk.choices[0].delta.content
                    if content:
                        # split on newlines to keep SSE valid
                        for line in content.replace("\r", "").split("\n"):
                            yield f"data: {line}\n"
                        yield "\n"
                yield "event: done\ndata: [DONE]\n\n"
            except Exception as e:
                logger.exception("ADAM chat stream failed")
                yield f"event: error\ndata: {str(e)[:200]}\n\n"

        return StreamingResponse(
            token_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
                "Connection": "keep-alive",
            },
        )

    @router.post("/roadmap")
    async def roadmap(payload: RoadmapRequest):
        """Generate a structured 90-day growth roadmap (non-streaming, single JSON reply)."""
        key = _llm_key()
        if not key:
            raise HTTPException(status_code=503, detail="AI engine not configured")

        system = (
            "You are ADAM, Adcom Media's AI CMO. Produce a crisp 90-day growth roadmap in markdown. "
            "Structure exactly: `## Diagnosis` (3 bullets), `## Positioning bet`, `## Days 1-30 · Foundation`, "
            "`## Days 31-60 · Momentum`, `## Days 61-90 · Compounding`, `## Metrics to watch` (5 bullets), "
            "`## The one hire or partner they should add`. Be specific to their site content. No fluff."
        )
        if payload.site_context:
            system += "\n\nBRAND CONTEXT:\n" + payload.site_context[:3500]

        client = AsyncOpenAI(api_key=key)

        try:
            response = await client.chat.completions.create(
                model=_model_name(),
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": f"Goal: {payload.goal}"}
                ]
            )
            reply = response.choices[0].message.content
        except Exception:
            logger.exception("Roadmap generation failed")
            raise HTTPException(status_code=502, detail="Roadmap generation failed")

        return {"markdown": reply}

    return router
