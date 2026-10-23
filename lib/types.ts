/** Mirrors `AtlasStats` from the Grid's openapi.json (GET /v1/atlas/stats). */
export interface SeriesPoint {
  minute: number;
  nodes: number;
  operators: number;
  searches_served: number;
  zone_entries: number;
  ledger_size: number;
}
export interface OperatorStat {
  operator: string;
  nodes: number;
  share: number;
  seniority_days: number;
}
export interface PrefixStat {
  prefix: string;
  nodes: number;
}
export interface ZoneStat {
  zone_id: number;
  entries: number;
}
export interface LedgerSummary {
  seq: number;
  timestamp: number;
  kind: string;
  subject: string;
  witnesses: number;
}
export interface MetricsSnapshot {
  inbound: Record<string, number>;
  rejected: number;
  searches_made: number;
  publishes_made: number;
  receipts_ok: number;
  receipts_bad: number;
  challenges_sent: number;
  challenges_failed: number;
  served_per_minute: [number, number][];
}
export interface AtlasStats {
  sampled_at: number;
  observer: string;
  map_version: number;
  map_zones: number;
  model: string;
  nodes_known: number;
  operators_known: number;
  biggest_operator_share: number;
  operators: OperatorStat[];
  prefixes: PrefixStat[];
  seniority_histogram: Record<string, number>;
  zones_held: number;
  zone_entries: number;
  cards_held: number;
  hot_zones: ZoneStat[];
  capacity_fill: number;
  ledger_size: number;
  ledger_root: string;
  ledger_recent: LedgerSummary[];
  metrics: MetricsSnapshot;
  series: SeriesPoint[];
}

export interface StatsView {
  stats: AtlasStats;
  /** Which observer answered, or "demo". */
  source: string;
  demo: boolean;
  fetchedAt: number;
}

export interface SearchHit {
  agent_id: string;
  card_version: number;
  trait_index: number;
  text: string;
  score: number;
  last_seen: number;
  kind: unknown;
}
export interface AgentResult {
  agent_id: string;
  card_version: number;
  score: number;
  last_seen: number;
  best_trait: string;
  matches: SearchHit[];
}
export interface SearchResult {
  results: AgentResult[];
  zones_queried: number[];
  guardians_answered: number;
  cached: boolean;
  took_ms: number;
}
