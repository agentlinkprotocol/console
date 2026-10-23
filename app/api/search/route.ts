import { searchAtlas } from "@/lib/observer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { text?: string; k?: number };
  const text = (body.text ?? "").trim();
  if (text.length < 2 || text.length > 300) {
    return Response.json({ error: "query must be 2..300 characters" }, { status: 400 });
  }
  try {
    return Response.json(await searchAtlas(text, Math.min(body.k ?? 20, 50)));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 502 });
  }
}
