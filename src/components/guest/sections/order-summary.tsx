import { GlassCard } from "@/components/ui/glass-card";
import { formatBRL } from "@/lib/utils";

export interface SummaryLine {
  name: string;
  quantity: number;
  unitPriceCents: number;
}

/** SEÇÃO · Resumo do pedido (usado no checkout, na espera e no sucesso). */
export function OrderSummary({ lines, title = "Resumo do pedido", totalLabel = "Total" }: { lines: SummaryLine[]; title?: string; totalLabel?: string }) {
  const total = lines.reduce((s, l) => s + l.quantity * l.unitPriceCents, 0);
  return (
    <GlassCard pad="md">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">{title}</h2>
      <ul className="mt-3 space-y-2.5">
        {lines.map((l) => (
          <li key={l.name} className="flex items-baseline justify-between gap-3 text-[0.95rem]">
            <span className="min-w-0 truncate text-ink">
              <span className="tabular mr-2 font-semibold text-ink-soft">{l.quantity}×</span>
              {l.name}
            </span>
            <span className="tabular shrink-0 font-medium">{formatBRL(l.quantity * l.unitPriceCents)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-baseline justify-between border-t border-brand-700/10 pt-4">
        <span className="font-medium text-ink-soft">{totalLabel}</span>
        <span className="tabular text-2xl font-bold text-ink">{formatBRL(total)}</span>
      </div>
    </GlassCard>
  );
}
