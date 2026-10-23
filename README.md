# Atlas Console

The public site that shows the **Agent Link Protocol Atlas** live: nodes, operators (and whether anyone holds a
majority), zones of meaning, the public ledger, and a semantic explorer. Next.js (App Router) + shadcn/ui. AGPL-3.0.

The Console does not speak to the DHT itself. It reads one or more **observer nodes**: Grid nodes started with
`node.observer = true` and `api.cors_origins = ["*"]`, which aggregate what they see and expose it on
`GET /v1/atlas/stats`. Without any reachable observer it runs in **demo mode**, clearly labelled.

```bash
cp .env.example .env.local      # OBSERVER_URLS=https://observer.example.org:7777  OBSERVER_TOKEN=…
npm install
npm run dev                     # http://localhost:3000
```

Deploy on Vercel (or anywhere Node runs) with the same two environment variables. The observer token is used
server-side only, for the Explorer's searches.

## Branches and releases

Work on `develop`, open a pull request to `main` (`ci`: typecheck, lint, build, every page renders in demo mode,
Docker image builds). Merging into `main` pushes `ghcr.io/agentlinkprotocol/console:latest` (and `:vX.Y.Z`) and
tags the release; connect the repository to Vercel for automatic hosting of `main`.

```bash
docker run -d -p 3000:3000 -e OBSERVER_URLS=https://observer.example.org:7777 -e OBSERVER_TOKEN=... ghcr.io/agentlinkprotocol/console:latest
```
