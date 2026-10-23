"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { SeriesPoint } from "@/lib/types";

const config = { nodes: { label: "Nodes", color: "var(--chart-1)" } } satisfies ChartConfig;

export function NodesChart({ series }: { series: SeriesPoint[] }) {
  const data = series.map((p) => ({ t: p.minute * 60_000, nodes: p.nodes }));
  return (
    <ChartContainer config={config} className="h-56 w-full">
      <LineChart accessibilityLayer data={data} margin={{ left: 4, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="t" type="number" domain={["dataMin", "dataMax"]} tickLine={false} axisLine={false} tickMargin={8} minTickGap={48} tickFormatter={(v: number) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })} />
        <YAxis width={44} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(_, p) => new Date((p[0]?.payload as { t: number }).t).toLocaleString()} />} />
        <Line dataKey="nodes" type="monotone" stroke="var(--color-nodes)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
