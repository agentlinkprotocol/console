import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoBanner } from "@/components/demo-banner";
import { fmt, pct, short } from "@/lib/format";
import { getStats } from "@/lib/observer";

export const dynamic = "force-dynamic";

const buckets = ["0", "1-7", "8-30", "31-90", "91-365", "365+"];

export default async function NodesPage() {
  const { stats, demo } = await getStats();
  const histTotal = Object.values(stats.seniority_histogram).reduce((a, b) => a + b, 0) || 1;
  return (
    <>
      <DemoBanner demo={demo} />
      <Card>
        <CardHeader>
          <CardTitle>Operators</CardTitle>
          <CardDescription>
            Share of known nodes per operator. The rule the network is built around: nobody, not even the protocol&apos;s creator, should ever hold a majority.
            Largest share today: <strong>{pct(stats.biggest_operator_share)}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="operators">
            <TabsList variant="line">
              <TabsTrigger value="operators">Operators</TabsTrigger>
              <TabsTrigger value="seniority">Seniority</TabsTrigger>
              <TabsTrigger value="prefixes">Network prefixes</TabsTrigger>
            </TabsList>
            <TabsContent value="operators">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operator key</TableHead>
                    <TableHead className="text-right">Nodes</TableHead>
                    <TableHead className="text-right">Share</TableHead>
                    <TableHead className="text-right">Seniority (node-days)</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.operators.map((o) => (
                    <TableRow key={o.operator}>
                      <TableCell className="font-mono text-xs">{short(o.operator, 12)}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmt.format(o.nodes)}</TableCell>
                      <TableCell className="text-right tabular-nums">{pct(o.share)}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmt.format(o.seniority_days)}</TableCell>
                      <TableCell className="text-right">{o.share >= 0.5 ? <Badge variant="destructive">majority</Badge> : o.share >= 0.2 ? <Badge variant="outline">large</Badge> : null}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="seniority">
              <p className="mb-3 text-sm text-muted-foreground">Days of proven service within the last year. A node&apos;s weight in routing, guardian order and quota comes from here, not from CPU.</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Earned days</TableHead>
                    <TableHead className="text-right">Nodes</TableHead>
                    <TableHead className="text-right">Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buckets.map((b) => (
                    <TableRow key={b}>
                      <TableCell>{b}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmt.format(stats.seniority_histogram[b] ?? 0)}</TableCell>
                      <TableCell className="text-right tabular-nums">{pct((stats.seniority_histogram[b] ?? 0) / histTotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="prefixes">
              <p className="mb-3 text-sm text-muted-foreground">Nodes per /16 (IPv4) or /48 (IPv6) prefix. At most 2 guardians of the same data may share a prefix.</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prefix</TableHead>
                    <TableHead className="text-right">Nodes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.prefixes.map((p) => (
                    <TableRow key={p.prefix || "unknown"}>
                      <TableCell className="font-mono text-xs">{p.prefix || "unknown"}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmt.format(p.nodes)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
