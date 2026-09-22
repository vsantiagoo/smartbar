import { CircleCheck, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { DotNumber } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";
import type { RoomDetail } from "@/lib/types";

/**
 * SEÇÃO · Valores para o check-out.
 * Pix já foi quitado no ato da compra; só o "lançado na conta" vai para a fatura.
 */
export function CheckoutSummary({ detail }: { detail: RoomDetail }) {
  const { paidPixCents, roomChargeCents, stay } = detail;
  return (
    <GlassCard surface="navy" pad="lg">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Check-out</h2>
        <Badge tone="gold">Plano Plus</Badge>
      </div>

      <p className="mt-5 text-sm text-white/70">A cobrar na fatura do quarto</p>
      <DotNumber className="mt-2 block text-[2.5rem] !text-gold-400">{formatBRL(roomChargeCents)}</DotNumber>

      <dl className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-white/70">
            <CircleCheck className="size-4 text-ok-500" /> Já pago via Pix
          </dt>
          <dd className="tabular font-semibold text-white">{formatBRL(paidPixCents)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/70">Total consumido na estadia</dt>
          <dd className="tabular font-semibold text-white">{formatBRL(paidPixCents + roomChargeCents)}</dd>
        </div>
      </dl>

      <Button
        variant="accent"
        className="mt-6 w-full"
        disabled={!stay || roomChargeCents === 0}
        icon={<Send className="size-4" />}
        title="Integração com o PMS do hotel (plano Premium)"
      >
        Enviar ao PMS
      </Button>
      <p className="mt-3 text-center text-xs text-white/55">
        {roomChargeCents === 0 ? "Nada a lançar: o consumo foi pago no ato." : "Integração de fatura disponível no plano Premium."}
      </p>
    </GlassCard>
  );
}
