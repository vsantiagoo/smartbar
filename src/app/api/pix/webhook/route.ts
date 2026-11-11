import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { guardaRequisicao } from "@/lib/api-guard";
import { getGuestRepo } from "@/lib/data";
import { pixWebhookSchema } from "@/lib/schemas";
import { authorizeAndUnlock } from "@/lib/services/authorize";

const PAID_EVENTS = new Set(["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"]);

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * IDEMPOTÊNCIA RÁPIDA do webhook.
 *
 * `authorizeAndUnlock` já é idempotente contra DB — o `select ... for update`
 * na transação impede abater estoque duas vezes. Mas cada reenvio ainda
 * atravessa a stack toda até lá: consulta ao banco, dois locks, chamada do
 * IoT com retry. Em pico (provedor Pix em replay porque perdeu ack), isso
 * vira pressão de recurso que não precisava existir.
 *
 * Em memória do processo guardamos os paymentId já vistos nos últimos 10
 * minutos. Reenvio rápido é identificado aqui e respondido 200 sem tocar no
 * resto. Em serverless cada instância tem a sua janela, mas a autorização
 * no banco continua sendo a última palavra — este cache é só para ALIVIAR.
 */
const JANELA_IDEMPOTENCIA_MS = 10 * 60_000;
const paymentIdsVistos = new Map<string, number>();
/** @internal — só para testes zerarem a janela de idempotência entre casos. */
export function _resetIdempotenciaPix(): void {
  paymentIdsVistos.clear();
}
function jaProcessado(paymentId: string): boolean {
  const agora = Date.now();
  // Limpa expirados preguiçosamente.
  if (paymentIdsVistos.size > 5_000) {
    for (const [k, t] of paymentIdsVistos) {
      if (agora - t > JANELA_IDEMPOTENCIA_MS) paymentIdsVistos.delete(k);
    }
  }
  const visto = paymentIdsVistos.get(paymentId);
  if (visto !== undefined && agora - visto < JANELA_IDEMPOTENCIA_MS) return true;
  paymentIdsVistos.set(paymentId, agora);
  return false;
}

/**
 * Webhook do gateway Pix (formato Asaas; adapte para Mercado Pago).
 * O gateway envia o token configurado no header `asaas-access-token`.
 * `payment.externalReference` = id da nossa transação. Idempotente.
 */
export async function POST(request: Request) {
  const g = guardaRequisicao(request);
  if (g.erro) return g.erro;
  const expected = process.env.PIX_WEBHOOK_TOKEN;
  const received = request.headers.get("asaas-access-token") ?? "";
  if (!expected || !safeEqual(received, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = pixWebhookSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  const { event, payment } = parsed.data;

  if (!PAID_EVENTS.has(event) || !payment.externalReference) {
    return NextResponse.json({ ignored: true });
  }

  // Replay rápido do mesmo paymentId: 200 silencioso. O DB ainda tem a palavra
  // final via `authorizeAndUnlock`; este cache só alivia a stack sob replay.
  if (payment.id && jaProcessado(payment.id)) {
    return NextResponse.json({ idempotent: true });
  }

  const tx = await getGuestRepo().getTransactionById(payment.externalReference);
  if (!tx) return NextResponse.json({ ignored: true });

  // CONFERE O VALOR antes de autorizar. A regra do produto é "a trava não abre
  // sem pagamento confirmado" — e pagamento confirmado é do valor certo. Sem
  // esta conferência, um evento de pagamento parcial (ou um erro do gateway
  // apontando para o pedido errado) abriria a trava do pedido inteiro.
  //
  // O valor vem em REAIS e com ponto flutuante; a comparação é feita em
  // centavos inteiros. Aceita a MAIS — pagar demais é problema de estorno, não
  // razão para manter o hóspede trancado. Recusa a MENOS.
  if (typeof payment.value === "number") {
    const pagoCentavos = Math.round(payment.value * 100);
    if (pagoCentavos < tx.totalCents) {
      console.warn("[pix/webhook] valor insuficiente", {
        transacao: tx.id,
        esperado: tx.totalCents,
        pago: pagoCentavos,
      });
      return NextResponse.json({ error: "amount_mismatch" }, { status: 409 });
    }
  }

  const result = await authorizeAndUnlock(tx.id, "pix_webhook");
  return NextResponse.json(result);
}
