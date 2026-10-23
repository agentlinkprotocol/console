import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const nav = [
  { href: "/", label: "Overview" },
  { href: "/nodes", label: "Nodes & operators" },
  { href: "/zones", label: "Zones" },
  { href: "/ledger", label: "Ledger" },
  { href: "/explorer", label: "Explorer" },
];

export function SiteHeader({ source, demo }: { source: string; demo: boolean }) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <span className="inline-block size-3 rounded-sm bg-chart-1" aria-hidden />
          {process.env.NEXT_PUBLIC_SITE_NAME ?? "Atlas Console"}
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-md px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          {demo ? <Badge variant="outline">demo data</Badge> : <Badge variant="secondary">observer: {new URL(source).host}</Badge>}
        </div>
      </div>
      <Separator />
    </header>
  );
}
