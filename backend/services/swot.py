"""
NEXUS TERMINAL — SWOT Generation Service
Calls Ollama (local) with evidence pack.
AI may only explain — never calculate or invent numbers.
"""
from __future__ import annotations
import httpx
import json
import logging
from core.config import settings

logger = logging.getLogger("nexus.swot")

SWOT_SYSTEM_PROMPT = """You are a financial analyst assistant for NEXUS TERMINAL.
You will receive a verified evidence pack containing pre-calculated financial metrics.

STRICT RULES:
1. NEVER invent, estimate, or assume any numbers not in the evidence pack.
2. NEVER give buy/sell recommendations.
3. Every factual statement MUST cite its source from the evidence pack.
4. If any data is missing, explicitly state DATA UNAVAILABLE for that point.
5. Python has already calculated all financial metrics — your role is explanation only.
6. Write in a professional, neutral, analytical tone.

Return valid JSON with this exact structure:
{
  "strengths": ["Point 1 [Source, Date]", "Point 2 [Source, Date]", ...],
  "weaknesses": ["Point 1 [Source, Date]", ...],
  "opportunities": ["Point 1 [Source, Date]", ...],
  "threats": ["Point 1 [Source, Date]", ...],
  "disclaimer": "Research and education only — not investment advice."
}
"""


async def generate_swot(evidence: dict) -> dict | None:
    if not settings.ollama_base_url:
        return None

    company = evidence.get("company", {}).get("name", "the company")
    prompt = (
        f"Analyze {company} using ONLY the following evidence pack. "
        f"Return SWOT as JSON.\n\nEVIDENCE PACK:\n{json.dumps(evidence, default=str, indent=2)}"
    )

    try:
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{settings.ollama_base_url}/api/generate",
                json={
                    "model": settings.ollama_model,
                    "prompt": prompt,
                    "system": SWOT_SYSTEM_PROMPT,
                    "stream": False,
                    "format": "json",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            raw = data.get("response", "")
            swot = json.loads(raw)
            swot["model"] = settings.ollama_model
            swot["evidence_hash"] = evidence.get("evidence_hash")
            return swot
    except Exception as e:
        logger.error("SWOT generation error: %s", e)
        return None
