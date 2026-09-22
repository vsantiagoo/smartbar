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

  const result = await authorizeAndUnlock(tx.id, "pix_webhook");
  return NextResponse.json(result);
}
