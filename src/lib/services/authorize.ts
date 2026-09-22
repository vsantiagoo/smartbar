import "server-only";
import { getGuestRepo } from "@/lib/data";
import type { AuthorizeResult } from "@/lib/data/repository";
import { dispatchUnlock } from "@/lib/iot/unlock";

/**
 * Único caminho para autorizar uma compra (webhook Pix, cartão RFID, simulação):
 *   1. abate o estoque + autoriza (atômico no banco)  →  2. dispara a trava (IoT).
 * O evento Realtime para o painel e para o hóspede sai do próprio banco.
 */
export async function authorizeAndUnlock(transactionId: string, by: "pix_webhook" | "rfid"): Promise<AuthorizeResult> {
  const repo = getGuestRepo();
  const result = await repo.authorizeTransaction(transactionId, by);
  if (result.ok && result.roomId) {
    const room = await repo.getRoomById(result.roomId);
    if (room) await dispatchUnlock(room);
  }
  return result;
}
