import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DemoBanner } from "@/components/demo-banner";
import { StatTile } from "@/components/stat-tile";
import { fmt, pct } from "@/lib/format";
import { getStats } from "@/lib/observer";

export const dynamic = "force-dynamic";

export default async function ZonesPage() {
  const { stats, demo } = await getStats();
  return (
    <>
      <DemoBanner demo={demo} />
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Zones in the map" value={fmt.format(stats.map_zones)} hint={`map v${stats.map_version}, ${stats.model}`} />
        <StatTile label="Zones this observer guards" value={fmt.format(stats.zones_held)} hint="the 20 closest nodes guard each zone" />
        <StatTile label="Entries held" value={fmt.format(stats.zone_entries)} hint={`${fmt.format(stats.cards_held)} full cards`} />
        <StatTile label="Fill ratio" value={pct(stats.capacity_fill)} hint="overflow at 80 %" />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Hottest zones held by this observer</CardTitle>
          <CardDescription>Zones are neighbourhoods of the vector space, not categories: nobody decides what they contain.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead>Coarse group</TableHead>
                <TableHead className="text-right">Entries</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.hot_zones.map((z) => (
                <TableRow key={z.zone_id}>
                  <TableCell className="font-mono">{z.zone_id}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{Math.floor(z.zone_id / Math.max(1, stats.map_zones / 256))}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt.format(z.entries)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
