import type { AtlasStats } from "./types";

/** Deterministic pseudo-random, so the demo looks the same on every render. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x1_0000_0000;
  };
}

export function demoStats(now = Math.floor(Date.now() / 1000)): AtlasStats {
  const r = rng(20261023);
  const minutes = 7 * 24 * 60;
  const series = [];
  let nodes = 1180;
  for (let i = minutes; i >= 0; i -= 10) {
    nodes += Math.round((r() - 0.47) * 6);
    series.push({
      minute: Math.floor(now / 60) - i,
      nodes,
      operators: Math.round(nodes / 14),
      searches_served: Math.round(40 + r() * 60 + 30 * Math.sin(i / 90)),
      zone_entries: 2_400_000 + (minutes - i) * 120,
      ledger_size: 51_000 + (minutes - i) * 3,
    });
  }
  const operators = Array.from({ length: 12 }, (_, i) => {
    const n = Math.round([180, 140, 120, 95, 80, 70, 60, 55, 45, 40, 30, 25][i] * (0.9 + r() * 0.2));
    return { operator: Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(r() * 16)]).join(""), nodes: n, share: 0, seniority_days: Math.round(n * (20 + r() * 40)) };
  });
  const total = operators.reduce((a, o) => a + o.nodes, 0);
  for (const o of operators) o.share = o.nodes / total;
  const kinds = ["operator_cert", "challenge_failure", "challenge_failure", "revocation", "operator_cert"];
  return {
    sampled_at: now,
    observer: "demo".padEnd(64, "0"),
    map_version: 1,
    map_zones: 65_536,
    model: "alp-embed-v1",
    nodes_known: nodes,
    operators_known: operators.length + 70,
    biggest_operator_share: operators[0].share,
    operators,
    prefixes: Array.from({ length: 20 }, (_, i) => ({ prefix: (0x0a00 + i * 613).toString(16).padStart(4, "0"), nodes: Math.round(90 - i * 4 + r() * 10) })),
    seniority_histogram: { "0": 140, "1-7": 210, "8-30": 260, "31-90": 300, "91-365": 240, "365+": 30 },
    zones_held: 1_204,
    zone_entries: 2_401_337,
    cards_held: 48_120,
    hot_zones: Array.from({ length: 10 }, (_, i) => ({ zone_id: Math.floor(r() * 65_536), entries: Math.round(9_000 - i * 700 + r() * 300) })),
    capacity_fill: 0.41,
    ledger_size: 51_000 + minutes * 3,
    ledger_root: Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(r() * 16)]).join(""),
    ledger_recent: Array.from({ length: 20 }, (_, i) => ({ seq: 51_000 + minutes * 3 - i, timestamp: now - i * 37, kind: kinds[i % kinds.length], subject: Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(r() * 16)]).join(""), witnesses: 1 + Math.floor(r() * 6) })),
    metrics: {
      inbound: { store: 182_311, search: 920_441, card: 44_120, challenge: 22_010, sync: 9_822, inbox: 12_441, vault: 3_310, ledger: 1_204 },
      rejected: 1_204,
      searches_made: 12_004,
      publishes_made: 3_341,
      receipts_ok: 1_002_331,
      receipts_bad: 17,
      challenges_sent: 22_010,
      challenges_failed: 311,
      served_per_minute: series.slice(-60).map((p) => [p.minute, p.searches_served] as [number, number]),
    },
    series,
  };
}
