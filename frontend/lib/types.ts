/**
 * NEXUS TERMINAL — TypeScript Types
 * Shared across all frontend components
 */

export interface StockSearchResult {
  symbol: string;
  name: string;
  nse_symbol: string | null;
  bse_code: string | null;
  sector: string | null;
  market_cap_category: "LARGE" | "MID" | "SMALL" | null;
  exchanges: string;
}

export interface IndexQuote {
  name: string;
  symbol: string;
  value: number | null;
  change: number | null;
  change_pct: number | null;
  high: number | null;
  low: number | null;
  open: number | null;
  previous_close: number | null;
  source: string;
  source_url?: string;
  timestamp: string;
  status: "LIVE" | "SOURCE_UNAVAILABLE";
}

export interface Candle {
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export interface Technicals {
  current_price: number | null;
  dma_20: number | null;
  dma_50: number | null;
  dma_100: number | null;
  dma_200: number | null;
  high_52w: number | null;
  low_52w: number | null;
  ath: number | null;
  distance_from_ath_pct: number | null;
  return_1y_cagr: number | null;
  return_3y_cagr: number | null;
  return_5y_cagr: number | null;
  sma_20_series: (number | null)[];
  sma_50_series: (number | null)[];
  sma_100_series: (number | null)[];
  sma_200_series: (number | null)[];
}

export interface PriceData {
  symbol: string;
  range: string;
  source: string;
  candles: Candle[];
  technicals: Technicals;
  count: number;
}

export interface Fundamental {
  period: string;
  period_type: string;
  revenue: number | null;
  ebitda: number | null;
  net_profit: number | null;
  eps: number | null;
  pe: number | null;
  pb: number | null;
  roe: number | null;
  roce: number | null;
  debt: number | null;
  debt_equity: number | null;
  interest_coverage: number | null;
  operating_cash_flow: number | null;
  free_cash_flow: number | null;
  revenue_growth: number | null;
  profit_growth: number | null;
  ebitda_margin: number | null;
  source: string;
  data_date: string | null;
}

export interface ShareholdingRecord {
  quarter: string;
  promoter_pct: number | null;
  fii_pct: number | null;
  dii_pct: number | null;
  public_pct: number | null;
  promoter_pledge_pct: number | null;
  source: string;
  data_date: string | null;
}

export interface RedFlagResult {
  rule_id: number;
  rule_name: string;
  status: "PASS" | "WARN" | "FAIL" | "NA";
  value: number | null;
  threshold: number | null;
  formula: string | null;
  explanation: string;
  source: string | null;
  data_date: string | null;
}

export interface ScoreComponent {
  score: number;
  weight: number;
  contribution: number;
  inputs: Record<string, unknown>;
}

export interface ScoreData {
  total_score: number;
  base_score: number;
  penalty: number;
  components: {
    valuation: ScoreComponent;
    growth: ScoreComponent;
    financial_health: ScoreComponent;
    momentum: ScoreComponent;
    sector_tailwind: ScoreComponent;
  };
  formula: string;
  flag_penalties: Array<{ rule: string; status: string; penalty: number }>;
}

export interface NewsArticle {
  id: number;
  headline: string;
  description: string | null;
  ticker: string | null;
  source: string | null;
  source_url: string | null;
  category: string | null;
  published_at: string | null;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | null;
}

export interface Holding {
  symbol: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  pnl: number;
  day_pnl: number;
  source: string;
}

export interface AllocationSegment {
  symbol: string;
  current_value: number;
  weight_pct: number;
  day_pnl: number | null;
  overall_pnl: number;
}

export interface PortfolioStats {
  total_invested: number;
  current_value: number;
  overall_pnl: number;
  overall_pnl_pct: number;
  day_pnl: number;
  holdings_count: number;
  demo_mode: boolean;
}

export interface BreadthObservation {
  timestamp: string;
  winner_count: number;
  loser_count: number;
  unchanged_count: number | null;
  total_count: number | null;
  breadth_pct: number;
  source: string;
}

export interface BreadthData {
  observations: BreadthObservation[];
  latest: {
    winner_count: number;
    loser_count: number;
    unchanged_count: number;
    breadth_pct: number;
  } | null;
  source: string;
  timestamp: string;
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  disclaimer: string;
  model: string;
  evidence_hash: string;
}

export interface DebateRound {
  round: number;
  bull: string;
  bear: string;
}

export interface DebateData {
  company: string;
  rounds: DebateRound[];
  model: string;
  evidence_hash: string;
  disclaimer: string;
}

export interface TopPerformer {
  rank: number;
  symbol: string;
  name: string;
  sector: string | null;
  market_cap_category: string;
  current_price: number;
  return_1y_pct: number;
  price_date: string;
}

export interface TerminalLogStep {
  message: string;
  status: "pending" | "active" | "done" | "error";
}
