"use client";
import { BedDouble, QrCode, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard, SectionTitle } from "@/components/ui/glass-card";
import { EmptyState } from "@/components/ui/primitives";
import { formatBRL, formatDateTime } from "@/lib/utils";
import type { Transaction, TransactionStatus } from "@/lib/types";
import { useI18n } from "@/lib/i18n/client";
import type { DictKey } from "@/lib/i18n/translate";

const STATUS: Record<TransactionStatus, { labelKey: DictKey; tone: "ok" | "warn" | "danger" | "neutral" }> = {
  authorized: { labelKey: "admin.stay.status.authorized", tone: "ok" },
  pending: { labelKey: "admin.stay.status.pending", tone: "warn" },
  failed: { labelKey: "admin.stay.status.failed", tone: "danger" },
  expired: { labelKey: "admin.stay.status.expired", tone: "neutral" },
  cancelled: { labelKey: "admin.stay.status.cancelled", tone: "neutral" },
};

/** SEÇÃO · Histórico de compras da estadia. */
export function StayHistory({ transactions }: { transactions: Transaction[] }) {
  const { t } = useI18n();
  return (
    <GlassCard>
      <SectionTitle title={t("admin.stay.title")} hint={t("admin.stay.orders", { n: transactions.length })} />
      {transactions.length === 0 ? (
        <EmptyState icon={Receipt} title={t("admin.stay.empty")} className="py-8" />
      ) : (
        <ul className="divide-y divide-brand-700/10">
          {/* `tx` nos itens: `t` aqui é a função de tradução. */}
          {transactions.map((tx) => {
            const Icon = tx.method === "pix" ? QrCode : BedDouble;
            const s = STATUS[tx.status];
            return (
              <li key={tx.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-2xl glass-chip bg-brand-700/10 text-brand-700">
                  <Icon className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">
                    {tx.items.map((i) => `${i.quantity}× ${i.productName}`).join(" · ")}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {formatDateTime(tx.createdAt)} · {tx.method === "pix" ? t("admin.feed.pix") : t("admin.stay.onAccount")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="tabular font-bold text-ink">{formatBRL(tx.totalCents)}</p>
                  <Badge tone={s.tone} className="mt-1">{t(s.labelKey)}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}
