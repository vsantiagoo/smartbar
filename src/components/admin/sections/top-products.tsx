"use client";
import { GlassCard, SectionTitle } from "@/components/ui/glass-card";
import { EmptyState, Meter } from "@/components/ui/primitives";
import { useI18n } from "@/lib/i18n/client";
import { formatBRL } from "@/lib/utils";
import { ChartNoAxesColumn } from "lucide-react";
import type { DashboardSnapshot } from "@/lib/types";

/** SEÇÃO · Produtos mais vendidos hoje. */
export function TopProducts({ items }: { items: DashboardSnapshot["topProducts"] }) {
  const { t } = useI18n();
  const max = Math.max(1, ...items.map((i) => i.cents));
  return (
    <GlassCard>
      <SectionTitle title={t("admin.top.title")} />
      {items.length === 0 ? (
        <EmptyState icon={ChartNoAxesColumn} title={t("admin.top.empty")} className="py-6" />
      ) : (
        <ul className="space-y-4">
          {items.map((p) => (
            <li key={p.name}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium text-ink">{p.name}</span>
                <span className="tabular shrink-0 text-ink-soft">
                  {t("admin.top.units", { n: p.quantity })} · <span className="font-semibold text-ink">{formatBRL(p.cents)}</span>
                </span>
              </div>
              <Meter value={p.cents} max={max} label={t("admin.top.meter", { name: p.name })} />
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
