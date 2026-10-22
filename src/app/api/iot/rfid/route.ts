import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { simulationAllowed } from "@/lib/config";
import { rfidSchema } from "@/lib/schemas";
import { handleRfidTap } from "@/lib/services/rfid";
import { freio, origem, ORCAMENTO, respostaFreada } from "@/lib/rate-limit";

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Chamado pelo ESP32 quando o hóspede aproxima o cartão do leitor RFID.
 *
 *   POST /api/iot/rfid
 *   x-device-key: <IOT_DEVICE_KEY>
 *   { "deviceId": "esp32-aurora-101", "uid": "A1B2C3D4" }
 *
 * 200 → { ok: true, unlockSeconds: 15 }   (o firmware aciona o relé)
 * 403 → { ok: false, reason }             (cartão não pertence à estadia / sem pedido)
 */
export async function POST(request: Request) {
  const passe = freio(`dispositivo:${origem(request)}`, ORCAMENTO.dispositivo.limite, ORCAMENTO.dispositivo.janelaMs);
  if (!passe.permitido) return respostaFreada(passe);

  // Sem IOT_DEVICE_KEY configurada a rota fica fechada — a chave de demonstração
  // só vale fora de produção. Um deploy que esqueça a variável recusa tudo em vez
  // de aceitar uma chave que qualquer um conhece.
  const expected = process.env.IOT_DEVICE_KEY ?? (simulationAllowed ? "smartbar-demo-key" : null);
  if (!expected || !safeEqual(request.headers.get("x-device-key") ?? "", expected)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const parsed = rfidSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, reason: "invalid_payload" }, { status: 400 });

  const outcome = await handleRfidTap(parsed.data.deviceId, parsed.data.uid);
  return NextResponse.json(outcome, { status: outcome.ok ? 200 : 403 });
}
