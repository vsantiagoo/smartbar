"use client";
import { BedDouble, CircleAlert, FileDown, QrCode, Receipt } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGuest } from "@/components/guest/guest-context";
import { HelpSheet } from "@/components/guest/sections/help-sheet";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { EmptyState } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";
import type { PaymentMethod, TransactionItem } from "@/lib/types";

export interface ConsumptionEntry {
  token: string;
  at: string;
  method: PaymentMethod;
  totalCents: number;
  items: TransactionItem[];
}

/**
 * SEÇÃO · Extrato ao vivo: tudo o que foi consumido na estadia, com horário,
 * forma de pagamento e o recibo de cada compra para download.
 */
export function ConsumptionList({ entries, baseHref }: { entries: ConsumptionEntry[]; baseHref: string }) {
  const { t, formatDateTime, room } = useGuest();
  const [help, setHelp] = useState<string | null>(null);
  const total = entries.reduce((s, e) => s + e.totalCents, 0);

  return (
    <div className="space-y-5">
      <div className="px-1">
        <h1 className="text-[1.75rem] font-bold">{t("guest.consumption.title")}</h1>
        <p className="mt-1 text-ink-soft">{t("guest.consumption.subtitle")}</p>
      </div>

      {entries.length === 0 ? (
        <EmptyState icon={Receipt} title={t("guest.consumption.empty")} />
      ) : (
        <>
          <GlassCard surface="strong" pad="md" className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-ink-soft">{t("guest.consumption.total")}</span>
            <span className="tabular text-3xl font-bold text-ink">{formatBRL(total)}</span>
          </GlassCard>

          <ul className="space-y-3">
            {entries.map((e) => (
              <li key={e.token}>
                <GlassCard pad="md">
                  <div className="flex items-center justify-between gap-2">
                    <span className="tabular text-sm font-semibold text-ink">{formatDateTime(e.at)}</span>
                    <Badge tone={e.method === "pix" ? "ok" : "info"}>
                      {e.method === "pix" ? <QrCode className="size-3.5" /> : <BedDouble className="size-3.5" />}
                      {e.method === "pix" ? t("guest.consumption.pix") : t("guest.consumption.room")}
                    </Badge>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {e.items.map((i) => (
                      <li key={i.productId} className="flex items-baseline justify-between gap-3 text-[0.95rem]">
                        <span className="min-w-0 truncate text-ink">
                          <span className="tabular mr-2 font-semibold text-ink-soft">{i.quantity}×</span>
                          {i.productName}
                        </span>
                        <span className="tabular shrink-0 font-medium">{formatBRL(i.quantity * i.unitPriceCents)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between border-t border-brand-700/10 pt-3">
                    <span className="text-xs text-ink-soft">{e.method === "pix" ? t("guest.consumption.paid") : t("guest.consumption.charged")}</span>
                    <span className="tabular font-bold text-ink">{formatBRL(e.totalCents)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link href={`${baseHref}/recibo/${e.token}`} className={buttonClasses("glass", "sm")}>
                      <FileDown className="size-4" /> {t("guest.consumption.receipt")}
                    </Link>
                    {room.hasLock && (
                      <button
                        onClick={() => setHelp(e.token)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink-soft hover:bg-brand-700/5 hover:text-ink"
                      >
                        <CircleAlert className="size-4" /> {t("guest.consumption.problem")}
                      </button>
                    )}
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        </>
      )}

      <HelpSheet key={help ?? "none"} open={help !== null} onClose={() => setHelp(null)} initialKind="door_problem" transactionToken={help ?? undefined} />
    </div>
  );
}
