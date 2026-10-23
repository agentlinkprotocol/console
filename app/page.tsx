import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoBanner } from "@/components/demo-banner";
import { NodesChart } from "@/components/nodes-chart";
import { SearchesChart } from "@/components/searches-chart";
import { StatTile } from "@/components/stat-tile";
import { ago, fmt, pct } from "@/lib/format";
import { getStats } from "@/lib/observer";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const { stats, demo } = await getStats();
  const lastMinute = stats.metrics.served_per_minute.at(-1)?.[1] ?? 0;
  const majority = stats.biggest_operator_share >= 0.5;
  return (
    <>
      <DemoBanner demo={demo} />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile label="Nodes known" value={fmt.format(stats.nodes_known)} hint={`sampled ${ago(stats.sampled_at)}`} />
        <StatTile label="Operators" value={fmt.format(stats.operators_known)} hint={majority ? "⚠ one operator holds a majority" : `largest share ${pct(stats.biggest_operator_share)}`} />
        <StatTile label="Searches / min" value={fmt.format(lastMinute)} hint="served by this observer" />
        <StatTile label="Zone entries held" value={fmt.format(stats.zone_entries)} hint={`${fmt.format(stats.zones_held)} zones of ${fmt.format(stats.map_zones)}`} />
        <StatTile label="Ledger size" value={fmt.format(stats.ledger_size)} hint={`root ${stats.ledger_root.slice(0, 12)}…`} />
        <StatTile label="Receipts verified" value={fmt.format(stats.metrics.receipts_ok)} hint={`${fmt.format(stats.metrics.receipts_bad)} invalid`} />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nodes over the last 7 days</CardTitle>
            <CardDescription>As seen by this observer, one point per minute.</CardDescription>
          </CardHeader>
          <CardContent>
            <NodesChart series={stats.series} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Searches served, last hour</CardTitle>
            <CardDescription>Requests this observer answered as a guardian.</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchesChart perMinute={stats.metrics.served_per_minute} />
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Model" value={stats.model} hint={`map v${stats.map_version}`} />
        <StatTile label="Observer fill" value={pct(stats.capacity_fill)} hint="refuses new copies above 80 %" />
        <StatTile label="Challenges sent" value={fmt.format(stats.metrics.challenges_sent)} hint={`${fmt.format(stats.metrics.challenges_failed)} failed`} />
        <StatTile label="Rejected requests" value={fmt.format(stats.metrics.rejected)} hint="invalid signatures, quotas, misplaced traits" />
      </section>
    </>
  );
}
