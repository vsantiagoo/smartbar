import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/session";
import { getAdminRepo } from "@/lib/data";

/** Snapshot do dashboard — usado pelo refetch do hook de tempo real. */
export async function GET() {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const snapshot = await (await getAdminRepo()).getDashboardSnapshot(ctx.hotel.id);
  return NextResponse.json(snapshot, { headers: { "Cache-Control": "no-store" } });
}
