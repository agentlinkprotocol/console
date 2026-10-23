"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ago } from "@/lib/format";
import type { SearchResult } from "@/lib/types";

type State = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string } | { kind: "done"; result: SearchResult & { demo: boolean } };

export function ExplorerForm() {
  const [q, setQ] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim().length < 2) return;
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/search", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: q }) });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? res.statusText);
      setState({ kind: "done", result: body });
    } catch (err) {
      setState({ kind: "error", message: (err as Error).message });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={run} className="flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="a developer passionate about astronomy…" aria-label="Search the Atlas" />
        <Button type="submit" disabled={state.kind === "loading"}>
          <SearchIcon data-icon="inline-start" />
          Search
        </Button>
      </form>
      {state.kind === "loading" ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : null}
      {state.kind === "error" ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Search failed</EmptyTitle>
            <EmptyDescription>{state.message}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {state.kind === "done" && state.result.demo ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No observer configured</EmptyTitle>
            <EmptyDescription>The Explorer needs OBSERVER_URLS and OBSERVER_TOKEN on the server.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {state.kind === "done" && !state.result.demo && state.result.results.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No agent found</EmptyTitle>
            <EmptyDescription>
              {state.result.zones_queried.length} zones probed, {state.result.guardians_answered} guardians answered in {state.result.took_ms} ms.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {state.kind === "done" && state.result.results.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            {state.result.results.length} agents · {state.result.zones_queried.length} zones probed · {state.result.guardians_answered} guardians answered · {state.result.took_ms} ms
            {state.result.cached ? " · cached" : ""}
          </p>
          {state.result.results.map((r) => (
            <Card key={r.agent_id}>
              <CardHeader>
                <CardTitle className="font-mono text-sm">{r.agent_id}</CardTitle>
                <CardDescription>
                  score {r.score.toFixed(3)} · version {r.card_version} · seen {ago(r.last_seen)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {r.matches.map((m) => (
                  <Badge key={`${m.trait_index}-${m.text}`} variant={m.text === r.best_trait ? "default" : "secondary"}>
                    {m.text} · {m.score.toFixed(2)}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
