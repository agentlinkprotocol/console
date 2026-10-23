import { getStats } from "@/lib/observer";

export const dynamic = "force-dynamic";

export async function GET() {
  const view = await getStats();
  return Response.json(view);
}
