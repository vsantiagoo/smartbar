import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
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
 * Webhook do gateway Pix (formato Asaas; adapte para Mercado Pago).
 * O gateway envia o token configurado no header `asaas-access-token`.
 * `payment.externalReference` = id da nossa transação. Idempotente.
 */
export async function POST(request: Request) {
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
