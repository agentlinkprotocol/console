"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const config = { searches: { label: "Searches served", color: "var(--chart-1)" } } satisfies ChartConfig;

export function SearchesChart({ perMinute }: { perMinute: [number, number][] }) {
  const data = perMinute.map(([m, c]) => ({ t: m * 60_000, searches: c }));
  return (
    <ChartContainer config={config} className="h-56 w-full">
      <BarChart accessibilityLayer data={data} margin={{ left: 4, right: 12 }} barCategoryGap={2}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="t" tickLine={false} axisLine={false} tickMargin={8} minTickGap={40} tickFormatter={(v: number) => new Date(v).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} />
        <YAxis width={36} tickLine={false} axisLine={false} allowDecimals={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(_, p) => new Date((p[0]?.payload as { t: number }).t).toLocaleTimeString()} />} />
        <Bar dataKey="searches" fill="var(--color-searches)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
