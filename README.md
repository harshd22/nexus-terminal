# NEXUS TERMINAL

> Institutional-grade Indian equity research terminal.
> **Research and education only — not investment advice.**

---

## Architecture

```
Frontend (Next.js 14 + TypeScript + Tailwind + Recharts)
    ↕  HTTP (port 3000)
Backend (FastAPI + Python 3.11)
    ↕  SQLAlchemy
Database (SQLite → PostgreSQL)
    ↕  Provider layer
Data Sources: Kite Connect, Screener.in, RSS Feeds, NSE
    ↕  Evidence Pack
AI Layer (Ollama local) — NARRATIVE ONLY, never calculates
```

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- (Optional) Ollama for AI features

### 1. Setup environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 2. Start Backend

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:3000

### 4. Run Tests

```bash
cd backend
pytest tests/ -v
```

---

## Navigation

| Page | URL |
|------|-----|
| Market Overview | `/` |
| Stock Deep-Dive | `/stock/RELIANCE` |
| Portfolio | `/portfolio` |
| News | `/news` |
| Demo Mode | `/demo` |

## Kite Connect Setup

1. Get API key from [kite.zerodha.com/apps](https://kite.zerodha.com/apps)
2. Set `KITE_API_KEY` and `KITE_API_SECRET` in `.env`
3. Visit `http://localhost:8000/api/kite/login`
4. Copy access token to `KITE_ACCESS_TOKEN` in `.env`
5. Set `NEXT_PUBLIC_DEMO_MODE=false`

## AI Setup (Optional)

```bash
# Install Ollama from https://ollama.com
ollama pull llama3.2
# Set OLLAMA_BASE_URL=http://localhost:11434 in .env
```

## Calculation Separation

**Python calculates everything:**
- CAGR, moving averages, P/E comparisons
- Debt/equity, interest coverage
- Red flags (7 rules)
- Scorecard (weighted formula)
- Market breadth
- Portfolio metrics

**AI only explains verified evidence.** AI never invents numbers.

## Data Sources

| Data | Source | Update Frequency |
|------|--------|-----------------|
| Price history | Kite Connect | Daily |
| Fundamentals | Screener.in | Weekly |
| Shareholding | Screener.in | Quarterly |
| Index quotes | NSE India | 30s polling |
| News | RSS feeds | 15 min |
| Market breadth | NSE India | 30s polling |

## Project Structure

```
nexus-terminal/
├── frontend/          # Next.js 14 + TypeScript + Tailwind
├── backend/           # FastAPI + Python
│   ├── api/           # Route handlers
│   ├── engines/       # Pure calculation engines
│   ├── providers/     # External data providers
│   ├── services/      # AI services (SWOT, Debate)
│   └── tests/         # pytest suites
├── data/demo/         # Offline demo scenarios
├── .env.example       # Environment template
└── docker-compose.yml # Container setup
```

---

*Research and education only — not investment advice.*
