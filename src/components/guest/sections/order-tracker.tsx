"use client";
import { OrderFailure } from "@/components/guest/sections/order-failure";
import { OrderSuccess } from "@/components/guest/sections/order-success";
import { PixPayment } from "@/components/guest/sections/pix-payment";
import { RfidWaiting } from "@/components/guest/sections/rfid-waiting";
import { useTransactionStatus } from "@/lib/realtime/use-transaction-status";
import type { PublicTransaction } from "@/lib/types";

/**
 * TELA · Acompanhamento do pedido. Escuta o evento de status via Realtime
 * (com polling de segurança) e troca de seção sozinha:
 *   pendente(Pix) → PixPayment · pendente(conta) → RfidWaiting
 *   autorizado → OrderSuccess · expirado/falhou → OrderFailure
 */
export function OrderTracker({ initial, baseHref, showDemoTools }: { initial: PublicTransaction; baseHref: string; showDemoTools: boolean }) {
  const { tx } = useTransactionStatus(initial);

  switch (tx.status) {
    case "authorized":
      return <OrderSuccess tx={tx} baseHref={baseHref} />;
    case "pending":
      return tx.method === "pix" ? (
        <PixPayment tx={tx} showDemoTools={showDemoTools} />
      ) : (
        <RfidWaiting tx={tx} showDemoTools={showDemoTools} />
      );
    default:
      return <OrderFailure tx={tx} baseHref={baseHref} />;
  }
}
