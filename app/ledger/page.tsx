import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DemoBanner } from "@/components/demo-banner";
import { StatTile } from "@/components/stat-tile";
import { ago, fmt, short } from "@/lib/format";
import { getStats } from "@/lib/observer";

export const dynamic = "force-dynamic";

const labels: Record<string, string> = { operator_cert: "operator certificate", revocation: "operator revocation", challenge_failure: "challenge failure", map_version: "map version" };

export default async function LedgerPage() {
  const { stats, demo } = await getStats();
  return (
    <>
      <DemoBanner demo={demo} />
      <section className="grid gap-4 sm:grid-cols-2">
        <StatTile label="Ledger entries" value={fmt.format(stats.ledger_size)} hint="append-only, Merkle-rooted, witnessed" />
        <StatTile label="Root" value={short(stats.ledger_root, 10)} hint="a root witnessed by many senior nodes cannot be rewritten" />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Latest public facts</CardTitle>
          <CardDescription>Operator certificates, operator revocations, challenge failures recorded by controllers, map versions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">Seq</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Witnesses</TableHead>
                <TableHead className="text-right">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.ledger_recent.map((e) => (
                <TableRow key={e.seq}>
                  <TableCell className="text-right tabular-nums">{e.seq}</TableCell>
                  <TableCell>
                    <Badge variant={e.kind === "challenge_failure" || e.kind === "revocation" ? "outline" : "secondary"}>{labels[e.kind] ?? e.kind}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{short(e.subject, 12)}</TableCell>
                  <TableCell className="text-right tabular-nums">{e.witnesses}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{ago(e.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
