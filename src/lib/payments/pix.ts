import "server-only";
import { randomUUID } from "node:crypto";

export interface PixChargeInput {
  transactionId: string;
  amountCents: number;
  description: string;
  expiresInSeconds: number;
}

export interface PixCharge {
  externalId: string;
  /** Pix "Copia e Cola" (BR Code EMV). */
  copyPaste: string;
}

/**
 * Contrato do gateway. Para produção, implemente para Asaas ou Mercado Pago:
 *  - Asaas:        POST /v3/payments (billingType PIX) + GET /payments/{id}/pixQrCode
 *  - Mercado Pago: POST /v1/payments (payment_method_id "pix")
 * E aponte o webhook do gateway para /api/pix/webhook.
 */
export interface PixProvider {
  createCharge(input: PixChargeInput): Promise<PixCharge>;
}

// ── BR Code (EMV-MPM) ────────────────────────────────────────────
function tlv(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

const strip = (s: string): string => s.normalize("NFD").replace(/[^\x20-\x7E]/g, "");

function buildBrCode(args: { key: string; name: string; city: string; amountCents: number; txid: string }): string {
  const body =
    tlv("00", "01") +
    tlv("26", tlv("00", "br.gov.bcb.pix") + tlv("01", args.key)) +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", (args.amountCents / 100).toFixed(2)) +
    tlv("58", "BR") +
    tlv("59", strip(args.name).slice(0, 25)) +
    tlv("60", strip(args.city).slice(0, 15)) +
    tlv("62", tlv("05", args.txid.replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "***")) +
    "6304";
  return body + crc16(body);
}

/** Simula a chamada ao gateway (latência + resposta), sem rede. */
class MockPixProvider implements PixProvider {
  async createCharge(input: PixChargeInput): Promise<PixCharge> {
    await new Promise((r) => setTimeout(r, 180));
    return {
      externalId: `pay_mock_${randomUUID().slice(0, 8)}`,
      copyPaste: buildBrCode({
        key: "pix@smartbar.com.br",
        name: "SmartBar Minibar",
        city: "SAO PAULO",
        amountCents: input.amountCents,
        txid: input.transactionId,
      }),
    };
  }
}

export function getPixProvider(): PixProvider {
  const provider = process.env.PIX_PROVIDER ?? "mock";
  if (provider === "mock") return new MockPixProvider();
  throw new Error(`PIX_PROVIDER "${provider}" ainda não implementado — veja src/lib/payments/pix.ts`);
}
