"""
NEXUS TERMINAL — Bull vs Bear Debate Service
Two AI personas, identical evidence, three rounds.
AI only interprets — Python calculates.
"""
from __future__ import annotations
import httpx
import json
import logging
from core.config import settings

logger = logging.getLogger("nexus.debate")

BULL_SYSTEM = """You are BULL — the optimistic analyst in a structured debate.
You must build the strongest evidence-based bull case using ONLY the provided evidence pack.
RULES:
- NEVER invent numbers. Only use figures from the evidence pack with source citations.
- Do NOT give investment advice.
- You may interpret data favorably but cannot fabricate it.
- Keep each round to 3-4 concise, high-impact points.
- Format: plain text, professional, institutional tone.
"""

BEAR_SYSTEM = """You are BEAR — the skeptical analyst in a structured debate.
You must build the strongest evidence-based bear case using ONLY the provided evidence pack.
RULES:
- NEVER invent numbers. Only use figures from the evidence pack with source citations.
- Do NOT give investment advice.
- You may interpret data critically but cannot fabricate it.
- Keep each round to 3-4 concise, high-impact points.
- Format: plain text, professional, institutional tone.
"""


async def _call_ollama(system: str, prompt: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{settings.ollama_base_url}/api/generate",
                json={
                    "model": settings.ollama_model,
                    "prompt": prompt,
                    "system": system,
                    "stream": False,
                },
            )
            resp.raise_for_status()
            return resp.json().get("response", "AI_UNAVAILABLE")
    except Exception as e:
        logger.error("Ollama call error: %s", e)
        return "AI_UNAVAILABLE"


async def generate_debate(evidence: dict) -> dict:
    if not settings.ollama_base_url:
        return {"error": "AI_UNAVAILABLE", "rounds": []}

    company = evidence.get("company", {}).get("name", "the company")
    evidence_str = json.dumps(evidence, default=str, indent=2)

    rounds = []

    for round_num in range(1, 4):
        prev_context = "\n\n".join(
            f"ROUND {r['round']} — BULL:\n{r['bull']}\n\nROUND {r['round']} — BEAR:\n{r['bear']}"
            for r in rounds
        )

        bull_prompt = (
            f"ROUND {round_num} of 3. Debate about {company}.\n"
            f"{'Previous rounds:\n' + prev_context if prev_context else ''}\n\n"
            f"EVIDENCE PACK:\n{evidence_str}\n\n"
            f"State your Round {round_num} bull case. You may rebut the bear's previous arguments "
            f"using evidence from the pack only."
        )
        bear_prompt = (
            f"ROUND {round_num} of 3. Debate about {company}.\n"
            f"{'Previous rounds:\n' + prev_context if prev_context else ''}\n\n"
            f"EVIDENCE PACK:\n{evidence_str}\n\n"
            f"State your Round {round_num} bear case. You may rebut the bull's previous arguments "
            f"using evidence from the pack only."
        )

        bull_response = await _call_ollama(BULL_SYSTEM, bull_prompt)
        bear_response = await _call_ollama(BEAR_SYSTEM, bear_prompt)

        rounds.append({
            "round": round_num,
            "bull": bull_response,
            "bear": bear_response,
        })

    return {
        "company": company,
        "rounds": rounds,
        "model": settings.ollama_model,
        "evidence_hash": evidence.get("evidence_hash"),
        "disclaimer": "Research and education only — not investment advice.",
    }
