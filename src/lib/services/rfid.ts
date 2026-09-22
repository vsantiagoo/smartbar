import "server-only";
import { getGuestRepo } from "@/lib/data";
import { authorizeAndUnlock } from "@/lib/services/authorize";

export type RfidOutcome =
  | { ok: true; unlockSeconds: number; roomNumber: string }
  | { ok: false; reason: "unknown_device" | "unknown_card" | "no_pending_order" | "stay_mismatch" | "not_authorized"; status?: string };

/**
 * Lógica do endpoint chamado pelo ESP32 quando o hóspede aproxima o cartão.
 * Valida a IDENTIDADE (cartão = estadia ativa do quarto) e só então autoriza o
 * pedido "lançar na conta" que está aguardando.
 */
export async function handleRfidTap(deviceId: string, uid: string): Promise<RfidOutcome> {
  const repo = getGuestRepo();
  const room = await repo.findRoomByDeviceId(deviceId);
  if (!room) return { ok: false, reason: "unknown_device" };
  await repo.touchDevice(room.id);

  const stay = await repo.findActiveStay(room.id);
  if (!stay?.rfidUid || stay.rfidUid.toUpperCase() !== uid.toUpperCase()) {
    return { ok: false, reason: "unknown_card" };
  }

  const tx = await repo.findPendingRoomCharge(room.id);
  if (!tx) return { ok: false, reason: "no_pending_order" };
  if (tx.stayId !== stay.id) return { ok: false, reason: "stay_mismatch" };

  const result = await authorizeAndUnlock(tx.id, "rfid");
  if (!result.ok) return { ok: false, reason: "not_authorized", status: result.status };
  return { ok: true, unlockSeconds: 15, roomNumber: room.number };
}
