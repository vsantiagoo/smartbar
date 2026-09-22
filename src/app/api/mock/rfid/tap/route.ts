import { NextResponse } from "next/server";
import { simulationAllowed } from "@/lib/config";
import { getGuestRepo } from "@/lib/data";
import { handleRfidTap } from "@/lib/services/rfid";

/** DEMO: simula o ESP32 lendo o cartão RFID da estadia. Desativado em produção. */
export async function POST(request: Request) {
  if (!simulationAllowed) return NextResponse.json({ error: "disabled" }, { status: 404 });
  const { token } = (await request.json().catch(() => ({}))) as { token?: string };
  const repo = getGuestRepo();
  const tx = token ? await repo.getTransactionByToken(token) : null;
  if (!tx) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const [room, stay] = await Promise.all([repo.getRoomById(tx.roomId), repo.findActiveStay(tx.roomId)]);
  if (!room?.deviceId || !stay?.rfidUid) return NextResponse.json({ ok: false, reason: "unknown_card" }, { status: 409 });
  return NextResponse.json(await handleRfidTap(room.deviceId, stay.rfidUid));
}
