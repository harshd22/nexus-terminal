#!/usr/bin/env pwsh
# NEXUS TERMINAL — Quick Start Script (Windows PowerShell)
# Run from the nexus-terminal/ directory

Write-Host "=============================" -ForegroundColor Cyan
Write-Host "  NEXUS TERMINAL — STARTING  " -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Start backend
Write-Host "`n[1/3] Starting FastAPI backend on :8000..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python seed_universe.py; uvicorn main:app --reload --port 8000" -WindowStyle Normal

Start-Sleep 3

# Start frontend
Write-Host "[2/3] Starting Next.js frontend on :3000..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

Start-Sleep 3

Write-Host "[3/3] Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host "`n✔ NEXUS TERMINAL STARTING" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "`n  RESEARCH & EDUCATION ONLY — NOT INVESTMENT ADVICE" -ForegroundColor Red
