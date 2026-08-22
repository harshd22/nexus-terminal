/**
 * NEXUS TERMINAL — API Client
 * Typed axios wrapper for all backend endpoints
 */
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ─── Health ──────────────────────────────────────────────────
export const getHealth = () => api.get("/api/health").then((r) => r.data);

// ─── Stocks ──────────────────────────────────────────────────
export const searchStocks = (q: string) =>
  api.get(`/api/stocks/search?q=${encodeURIComponent(q)}`).then((r) => r.data);

export const getStock = (symbol: string) =>
  api.get(`/api/stocks/${symbol}`).then((r) => r.data);

export const getStockPrices = (symbol: string, range = "1Y") =>
  api.get(`/api/stocks/${symbol}/prices?range=${range}`).then((r) => r.data);

export const getStockFundamentals = (symbol: string) =>
  api.get(`/api/stocks/${symbol}/fundamentals`).then((r) => r.data);

export const getStockStatements = (symbol: string) =>
  api.get(`/api/stocks/${symbol}/statements`).then((r) => r.data);

export const getStockShareholding = (symbol: string) =>
  api.get(`/api/stocks/${symbol}/shareholding`).then((r) => r.data);

export const getStockNews = (symbol: string, limit = 20) =>
  api.get(`/api/stocks/${symbol}/news?limit=${limit}`).then((r) => r.data);

export const getStockRedFlags = (symbol: string) =>
  api.get(`/api/stocks/${symbol}/red-flags`).then((r) => r.data);

export const getStockScore = (symbol: string) =>
  api.get(`/api/stocks/${symbol}/score`).then((r) => r.data);

export const getStockSWOT = (symbol: string) =>
  api.get(`/api/stocks/${symbol}/swot`).then((r) => r.data);

export const postStockDebate = (symbol: string) =>
  api.post(`/api/stocks/${symbol}/debate`).then((r) => r.data);

// ─── Market ──────────────────────────────────────────────────
export const getMarket = () => api.get("/api/market").then((r) => r.data);

export const getMarketBreadth = (limit = 60) =>
  api.get(`/api/market/breadth?limit=${limit}`).then((r) => r.data);

export const getWinnersLosers = (category = "ALL") =>
  api.get(`/api/market/winners-losers?category=${category}`).then((r) => r.data);

export const getTopPerformers = (category = "LARGE", limit = 20) =>
  api
    .get(`/api/market/top-performers?category=${category}&limit=${limit}`)
    .then((r) => r.data);

export const getStockConsensus = (symbol: string) =>
  api.get(`/api/stocks/${symbol}/consensus`).then((r) => r.data);

export const getKeyRatios = (symbol: string) =>
  api.get(`/api/stocks/${symbol}/key-ratios`).then((r) => r.data);

export const getMarketConsensusReports = () =>
  api.get("/api/market/consensus-reports").then((r) => r.data);



// ─── Portfolio ────────────────────────────────────────────────
export const getPortfolio = () =>
  api.get("/api/portfolio").then((r) => r.data);

export const getPortfolioHoldings = () =>
  api.get("/api/portfolio/holdings").then((r) => r.data);

export const getPortfolioPositions = () =>
  api.get("/api/portfolio/positions").then((r) => r.data);

export const getPortfolioAllocation = () =>
  api.get("/api/portfolio/allocation").then((r) => r.data);

export const getPortfolioHealth = () =>
  api.get("/api/portfolio/health").then((r) => r.data);

// ─── News ─────────────────────────────────────────────────────
export const getNews = (category?: string, limit = 50) =>
  api
    .get(`/api/news${category ? `?category=${category}&limit=${limit}` : `?limit=${limit}`}`)
    .then((r) => r.data);

// ─── Demo ─────────────────────────────────────────────────────
export const getDemoScenario = (scenario: string) =>
  api.get(`/api/demo/${scenario}`).then((r) => r.data);

// ─── Kite ─────────────────────────────────────────────────────
export const getKiteStatus = () =>
  api.get("/api/kite/status").then((r) => r.data);
