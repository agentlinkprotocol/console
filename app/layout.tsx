import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { getStats } from "@/lib/observer";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? "Atlas Console",
  description: "Live view of the Agent Link Protocol Atlas: nodes, operators, zones of meaning, public ledger.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { source, demo } = await getStats();
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}>
      <body className="min-h-svh bg-background text-foreground">
        <ThemeProvider>
          <SiteHeader source={source} demo={demo} />
          <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">{children}</main>
          <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted-foreground">
            The Atlas proposes candidates; verification happens agent to agent. Nobody owns this network, including whoever runs this page.{" "}
            <a className="underline" href="https://github.com/agentlinkprotocol">
              Source (AGPL-3.0)
            </a>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
