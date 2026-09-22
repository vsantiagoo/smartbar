import { GlassCard, SectionTitle } from "@/components/ui/glass-card";
import { EmptyState, Meter } from "@/components/ui/primitives";
import { formatBRL } from "@/lib/utils";
import { ChartNoAxesColumn } from "lucide-react";
import type { DashboardSnapshot } from "@/lib/types";

/** SEÇÃO · Produtos mais vendidos hoje. */
export function TopProducts({ items }: { items: DashboardSnapshot["topProducts"] }) {
  const max = Math.max(1, ...items.map((i) => i.cents));
  return (
    <GlassCard>
      <SectionTitle title="Mais vendidos hoje" />
      {items.length === 0 ? (
        <EmptyState icon={ChartNoAxesColumn} title="Sem vendas ainda" className="py-6" />
      ) : (
        <ul className="space-y-4">
          {items.map((p) => (
            <li key={p.name}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium text-brand-800">{p.name}</span>
                <span className="tabular shrink-0 text-ink-soft">
                  {p.quantity} un · <span className="font-semibold text-brand-800">{formatBRL(p.cents)}</span>
                </span>
              </div>
              <Meter value={p.cents} max={max} label={`Faturamento de ${p.name}`} />
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
