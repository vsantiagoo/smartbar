import { NextResponse } from "next/server";
import { simulationAllowed } from "@/lib/config";
import { getGuestRepo } from "@/lib/data";
import { authorizeAndUnlock } from "@/lib/services/authorize";

/** DEMO: simula o webhook do gateway confirmando o Pix. Desativado em produção. */
export async function POST(request: Request) {
  if (!simulationAllowed) return NextResponse.json({ error: "disabled" }, { status: 404 });
  const { token } = (await request.json().catch(() => ({}))) as { token?: string };
  const tx = token ? await getGuestRepo().getTransactionByToken(token) : null;
  if (!tx || tx.method !== "pix") return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(await authorizeAndUnlock(tx.id, "pix_webhook"));
}
