import { BedDouble, QrCode, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard, SectionTitle } from "@/components/ui/glass-card";
import { EmptyState } from "@/components/ui/primitives";
import { formatBRL, formatDateTime } from "@/lib/utils";
import type { Transaction, TransactionStatus } from "@/lib/types";

const STATUS: Record<TransactionStatus, { label: string; tone: "ok" | "warn" | "danger" | "neutral" }> = {
  authorized: { label: "Aprovado", tone: "ok" },
  pending: { label: "Aguardando", tone: "warn" },
  failed: { label: "Falhou", tone: "danger" },
  expired: { label: "Expirado", tone: "neutral" },
  cancelled: { label: "Cancelado", tone: "neutral" },
};

/** SEÇÃO · Histórico de compras da estadia. */
export function StayHistory({ transactions }: { transactions: Transaction[] }) {
  return (
    <GlassCard>
      <SectionTitle title="Compras da estadia" hint={`${transactions.length} ${transactions.length === 1 ? "pedido" : "pedidos"}`} />
      {transactions.length === 0 ? (
        <EmptyState icon={Receipt} title="Nenhuma compra nesta estadia" className="py-8" />
      ) : (
        <ul className="divide-y divide-brand-700/10">
          {transactions.map((t) => {
            const Icon = t.method === "pix" ? QrCode : BedDouble;
            const s = STATUS[t.status];
            return (
              <li key={t.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-700/10 text-brand-700">
                  <Icon className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-800">
                    {t.items.map((i) => `${i.quantity}× ${i.productName}`).join(" · ")}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {formatDateTime(t.createdAt)} · {t.method === "pix" ? "Pix" : "Lançado na conta"}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="tabular font-bold text-brand-800">{formatBRL(t.totalCents)}</p>
                  <Badge tone={s.tone} className="mt-1">{s.label}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}
