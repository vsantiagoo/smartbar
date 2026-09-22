import "server-only";
import type { Room } from "@/lib/types";

export const UNLOCK_SECONDS = 15;

/**
 * Dispara o comando de destravar para o ESP32 do quarto.
 *
 * Em produção: publicar em MQTT sobre TLS, tópico `smartbar/{deviceId}/unlock`
 * com payload `{ "seconds": 15 }` (QoS 1). O ESP32 aciona o relé que energiza a
 * trava solenoide 12V pelo tempo informado e responde em `smartbar/{deviceId}/state`.
 *
 * Aqui é um stub: registra o comando. Troque o corpo por seu cliente MQTT
 * (ex.: `mqtt` + broker gerenciado / HiveMQ / EMQX) quando o hardware estiver pronto.
 */
export async function dispatchUnlock(room: Pick<Room, "id" | "number" | "deviceId">): Promise<void> {
  const topic = `smartbar/${room.deviceId ?? "sem-dispositivo"}/unlock`;
  console.info(`[iot] → ${topic} {"seconds":${UNLOCK_SECONDS}} (quarto ${room.number})`);
}
