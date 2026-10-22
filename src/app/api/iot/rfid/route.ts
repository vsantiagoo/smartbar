import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { simulationAllowed } from "@/lib/config";
import { rfidSchema } from "@/lib/schemas";
import { handleRfidTap } from "@/lib/services/rfid";
import { freioPorAlvo, freioPorIp, ORCAMENTO } from "@/lib/rate-limit";

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
  // Os leitores do hotel saem todos pela mesma rede: o teto por IP precisa
  // caber o prédio inteiro. O aperto por dispositivo vem depois da validação.
  const flood = freioPorIp("dispositivo", ORCAMENTO.dispositivo, request);
  if (flood) return flood;

  // Sem IOT_DEVICE_KEY configurada a rota fica fechada — a chave de demonstração
  // só vale fora de produção. Um deploy que esqueça a variável recusa tudo em vez
  // de aceitar uma chave que qualquer um conhece.
  // `||`, não `??`: uma variável DEFINIDA mas VAZIA (linha limpa no .env) cairia
  // aqui como string vazia e fecharia a rota com 401 sem pista nenhuma — a falha
  // aparece como "paguei e a trava não abriu", que é a pior forma de descobrir.
  const expected = process.env.IOT_DEVICE_KEY || (simulationAllowed ? "smartbar-demo-key" : null);
  if (!expected || !safeEqual(request.headers.get("x-device-key") ?? "", expected)) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const parsed = rfidSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, reason: "invalid_payload" }, { status: 400 });

  // Agora o aperto por LEITOR, e só depois de a chave do dispositivo ter sido
  // aceita: um leitor com defeito batendo em laço não consome o orçamento dos
  // outros, e quem não tem a chave nem chega a gastar este balde.
  const porLeitor = freioPorAlvo("dispositivo", ORCAMENTO.dispositivo, parsed.data.deviceId);
  if (porLeitor) return porLeitor;

  const outcome = await handleRfidTap(parsed.data.deviceId, parsed.data.uid);
  return NextResponse.json(outcome, { status: outcome.ok ? 200 : 403 });
}
