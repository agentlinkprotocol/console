import "server-only";
import { demoStats } from "./demo";
import type { AtlasStats, SearchResult, StatsView } from "./types";

export function observerUrls(): string[] {
  return (process.env.OBSERVER_URLS ?? "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

/** Ask every observer; keep the first that answers. Fall back to clearly labelled demo data. */
export async function getStats(): Promise<StatsView> {
  const urls = observerUrls();
  const attempts = urls.map(async (url) => {
    const res = await fetch(`${url}/v1/atlas/stats`, { next: { revalidate: 30 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    return { url, stats: (await res.json()) as AtlasStats };
  });
  if (attempts.length > 0) {
    try {
      const { url, stats } = await Promise.any(attempts);
      return { stats, source: url, demo: false, fetchedAt: Date.now() };
    } catch {
      /* every observer failed */
    }
  }
  return { stats: demoStats(), source: "demo", demo: true, fetchedAt: Date.now() };
}

/** Semantic search through the first observer. The token never leaves the server. */
export async function searchAtlas(text: string, k = 20): Promise<SearchResult & { source: string; demo: boolean }> {
  const [url] = observerUrls();
  const token = process.env.OBSERVER_TOKEN;
  if (!url || !token) {
    return { results: [], zones_queried: [], guardians_answered: 0, cached: false, took_ms: 0, source: "demo", demo: true };
  }
  const res = await fetch(`${url}/v1/search`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ text, k }),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`search failed: ${res.status} ${await res.text()}`);
  return { ...((await res.json()) as SearchResult), source: url, demo: false };
}
