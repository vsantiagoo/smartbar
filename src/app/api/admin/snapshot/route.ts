import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/session";
import { getAdminRepo } from "@/lib/data";
import { aplicarFreio, ORCAMENTO } from "@/lib/rate-limit";

/**
 * Snapshot do dashboard — usado pelo refetch do hook de tempo real.
 *
 * Rate limit por EMAIL da sessão: é a identidade autenticada, não o IP
 * (hotel inteiro atrás de NAT). Uma sessão vazada em polling automático
 * continua barrada no mesmo balde.
 */
export async function GET(request: Request) {
  const ctx = await getAdminContext();
  if (!ctx) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const freado = aplicarFreio("admin", ORCAMENTO.admin, request, ctx.email);
  if (freado) return freado;
  const snapshot = await (await getAdminRepo()).getDashboardSnapshot(ctx.hotel.id);
  return NextResponse.json(snapshot, { headers: { "Cache-Control": "no-store" } });
}
