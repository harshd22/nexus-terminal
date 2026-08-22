"""
NEXUS TERMINAL — Demo API
GET /api/demo/{scenario}
Scenarios: full_analysis | red_flag_alarm | bull_vs_bear | source_conflict | market_crash
"""
import json
import os
from fastapi import APIRouter, HTTPException
from pathlib import Path

router = APIRouter()

DEMO_DIR = Path(__file__).parent.parent.parent / "data" / "demo"

SCENARIOS = {
    "full_analysis": "full_analysis.json",
    "red_flag_alarm": "red_flag_alarm.json",
    "bull_vs_bear": "bull_vs_bear.json",
    "source_conflict": "source_conflict.json",
    "market_crash": "market_crash.json",
}


@router.get("/{scenario}")
async def get_demo_scenario(scenario: str):
    if scenario not in SCENARIOS:
        raise HTTPException(
            status_code=404,
            detail=f"Demo scenario '{scenario}' not found. Available: {list(SCENARIOS.keys())}",
        )
    file_path = DEMO_DIR / SCENARIOS[scenario]
    if not file_path.exists():
        raise HTTPException(status_code=503, detail=f"Demo file not yet generated: {scenario}")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


@router.get("")
async def list_scenarios():
    return {
        "scenarios": list(SCENARIOS.keys()),
        "description": "Use GET /api/demo/{scenario} to load a demo scenario",
    }
