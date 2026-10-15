"use client";
import { PackageCheck, Receipt, ShoppingBag, TrendingUp } from "lucide-react";
import { DotNumber, KpiCard } from "@/components/ui/primitives";
import { useI18n } from "@/lib/i18n/client";
import { formatBRL } from "@/lib/utils";
import type { DashboardSnapshot } from "@/lib/types";

/** SEÇÃO · Indicadores do dia. Cada card é um KpiCard independente. */
export function KpiStrip({ data }: { data: DashboardSnapshot }) {
  const { t } = useI18n();
  return (
    <section aria-label={t("admin.kpi.section")} className="grid grid-cols-2 gap-3 sm:gap-4">
      <KpiCard
        className="col-span-2"
        label={t("admin.kpi.revenue")}
        icon={TrendingUp}
        tone="gold"
        value={<DotNumber className="text-[2.3rem]">{formatBRL(data.revenueTodayCents)}</DotNumber>}
        hint={t("admin.kpi.revenueHint", { pix: data.pixSharePct, account: 100 - data.pixSharePct })}
      />
      <KpiCard
        label={t("admin.kpi.sales")}
        icon={ShoppingBag}
        value={<DotNumber>{data.transactionsToday}</DotNumber>}
        hint={t("admin.kpi.salesHint")}
      />
      <KpiCard
        label={t("admin.kpi.ticket")}
        icon={Receipt}
        value={<DotNumber>{formatBRL(data.avgTicketCents)}</DotNumber>}
        hint={t("admin.kpi.ticketHint")}
      />
      <KpiCard
        label={t("admin.kpi.restock")}
        icon={PackageCheck}
        tone={data.roomsNeedingRestock > 0 ? "danger" : "ok"}
        value={<DotNumber>{data.roomsNeedingRestock}</DotNumber>}
        hint={t("admin.kpi.restockHint", { n: data.itemsToRestock })}
      />
    </section>
  );
}
